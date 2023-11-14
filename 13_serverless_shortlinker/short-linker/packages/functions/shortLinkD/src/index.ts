import AWS from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Table } from "sst/node/table";
import jwt, { JwtPayload } from "jsonwebtoken";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function handler(event: APIGatewayProxyEvent) {
    const token = event.headers.token;
    if (!event.body || token === undefined) {
        return {
            statusCode: 400,
            body: `Incorrect input`,
        };
    }
    const { email } = jwt.verify(token, "123") as JwtPayload;
    const { id } = JSON.parse(event.body);
    if (!id) {
        return {
            statusCode: 400,
            body: `Missing id`,
        };
    }
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
    try {
        await dynamoDb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(`Link ${id} is deactivated`),
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

