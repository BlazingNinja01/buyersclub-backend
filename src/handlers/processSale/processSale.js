const createError = require('http-errors');
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

AWS.config.update({
    region: 'ap-south-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {

    this.getSoldItems = async function () {
        const now = new Date();

        const soldItems = await dynamodb.query({
            TableName: 'buyers-club-table',
            IndexName: 'statusAndEndingDate',
            KeyConditionExpression: '#status = :status AND endingAt <= :now',
            // KeyConditionExpression: '#status = :status',
            ExpressionAttributeValues: {
                ':status': 'OPEN',
                ':now': now.toISOString(),
            },
            ExpressionAttributeNames: {
                '#status': 'status',
            },
        }).promise();
        return soldItems.Items;

    };

    this.closeSale = async function (sale) {

        const result = await dynamodb.update({
            TableName: 'buyers-club-table',
            Key: { id: sale.id },
            // UpdateExpression: 'set #status = :status, #deliveryStatus = :deliveryStatus',
            UpdateExpression: 'set #status = :status',
            ExpressionAttributeValues: {
                ':status': 'CLOSED',
                // ':deliveryStatus': 'DELIVERED'
            },
            ExpressionAttributeNames: {
                '#status': 'status',
                // '#deliveryStatus': 'deliveryStatus'
            },
            ReturnValues: 'ALL_NEW',
        }).promise();
        //return result;
        // console.log(JSON.stringify(sale));

        const title = JSON.parse(JSON.stringify(sale))["title"];
        const sellerEmail = JSON.parse(JSON.stringify(sale))["sellerEmail"];
        const amount = JSON.parse(JSON.stringify(sale))["amount"];
        // const amount = JSON.parse(JSON.stringify(sale))["customer"];
        // const bidder = JSON.parse(JSON.stringify(sale))["highestBid"]["bidder"];

        // console.log(JSON.parse(JSON.stringify(auction))["title"]);
        // console.log(title);
        // console.log(seller);
        // console.log(highestBid);
        // console.log(amount);
        // console.log(bidder);

        // if (amount === 0) {
        //     await sqs.sendMessage({
        //         QueueUrl: "https://sqs.us-east-1.amazonaws.com/859956907052/auction-mailQueue",
        //         MessageBody: JSON.stringify({
        //             subject: `No bids on your item :(`,
        //             recipient: seller,
        //             body: `Your item ${title} remain unsold. Better luck next time :)`,
        //         }),
        //     }).promise();
        // } else {
        //     const notifySeller = await sqs.sendMessage({
        //         MessageBody: JSON.stringify({
        //             subject: 'Your item has been sold!',
        //             recipient: seller,
        //             body: `Congrats! Your item ${title} has been sold for $${amount}.`,
        //         }),
        //         QueueUrl: "https://sqs.us-east-1.amazonaws.com/859956907052/auction-mailQueue",
        //     }).promise();

        //     const notifyBidder = await sqs.sendMessage({
        //         MessageBody: JSON.stringify({
        //             subject: 'You have won an auction!',
        //             recipient: bidder,
        //             body: `What a great deal! You've got yourself a ${title} for $${amount}`,
        //         }),
        //         QueueUrl: "https://sqs.us-east-1.amazonaws.com/859956907052/auction-mailQueue",
        //     }).promise();

        //     return Promise.all([notifySeller, notifyBidder]);
        // }
    };

    try {
        const salesToTerminate = await this.getSoldItems();
        const closePromises = salesToTerminate.map(sale => this.closeSale(sale));
        await Promise.all(closePromises);

        return {
            terminated: closePromises.length,
        }
        
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }
}