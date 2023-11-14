import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function handler() {
    const params = {
        TableName: "anton-short-linker-shortLink"
    };

    const data = await dynamoDb.scan(params).promise();
    const activeLinks = data.Items?.filter((item) => item.status === "active");

    if (activeLinks !== undefined) {
        for (let i = 0; i < activeLinks?.length; i++) {
            const link = activeLinks[i];
            if (new Date(link.endDate) <= new Date()) {
                const updateParams = {
                    TableName: "anton-short-linker-shortLink",
                    Key: {
                        id: link.id,
                        email: link.email
                    },
                    UpdateExpression: "set #st = :status",
                    ExpressionAttributeNames: {
                        "#st": "status"
                    },
                    ExpressionAttributeValues: {
                        ":status": "inactive"
                    },
                };

                await dynamoDb.update(updateParams).promise();
            }
        }
    }
}
