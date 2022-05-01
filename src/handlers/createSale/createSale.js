const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');
AWS.config.update({
  region: 'ap-south-1'
});
var dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {

  //console.log(event);
  //console.log(event.headers['x-requested-with']);
  const { title } = JSON.parse(event.body);
  const { imageBase64 } = JSON.parse(event.body);
  // const { minAmount } = JSON.parse(event.body);
  const { amount } = JSON.parse(event.body);
  const { desc } = JSON.parse(event.body);
  const email = JSON.parse(JSON.stringify(event))["requestContext"]["authorizer"]["email"];
  const seller_name = JSON.parse(JSON.stringify(event))["requestContext"]["authorizer"]["name"];
  console.log(JSON.parse(JSON.stringify(event))["requestContext"]["authorizer"]);
  console.log(email);

  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  var sale = {
    id: uuid(),
    title: title,
    status: 'OPEN',
    // paymentStatus: 'NOT INITIATED',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    // highestBid: {
    //   amount: 0,
    // },
    amount: amount,
    sellerEmail: email,
    sellerName: seller_name,
    imageBase64: imageBase64,
    desc: desc,
    // deliveryStatus: 'NOT INITIATED',
    // minAmount: minAmount,
  };

  await dynamodb.put({
    TableName: 'buyers-club-table',
    Item: sale,
  }).promise();


  return {
    statusCode: 201,
    body: JSON.stringify(sale),
  };

}
