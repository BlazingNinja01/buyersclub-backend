const AWS = require('aws-sdk');
const createError = require('http-errors');

AWS.config.update({
    region: 'ap-south-1'
});

var dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
    let auctions;
    try {
        const result = await dynamodb.query({
            TableName: 'auctions-table',
            IndexName: 'statusAndEndingDate',
            KeyConditionExpression: '#status = :status',
            ExpressionAttributeValues: {
                ':status': 'OPEN',
            },
            ExpressionAttributeNames: {
                '#status': 'status',
            },
        }).promise();

        auctions = result.Items;
        const body = JSON.parse(event.body);
        return {
            statusCode: 200,
            body: JSON.stringify(auctions),
        }
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }
}