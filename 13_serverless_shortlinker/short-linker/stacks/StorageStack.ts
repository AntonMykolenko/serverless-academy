import { StackContext, Table, Queue, Function } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  const disSqs = new Function(stack, "disSqs", {
    runtime: "container",
    handler: "./packages/functions/disSqs",
  });
  disSqs.attachPermissions(["sqs:SendMessage"]);

  const disNotify = new Function(stack, "disNotify", {
    runtime: "container",
    handler: "./packages/functions/disNotify",
  });
  disNotify.attachPermissions(["sqs:ReceiveMessage"]);
  disNotify.attachPermissions(["ses:SendEmail"]);


  const linksTable = new Table(stack, "shortLink", {
    fields: {
      id: "string",
      link: "string",
      expiresIn: "string",
      createdOn: "string",
      endDate: "string",
      email: "string",
      status: "string",
      linkStats: "number"
    },
    primaryIndex: { partitionKey: "id", sortKey: "email" },
    stream: true,
    consumers: {
      myConsumer: {
        function: disSqs,
      }
    }
  });
  const usersTable = new Table(stack, "users", {
    fields: {
      id: "string",
      email: "string",
      password: "string",
    },
    primaryIndex: { partitionKey: "email" },
  });
  const queueNotify = new Queue(stack, "queueNotify", {
    consumer: disNotify
  });
  queueNotify.attachPermissions(["lambda:InvokeFunction"]);
  queueNotify.attachPermissions(["sqs:ReceiveMessage"]);
  return {
    linksTable,
    usersTable,
    queueNotify
  };
}