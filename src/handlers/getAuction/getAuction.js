const AWS = require('aws-sdk');
const createError = require('http-errors');

AWS.config.update({
    region: 'ap-south-1'
});

var dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
    let auction;
    const { id } = event.pathParameters;
    console.log(id);
    try {
        const result = await dynamodb.get({
            TableName: 'auctions-table',
            Key: { id: id },
        }).promise();

        auction = result.Item;
        if (!auction) {
            throw new createError.NotFound(`Auction with ${id} not found!`);
        }
        return {
            statusCode: 200,
            body: JSON.stringify(auction),
        }
    } catch (e) {
        console.error(e);
        //throw new createError.InternalServerError(e);
    }
};

// module.exports.handler = async (event, context) => {
//     const body = JSON.parse(event.body);
//     //let responseMessage = "Hello, World!";

//     let auction;
//     const { id } = event.pathParameters;

//     try {
//         const result = await dynamodb.get({
//             TableName: 'auctions-table',
//             Key: { id },
//         }).promise();

//         auction = result.Item;
//     } catch (error) {
//         console.error(error);
//         //throw new createError.InternalServerError(error);
//         if (!auction) {
//             throw new createError.NotFound(`Auction with ${id} ID not found`);
//         }
//     }

//     return {
//         statusCode: 200,
//         body: JSON.stringify(auction)
//     }
// }
