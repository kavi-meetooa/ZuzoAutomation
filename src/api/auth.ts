import * as msal from '@azure/msal-node';
import dotenv from 'dotenv';

dotenv.config();

// Destructure environment variables and ensure they are not undefined
const { CLIENT_ID, CLIENT_SECRET, TENANT_ID } = process.env;

// Check if all required environment variables are set
if (!CLIENT_ID || !CLIENT_SECRET || !TENANT_ID) {
  throw new Error('Missing environment variables: CLIENT_ID, CLIENT_SECRET, or TENANT_ID');
}

// Create the MSAL confidential client application
export const cca = new msal.ConfidentialClientApplication({
  auth: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
  },
});

// Function to get the access token
export const getAccessToken = async (): Promise<string> => {
  try {
    const result = await cca.acquireTokenByClientCredential({
      scopes: ['https://graph.microsoft.com/.default'],
    });

    // Check if result is null
    if (!result) {
      throw new Error('Failed to acquire token: Result is null');
    }

    return result.accessToken!;
  } catch (error: any) { // Cast error to `any` to access properties
    console.error('Error acquiring token:', error.message);
    if (error.errorCode) {
      console.error('MSAL Error Code:', error.errorCode);
    }
    if (error.innerError) {
      console.error('Inner Error:', error.innerError);
    }
    throw error; // Re-throw the error for further handling if needed
  }
};
