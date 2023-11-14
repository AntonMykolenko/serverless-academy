import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda';
import jwt, { JwtPayload } from "jsonwebtoken";
import AWS from "aws-sdk";

// Initialize DynamoDB client
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
    try {
        const authorizationToken = event.authorizationToken;
        const secretOrPublicKey = '123';

        // Verify and decode the JWT token
        const decoded = jwt.verify(authorizationToken, secretOrPublicKey) as JwtPayload;

        // Check if email exists in the decoded token
        if (!decoded.email) {
            console.error('Missing email in JWT token');
            throw new Error('Missing email in JWT token');
        }

        const userEmail = decoded.email;

        // Define parameters for DynamoDB query
        const params = {
            TableName: "anton-short-linker-users",
            Key: {
                email: userEmail,
            },
        };

        // Query DynamoDB for the user
        const result = await dynamoDb.get(params).promise();

        // Check if user exists in DynamoDB
        if (!result.Item) {
            console.error('User not found in DynamoDB');
            throw new Error('User not found in DynamoDB');
        }

        // If user exists, generate policy to allow access
        return generatePolicy(decoded.email, 'Allow', event.methodArn);
    } catch (error) {
        console.error('Error occurred:', error);
        // If any error occurs, generate policy to deny access
        return generatePolicy('anonymous', 'Deny', event.methodArn);
    }
}

function generatePolicy(principalId: string, effect: string, resource: string): APIGatewayAuthorizerResult {
    const policyDocument = {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            },
        ],
    };

    return {
        principalId,
        policyDocument,
    };
}
