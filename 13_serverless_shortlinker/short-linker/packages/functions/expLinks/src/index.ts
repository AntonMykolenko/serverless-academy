import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function handler(event: any) {
    try {
        console.log("Received event:", JSON.stringify(event));

        const { EventBridgeParameters } = event;

        if (!EventBridgeParameters || !Array.isArray(EventBridgeParameters) || EventBridgeParameters.length === 0) {
            console.error("Missing or invalid EventBridgeParameters in the event");
            return {
                statusCode: 400,
                body: "Missing or invalid EventBridgeParameters in the event",
            };
        }

        const { id, email } = EventBridgeParameters[0];

        if (!id || !email) {
            return {
                statusCode: 400,
                body: "Missing required parameters (id or email) in the event",
            };
        }

        await setLinkInactive(id, email);

        return {
            statusCode: 200,
            body: "Link status updated to inactive successfully",
        };
    } catch (error) {
        console.error("Error:", error);
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


async function setLinkInactive(id: string, email: string) {
    const updateParams = {
        TableName: "anton-short-linker-shortLink",
        Key: {
            id: id,
            email: email,
        },
        UpdateExpression: "SET #st = :status",
        ExpressionAttributeNames: {
            "#st": "status",
        },
        ExpressionAttributeValues: {
            ":status": "inactive",
        },
    };

    console.log("Updating link:", updateParams);
    await dynamoDb.update(updateParams).promise();
    console.log("Link updated successfully");
}
