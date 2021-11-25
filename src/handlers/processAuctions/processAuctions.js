const createError = require('http-errors');
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

AWS.config.update({
    region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
    this.getEndedAuctions = async function () {
        const now = new Date();

        const endedAuctions = await dynamodb.query({
            TableName: 'auctions-table',
            IndexName: 'statusAndEndingDate',
            KeyConditionExpression: '#status = :status AND endingAt <= :now',
            ExpressionAttributeValues: {
                ':status': 'OPEN',
                ':now': now.toISOString(),
            },
            ExpressionAttributeNames: {
                '#status': 'status',
            },
        }).promise();
        return endedAuctions.Items;
    };

    this.closeAuction = async function (auction) {

        const result = await dynamodb.update({
            TableName: 'auctions-table',
            Key: { id: auction.id },
            UpdateExpression: 'set #status = :status',
            ExpressionAttributeValues: {
                ':status': 'CLOSED',
            },
            ExpressionAttributeNames: {
                '#status': 'status',
            },
            ReturnValues: 'ALL_NEW',
        }).promise();
        //return result;
        console.log(JSON.stringify(auction));

        const title = JSON.parse(JSON.stringify(auction))["title"];
        const seller = JSON.parse(JSON.stringify(auction))["seller"];
        const highestBid = JSON.parse(JSON.stringify(auction))["highestBid"];
        const amount = JSON.parse(JSON.stringify(auction))["highestBid"]["amount"];
        const bidder = JSON.parse(JSON.stringify(auction))["highestBid"]["bidder"];

        console.log(JSON.parse(JSON.stringify(auction))["title"]);
        console.log(title);
        console.log(seller);
        console.log(highestBid);
        console.log(amount);
        console.log(bidder);

        if (amount === 0) {
            await sqs.sendMessage({
                QueueUrl: "https://sqs.us-east-1.amazonaws.com/859956907052/auction-mailQueue",
                MessageBody: JSON.stringify({
                    subject: `No bids on your item :(`,
                    recipient: seller,
                    body: `Your item ${title} remain unsold. Better luck next time :)`,
                }),
            }).promise();
        } else {
            const notifySeller = await sqs.sendMessage({
                MessageBody: JSON.stringify({
                    subject: 'Your item has been sold!',
                    recipient: seller,
                    body: `Congrats! Your item ${title} has been sold for $${amount}.`,
                }),
                QueueUrl: "https://sqs.us-east-1.amazonaws.com/859956907052/auction-mailQueue",
            }).promise();

            const notifyBidder = await sqs.sendMessage({
                MessageBody: JSON.stringify({
                    subject: 'You have won an auction!',
                    recipient: bidder,
                    body: `What a great deal! You've got yourself a ${title} for $${amount}`,
                }),
                QueueUrl: "https://sqs.us-east-1.amazonaws.com/859956907052/auction-mailQueue",
            }).promise();

            return Promise.all([notifySeller, notifyBidder]);
        }
    };

    try {
        const auctionsToClose = await this.getEndedAuctions();
        const closePromises = auctionsToClose.map(auction => this.closeAuction(auction));
        await Promise.all(closePromises);

        return {
            closed: closePromises.length,
        }
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }
}