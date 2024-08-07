import { Account, Client, Databases } from 'appwrite';

// Initialize the Appwrite client
const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('66b30eb70012cd5e63c3');

const databases = new Databases(client);
const account = new Account(client);

export { account, client, databases };

