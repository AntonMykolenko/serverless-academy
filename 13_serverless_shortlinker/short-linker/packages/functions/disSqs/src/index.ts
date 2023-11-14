import { DynamoDBStreamEvent } from "aws-lambda";
import { SQS } from "aws-sdk";


const sqs = new SQS();

export async function handler(event: DynamoDBStreamEvent) {
    try {
        for (const record of event.Records) {
            if (record.eventName === "MODIFY") {
                const newImage = record.dynamodb?.NewImage;
                const oldImage = record.dynamodb?.OldImage;

                if (newImage && oldImage) {
                    const linkStatusNew = newImage.status.S;
                    const linkStatusOld = oldImage.status.S;

                    if (linkStatusOld === "active" && linkStatusNew === "inactive") {
                        const userEmail = newImage.email.S;
                        if (userEmail) {
                            const params = {
                                QueueUrl: "https://sqs.eu-west-1.amazonaws.com/422412222410/anton-short-linker-queueNotify",
                                MessageBody: JSON.stringify({ userEmail }),
                            };
                        
                            try {
                                await sqs.sendMessage(params).promise();
                                console.log(`Message sent to SQS for ${userEmail} successfully.`);
                            } catch (error) {
                                console.error(`Error sending message to SQS for ${userEmail}:`, error);
                                throw error;
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error processing DynamoDB stream event:", error);
    }
}

