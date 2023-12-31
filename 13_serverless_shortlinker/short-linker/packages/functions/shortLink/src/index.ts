import AWS from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";

const Scheduler = new AWS.Scheduler();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function getUniqueShortUrl(dynamoDb: AWS.DynamoDB.DocumentClient, tableName: string, email: string): Promise<string> {
    const shortUrl = crypto.randomBytes(3).toString('hex');

    const queryParams = {
        TableName: "anton-short-linker-shortLink",
        Key: {
            id: shortUrl,
            email: email
        }
    };

    const result = await dynamoDb.get(queryParams).promise();

    if (result.Item) {
        return getUniqueShortUrl(dynamoDb, tableName, email);
    } else {
        return shortUrl;
    }
}

declare global {
    interface Date {
        addDays(days: number): Date;
    }
}

Date.prototype.addDays = function (days: number) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export async function handler(event: APIGatewayProxyEvent) {
    if (!event.body) {
        return {
            statusCode: 400,
            body: `Missing body`,
        };
    }

    const { link, expiresIn } = JSON.parse(event.body);
    const token = event.headers.token;

    if (token === undefined) {
        return {
            statusCode: 400,
            body: `Missing token`,
        };
    }

    const { email } = jwt.verify(token, "123") as JwtPayload;

    if (!link || !expiresIn) {
        return {
            statusCode: 400,
            body: `Missing parameters`,
        };
    }

    const validExpirationValues = ["1 day", "3 days", "7 days", "one-time link"];

    if (!validExpirationValues.includes(expiresIn)) {
        return {
            statusCode: 400,
            body: `Invalid expiresIn parameter. It must be one of: ${validExpirationValues.join(", ")}`,
        };
    }

    const shortUrl = await getUniqueShortUrl(dynamoDb, "anton-short-linker-shortLink", email);

    if (shortUrl === undefined) {
        return {
            statusCode: 400,
            body: `Missing shortUrl`,
        };
    }

    let endDate, endDateSchedule;

    if (expiresIn === "one-time link") {
        endDate = "one-time link";
    } else {
        const expirationDays = parseInt(expiresIn);
        if (isNaN(expirationDays)) {
            return {
                statusCode: 400,
                body: `Invalid expiresIn parameter`,
            };
        }
        endDate = new Date().addDays(expirationDays).toISOString();
    }

    const dbData = {
        TableName: "anton-short-linker-shortLink",
        Item: {
            id: shortUrl,
            link: link,
            expiresIn: expiresIn,
            createdOn: new Date().toISOString(),
            endDate: endDate,
            email: email,
            status: "active",
            linkStats: 0,
        },
    };

    try {
        if (dbData.Item.expiresIn !== "one-time link") {
            Scheduler.createSchedule(
                {
                    ScheduleExpression: `at(${endDate.slice(0, 19)})`,
                    Name: shortUrl,
                    Description: "Scheduler for deleting short link",
                    FlexibleTimeWindow: {
                        Mode: 'OFF',
                    },
                    ActionAfterCompletion: 'DELETE',
                    Target: {
                        Arn: "arn:aws:lambda:eu-west-1:422412222410:function:anton-short-linker-API-expLinksBC657F0E-KYCNT4i7EQCM",
                        RoleArn: "arn:aws:iam::422412222410:role/anton-short-linker-API-expLinksRole69301015-04lDuXFHLU5Z",
                        Input: JSON.stringify({
                            EventBridgeParameters: [
                                {
                                    id: shortUrl,
                                    email: email,
                                },
                            ],
                        }),
                    },
                }
            ).promise().catch((error) => {
                console.log("Error while creating scheduler:", error);
                throw error;
            });

        }
        await dynamoDb.put(dbData).promise().catch((error) => {
            console.log("Error while putting data to DynamoDB:", error);
        });

        const returnData = {
            link: link,
            shortLink: shortUrl,
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
