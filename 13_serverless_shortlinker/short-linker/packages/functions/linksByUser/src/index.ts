import { APIGatewayProxyEvent } from "aws-lambda";
import jwt, { JwtPayload } from "jsonwebtoken";
import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function handler(event: APIGatewayProxyEvent) {
    const token = event.headers.token;
    if (token === undefined) {
        return {
            statusCode: 400,
            body: `Missing token`,
        };
    }
    const { email } = jwt.verify(token, "123") as JwtPayload;

    const params = {
        TableName: "anton-short-linker-shortLink",
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": email
        }
    };

    try {
        const result = await dynamoDb.scan(params).promise();

        if (result.Items && result.Items.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify(result.Items),
            };
        } else {
            return {
                statusCode: 400,
                body: `No links found for the specified email`,
            };
        }
    } catch (error) {
        let message;
        if (error instanceof Error) {
            message = error.message;
        } else {
            message = String(error);
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ error: message }),
        };
    }
}
