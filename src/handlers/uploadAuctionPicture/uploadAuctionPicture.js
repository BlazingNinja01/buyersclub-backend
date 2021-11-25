const createError = require('http-errors');
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1',
});

var dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

module.exports.handler = async (event) => {
    let auction;
    const { id } = event.pathParameters;
    const email = JSON.parse(JSON.stringify(event))["requestContext"]["authorizer"]["email"];

    const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    this.uploadPictureToS3 = async function (key, body) {
        const result = await s3.upload({
            Bucket: "auctions-media-bucket262",
            Key: key,
            Body: body,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
        }).promise();

        return result.Location;
    }

    this.setAuctionPictureUrl = async function (id, pictureUrl) {
        const result = await dynamodb.update({
            TableName: 'auctions-table',
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

    let updatedAuction;

    try {
        const result = await dynamodb.get({
            TableName: 'auctions-table',
            Key: { id },
        }).promise();

        auction = result.Item;

        const pictureUrl = await this.uploadPictureToS3(auction.id + '.jpeg', buffer);
        updatedAuction = await this.setAuctionPictureUrl(auction.id, pictureUrl);
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    if (!auction) {
        throw new createError.NotFound(`Auction with ${id} ID could not be found!`);
    } else if (auction.seller !== email) {
        throw new createError.Forbidden('You are not the seller of this auction!');
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify(updatedAuction),
        }
    }
}
