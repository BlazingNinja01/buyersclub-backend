const AWS = require('aws-sdk');
const createError = require('http-errors');

AWS.config.update({
    region: 'ap-south-1'
});

var dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
    let sale;
    const { id } = event.pathParameters;
    console.log(id);
    try {
        const result = await dynamodb.get({
            TableName: 'buyers-club-table',
            Key: { id: id },
        }).promise();

        sale = result.Item;
        if (!sale) {
            throw new createError.NotFound(`Item with ${id} not found!`);
        }
        return {
            statusCode: 200,
            body: JSON.stringify(sale),
        }
    } catch (e) {
        console.error(e);
        //throw new createError.InternalServerError(e);
    }
};

// module.exports.handler = async (event, context) => {
//     const body = JSON.parse(event.body);
//     //let responseMessage = "Hello, World!";

//     let sale;
//     const { id } = event.pathParameters;

//     try {
//         const result = await dynamodb.get({
//             TableName: 'buyers-club-table',
//             Key: { id },
//         }).promise();

//         sale = result.Item;
//     } catch (error) {
//         console.error(error);
//         //throw new createError.InternalServerError(error);
//         if (!sale) {
//             throw new createError.NotFound(`sale with ${id} ID not found`);
//         }
//     }

//     return {
//         statusCode: 200,
//         body: JSON.stringify(sale)
//     }
// }
