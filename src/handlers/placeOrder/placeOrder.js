const AWS = require('aws-sdk');
const { create } = require('domain');
const createError = require('http-errors');

AWS.config.update({
    region: 'ap-south-1',
});

var dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
    const { id } = event.pathParameters;
    const { customerAddress } = JSON.parse(event.body);
    // const { amount } = JSON.parse(event.body);
    //const { minAmount } = JSON.parse(event.body);
    const email = JSON.parse(JSON.stringify(event))["requestContext"]["authorizer"]["email"];
    const customerName = JSON.parse(JSON.stringify(event))["requestContext"]["authorizer"]["name"];
    console.log(email);
    console.log(customerName);

    var responseMessage = 'Order Placed!'
    var statusKeyword = 'CLOSED';

    const params = {
        TableName: 'buyers-club-table',
        Key: { id },
        // UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
        UpdateExpression: 'set #status = :status, customerEmail = :customerEmail, customerAddress = :customerAddress, customerName = :customerName',
        ExpressionAttributeValues: {
            // ':amount': amount,
            ':customerEmail': email,
            ':status': statusKeyword,
            ':customerAddress': customerAddress,
            ':customerName': customerName
        },
        ExpressionAttributeNames: {
            '#status': 'status'
        },
        ReturnValues: 'ALL_NEW',
    }

    const getSale = await dynamodb.get({
        TableName: 'buyers-club-table',
        Key: { id },
    }).promise();

    console.log(getSale.Item.seller);

    try {
        const result = await dynamodb.update(params).promise();
        response = {
            statusCode: 200,
            message: "Order Placed"
        }

        return {
            body: JSON.stringify(response)
        }

    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }



    // if (!getSale) {
    //     throw new createError.NotFound(`Item ${id} not found!`);
    //     return {
    //         statusCode: 404,
    //         body: JSON.stringify(`Item with ${id} not found`),
    //     }
    // } else if (getSale.Item.status === 'CLOSED') {
    //     throw new createError.Forbidden(`Cannot place bid on closed sale: ${id}`);
    //     return {
    //         statusCode: 403,
    //         body: JSON.stringify(`Cannot place bid on closed sale: ${id}`),
    //     }
    // } else if (getSale.Item.seller === email) {
    //     throw new createError.Forbidden(`Cannot place bid on user's own item: user email: ${email} = ${getSale.seller}`);
    //     return {
    //         statusCode: 403,
    //         body: JSON.stringify(),
    //     }
    // }
    // else if (amount <= getSale.Item.highestBid.amount) {
    //     throw new createError.Forbidden(`Your bidding amount must be higher than ${getSale.Item.highestBid.amount}`);
    //     return {
    //         statusCode: 403,
    //         body: JSON.stringify(`Your bidding amount must be higher than ${getSale.Item.highestBid.amount}`),
    //     }
    // }
    // else if (amount <= getSale.Item.minAmount) {
    //     throw new createError.Forbidden(`Bidding amount must be higher then the minimum amount appicable for the item ${getSale.Item.minAmount}`);
    //     return {
    //         statusCode: 403,
    //         body: JSON.stringify(`Bidding amount must be higher than the minimum amount applicable for the item`),
    //     }
    // }
    // else {
    // try {
    //     const result = await dynamodb.update(params).promise();
    //     return {
    //         statusCode: 200,
    //         body: JSON.stringify(responseMessage),
    //     };
    // } catch (error) {
    //     console.error(error);
    //     throw new createError.InternalServerError(error);
    // }
    // }
}