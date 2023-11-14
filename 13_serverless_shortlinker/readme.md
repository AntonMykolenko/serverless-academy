ShortLinker API
How to Run
To run the API, use the command npm run dev in the terminal. This command will compile and deploy the project in developer mode.

How to Deploy
To deploy the API, run the command npm run deploy in the terminal. This command will deploy the API in the selected region.

Project Structure Description
The project is structured into several stacks and functions:

Stacks
ApiStack: The main stack that compiles all of the functions, tables, and queues into one API.
StorageStack: This stack defines tables and queues for the API and works with the queue to notify users.
Functions
All functions are packaged individually by Docker.

Authorization: A function that works as a custom lambda authorizer to protect /links endpoints.
disNotify: A function that sends emails to users when their link deactivates.
disSqs: A function that sends SQS queues to the disNotify function which handles them.
expLinks: A function invoked by cron which checks if there are any expired links in the database.
getLink: A function that takes a link ID from the link and returns a full link to the user.
linksByUser: A function that returns all of the links created by a user.
shortLink: A function to make users’ links shorter by their request.
shortLinkD: A function to deactivate a selected short link.
signIn: A function to give an existing user a new JWT token.
signUp: A function to create a new user for the API.