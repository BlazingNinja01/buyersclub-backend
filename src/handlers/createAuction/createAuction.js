const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');
AWS.config.update({
  region: 'us-east-1'
});
var dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  const { title } = JSON.parse(event.body);
  const { imageBase64 } = JSON.parse(event.body);
  const { minAmount } = JSON.parse(event.body);
  const email = JSON.parse(JSON.stringify(event))["requestContext"]["authorizer"]["email"];
  console.log(email);

  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  var auction = {
    id: uuid(),
    title: title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
    seller: email,
    imageBase64: imageBase64,
    minAmount: minAmount,
  };

  await dynamodb.put({
    TableName: 'auctions-table',
    Item: auction,
  }).promise();


  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}
