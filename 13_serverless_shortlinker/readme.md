<h1>ShortLinker API</h1>

<h2>How to Run</h2>
<p>To run the API, use the command <code>npm run dev</code> in the terminal. This command will compile and deploy the project in developer mode.</p>

<h2>How to Deploy</h2>
<p>To deploy the API, run the command <code>npm run deploy</code> in the terminal. This command will deploy the API in the selected region.</p>

<h2>Project Structure Description</h2>
<p>The project is structured into several stacks and functions:</p>

<h3>Stacks</h3>
<ul>
  <li><strong>ApiStack</strong>: The main stack that compiles all of the functions, tables, and queues into one API.</li>
  <li><strong>StorageStack</strong>: This stack defines tables and queues for the API and works with the queue to notify users.</li>
</ul>

<h3>Functions</h3>
<p>All functions are packaged individually by Docker.</p>
<ul>
  <li><strong>Authorization</strong>: A function that works as a custom lambda authorizer to protect /links endpoints.</li>
  <li><strong>disNotify</strong>: A function that sends emails to users when their link deactivates.</li>
  <li><strong>disSqs</strong>: A function that sends SQS queues to the disNotify function which handles them.</li>
  <li><strong>expLinks</strong>: A function invoked by cron which checks if there are any expired links in the database.</li>
  <li><strong>getLink</strong>: A function that takes a link ID from the link and returns a full link to the user.</li>
  <li><strong>linksByUser</strong>: A function that returns all of the links created by a user.</li>
  <li><strong>shortLink</strong>: A function to make users’ links shorter by their request.</li>
  <li><strong>shortLinkD</strong>: A function to deactivate a selected short link.</li>
  <li><strong>signIn</strong>: A function to give an existing user a new JWT token.</li>
  <li><strong>signUp</strong>: A function to create a new user for the API.</li>
</ul>
