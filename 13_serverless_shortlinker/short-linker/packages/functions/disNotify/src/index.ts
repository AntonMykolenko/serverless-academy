import { SQSEvent, SQSRecord } from "aws-lambda";
import { SES } from "aws-sdk";

const ses = new SES();

export async function handler(event: SQSEvent) {
  try {
    const messages = event.Records.map((record: SQSRecord) =>
      JSON.parse(record.body).userEmail
    );

    const batches = chunkArray(messages, 10);
    for (const batch of batches) {
      await processBatch(batch);
    }
  } catch (error) {
    console.error("Error processing SQS messages:", error);
  }
}

async function processBatch(batch: string[]) {
  for (const userEmail of batch) {
    await sendIndividualEmail(userEmail);
  }
}

async function sendIndividualEmail(userEmail: string) {
  const params = {
    Destination: {
      ToAddresses: [userEmail],
    },
    Message: {
      Body: {
        Text: {
          Data: "Your link has been deactivated.",
        },
      },
      Subject: {
        Data: "Link Deactivation Notification",
      },
    },
    Source: "gaqpyyy@gmail.com", 
  };

  try {
    await ses.sendEmail(params).promise();
    console.log(`Email sent to ${userEmail} successfully.`);
  } catch (error) {
    console.error(`Error sending email to ${userEmail}:`, error);
    throw error;
  }
}

function chunkArray(arr: any[], chunkSize: number) {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}
