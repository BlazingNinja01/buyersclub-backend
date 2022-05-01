const createError = require('http-errors');
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'ap-south-1',
});

var dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

module.exports.handler = async (event) => {
    let sale;
    const { id } = event.pathParameters;
    const email = JSON.parse(JSON.stringify(event))["requestContext"]["authorizer"]["email"];
    const { base64 } = JSON.parse(event.body);
    // const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    this.uploadPictureToS3 = async function (key, body) {
        const result = await s3.upload({
            Bucket: 'buyers-club-bucket',
            Key: key,
            Body: body,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
        }).promise();

        return result.Location;
    }

    this.setSalePictureUrl = async function (id, pictureUrl) {
        const result = await dynamodb.update({
            TableName: 'buyers-club-table',
            Key: { id },
            UpdateExpression: 'set pictureUrl = :pictureUrl, imageBase64 = :imageBase64',
            ExpressionAttributeValues: {
                ':pictureUrl': pictureUrl,
                ':imageBase64': base64,
            },
            ReturnValues: 'ALL_NEW',
        }).promise();

        return result.Attributes;
    }

    let updatedSale;

    try {
        const result = await dynamodb.get({
            TableName: 'buyers-club-table',
            Key: { id },
        }).promise();

        sale = result.Item;

        const pictureUrl = await this.uploadPictureToS3(sale.id + '.jpeg', buffer);
        updatedSale = await this.setSalePictureUrl(sale.id, pictureUrl);
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    if (!sale) {
        throw new createError.NotFound(`Order with ${id} ID could not be found!`);
    } else if (sale.seller !== email) {
        throw new createError.Forbidden('You are not the seller of this sale!');
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify(updatedSale),
        }
    }
}
