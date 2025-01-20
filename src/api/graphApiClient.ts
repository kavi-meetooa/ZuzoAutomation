import * as msal from '@azure/msal-node';
import dotenv from 'dotenv';

dotenv.config();

// Load environment variables from .env file
const { CLIENT_ID, CLIENT_SECRET, TENANT_ID } = process.env;

// Create an MSAL confidential client application
const cca = new msal.ConfidentialClientApplication({
  auth: {
    clientId: CLIENT_ID!,
    clientSecret: CLIENT_SECRET!,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
  },
});

// Function to get the access token
const getAccessToken = async (): Promise<string> => {
  try {
    const result = await cca.acquireTokenByClientCredential({
      scopes: ['https://graph.microsoft.com/.default'], // Permission scope
    });

    // Check if result is null and throw an error if it is
    if (!result) {
      throw new Error('Failed to acquire token: Result is null');
    }

    // Return the access token
    return result.accessToken!;
  } catch (error: any) { // Cast error to `any`
    console.error('Error acquiring token:', error.message);
    if (error.errorCode) {
      console.error('MSAL Error Code:', error.errorCode);
    }
    if (error.innerError) {
      console.error('Inner Error:', error.innerError);
    }
    throw error;
  }
};

// Example function that uses the access token to make a request to Microsoft Graph API
const getUserInfo = async () => {
  try {
    const token = await getAccessToken();

    // Use the access token to call Microsoft Graph API (e.g., get user profile)
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info from Graph API');
    }

    const userInfo = await response.json();
    console.log('User Info:', userInfo);
  } catch (error: any) { // Cast error to `any`
    console.error('Error fetching user info:', error.message);
  }
};

// Call the function to get user info (for example)
getUserInfo();
