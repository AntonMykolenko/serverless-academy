import { StackContext, Api, use, Cron, Function, Auth } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function API({ stack }: StackContext) {
  const { linksTable, usersTable } = use(StorageStack);

  const expLinks = new Function(stack, "expLinks", {
    runtime: "container",
    handler: "./packages/functions/expLinks",
  });
  expLinks.bind([linksTable]);
  expLinks.attachPermissions(["dynamodb:FullAccess"]);
  expLinks.attachPermissions(["dynamodb:Scan"]);

  const signIn = new Function(stack, "signIn", {
    runtime: "container",
    handler: "./packages/functions/signIn",
  });
  signIn.bind([usersTable]);
  signIn.attachPermissions(["dynamodb:FullAccess"]);

  const signUp = new Function(stack, "signUp", {
    runtime: "container",
    handler: "./packages/functions/signUp",
  });
  signUp.bind([usersTable]);
  signUp.attachPermissions(["dynamodb:FullAccess"]);

  const shortLink = new Function(stack, "shortLink", {
    runtime: "container",
    handler: "./packages/functions/shortLink",
  });
  shortLink.bind([linksTable]);
  shortLink.attachPermissions(["dynamodb:FullAccess"]);
  shortLink.attachPermissions(["dynamodb:GetItem"]);

  const shortLinkD = new Function(stack, "shortLinkD", {
    runtime: "container",
    handler: "./packages/functions/shortLinkD",
  });
  shortLinkD.bind([linksTable]);
  shortLinkD.attachPermissions(["dynamodb:FullAccess"]);

  const linksByUser = new Function(stack, "linksByUser", {
    runtime: "container",
    handler: "./packages/functions/linksByUser",
  });
  linksByUser.bind([linksTable]);
  linksByUser.attachPermissions(["dynamodb:FullAccess"]);
  linksByUser.attachPermissions(["dynamodb:Scan"]);

  const getLink = new Function(stack, "getLink", {
    runtime: "container",
    handler: "./packages/functions/getLink",
  });
  getLink.bind([linksTable]);
  getLink.attachPermissions(["dynamodb:FullAccess"]);

  const api = new Api(stack, "api", {
    routes: {
      "POST /auth/sign-in": signIn,
      "POST /auth/sign-up": signUp,
      "POST /links/short-link": shortLink,
      "POST /links/link-d": shortLinkD,
      "POST /links/links-by-user": linksByUser,
      "GET /links/{id}": getLink,
    },
  });

  const authShortLink = new Auth(stack, "authShortLink", {
    authenticator: {
      runtime: "container",
      handler: "./packages/functions/authorization",
    },
  });
  authShortLink.attach(stack, {
    api,
    prefix: "/links",
  });

  const cron = new Cron(stack, "Cron", {
    schedule: "rate(10 minutes)",
    job: expLinks,
  });
  cron.attachPermissions(["lambda:InvokeFunction"]);
  cron.attachPermissions(["dynamodb:Scan"]);
  cron.bind([linksTable]);

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
