import AWS from "aws-sdk";
import * as uuid from "uuid";
import { APIGatewayProxyEvent } from "aws-lambda";
import jwt from "jsonwebtoken";


const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function handler(event: APIGatewayProxyEvent) {
    if (!event.body) {
        return {
            statusCode: 400,
            body: `Missing body`,
        };
    }
    const { email, password } = JSON.parse(event.body);
    if (!email || !password) {
        return {
            statusCode: 400,
            body: `Missing email or password`,
        };
    }
    const userParams = {
        TableName: "anton-short-linker-users",
        Key: {
            email: email,
        },
    };
    const result = await dynamoDb.get(userParams).promise();
    if (result.Item) {
        return {
            statusCode: 400,
            body: `User already exists`,
        };
    }
    const params = {
        TableName: "anton-short-linker-users",
        Item: {
            id: uuid.v4(),
            email: email,
            password: password,
        }
    };
    try {
        await dynamoDb.put(params).promise();
        const token = jwt.sign({ email: email }, "123", { expiresIn: "3h" });
        const returnData = {
            token: token
        };
        return {
            statusCode: 200,
            body: JSON.stringify(returnData),
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