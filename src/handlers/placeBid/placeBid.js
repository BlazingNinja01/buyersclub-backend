const AWS = require('aws-sdk');
const { create } = require('domain');
const createError = require('http-errors');

AWS.config.update({
    region: 'us-east-1',
});

var dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
    const { id } = event.pathParameters;
    const { amount } = JSON.parse(event.body);
    //const { minAmount } = JSON.parse(event.body);
    const email = JSON.parse(JSON.stringify(event))["requestContext"]["authorizer"]["email"];
    console.log(email);

    var responseMessage = 'Bid Placed!'

    const params = {
        TableName: 'auctions-table',
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
        ExpressionAttributeValues: {
            ':amount': amount,
            ':bidder': email
        },
        ReturnValues: 'ALL_NEW',
    }

    const getAuction = await dynamodb.get({
        TableName: 'auctions-table',
        Key: { id },
    }).promise();

    console.log(getAuction.Item.seller);

    if (!getAuction) {
        throw new createError.NotFound(`Auction ${id} not found!`);
        return {
            statusCode: 404,
            body: JSON.stringify(`Auction with ${id} not found`),
        }
    } else if (getAuction.Item.status === 'CLOSED') {
        throw new createError.Forbidden(`Cannot place bid on closed auction: ${id}`);
        return {
            statusCode: 403,
            body: JSON.stringify(`Cannot place bid on closed auction: ${id}`),
        }
    } else if (getAuction.Item.seller === email) {
        throw new createError.Forbidden(`Cannot place bid on user's own auction: user email: ${email} = ${getAuction.seller}`);
        return {
            statusCode: 403,
            body: JSON.stringify(),
        }
    }
    else if (amount <= getAuction.Item.highestBid.amount) {
        throw new createError.Forbidden(`Your bidding amount must be higher than ${getAuction.Item.highestBid.amount}`);
        return {
            statusCode: 403,
            body: JSON.stringify(`Your bidding amount must be higher than ${getAuction.Item.highestBid.amount}`),
        }
    }
    else if (amount <= getAuction.Item.minAmount) {
        throw new createError.Forbidden(`Bidding amount must be higher then the minimum amount appicable for the item ${getAuction.Item.minAmount}`);
        return {
            statusCode: 403,
            body: JSON.stringify(`Bidding amount must be higher than the minimum amount applicable for the item`),
        }
    } else {
        try {
            const result = await dynamodb.update(params).promise();
            return {
                statusCode: 200,
                body: JSON.stringify(responseMessage),
            };
        } catch (error) {
            console.error(error);
            throw new createError.InternalServerError(error);
        }
    }
}