import { APIGatewayProxyEvent } from "aws-lambda";
import AWS from "aws-sdk";
import jwt, { JwtPayload } from "jsonwebtoken";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function handler(event: APIGatewayProxyEvent) {
    const id = event.pathParameters?.id;
    const token = event.headers.token;
    if (!id || token === undefined) {
        return {
            statusCode: 400,
            body: `Missing id`,
        };
    }
    const emailJwt = jwt.verify(token, "123") as JwtPayload;
    const email = emailJwt.email;
    const params = {
        TableName: "anton-short-linker-shortLink",
        Key: {
            id: id,
            email: email
        }
    };
    try {
        const result = await dynamoDb.get(params).promise();
        if (!result || !result.Item) {
            return {
                statusCode: 400,
                body: `Link doesnt exist`,
            };
        }
        const linkStats = result.Item.linkStats;
        if (result.Item.status === "active") {
            const updateParams = {
                TableName: "anton-short-linker-shortLink",
                Key: {
                    id: id,
                    email: email
                },
                UpdateExpression: "set #ls = :linkStats",
                ExpressionAttributeNames: {
                    "#ls": "linkStats"
                },
                ExpressionAttributeValues: {
                    ":linkStats": linkStats + 1
                },
            }
            await dynamoDb.update(updateParams).promise();
        }
        if (result.Item.status === "inactive") {
            return {
                statusCode: 400,
                body: `Link is inactive`,
            };
        }
        if (result.Item.expiresIn === "one-time link") {
            const params = {
                TableName: "anton-short-linker-shortLink",
                Key: {
                    id: id,
                    email: email
                },
                UpdateExpression: "set #st = :status",
                ExpressionAttributeNames: {
                    "#st": "status"
                },
                ExpressionAttributeValues: {
                    ":status": "inactive"
                },
            }
            await dynamoDb.update(params).promise();
        }
        return {
            statusCode: 200,
            body: JSON.stringify(result.Item.link),
        };
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
