const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-south-1'
});

var dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {

    const { id } = event.pathParameters;
    // const { status } = JSON.parse(event.body);

    const getSale = await dynamodb.get({
        TableName: 'buyers-club-table',
        Key: { id },
    }).promise();

    //console.log(getSale.Item);

    const result = await dynamodb.update({
        TableName: 'buyers-club-table',
        Key: { id },
        UpdateExpression: 'set paymentStatus = :paymentStatus',
        ExpressionAttributeValues: {
            ':paymentStatus': "SUCCESS"
        },
        ReturnValues: 'ALL_NEW'
    }).promise();

    response = {
        statusCode: 200,
        message: "SUCCESS"
    }

    return {
        body: JSON.stringify(response)
    };
}