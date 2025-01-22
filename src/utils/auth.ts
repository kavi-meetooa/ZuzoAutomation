import fetch from 'node-fetch';

// Function to get the OAuth 2.0 token
export async function getAccessToken(): Promise<string> {
  const clientId = '05a2a529-26a7-438a-9d51-2fdd6651984c';
  const clientSecret = 'gqj8Q~v9IxTivAECn.F-9pAQWIFCJjDPvks1XcaK';
  const tenantId = 'd454e49e-dc50-4bab-9f06-fe9586952831';  
  const scope = 'Mail.ReadWrite';  
  
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const form = new URLSearchParams();
  form.append('client_id', clientId);
  form.append('client_secret', clientSecret);
  form.append('scope', scope);
  form.append('grant_type', 'client_credentials');  

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form,
    });

    if (!response.ok) {
      throw new Error(`Failed to obtain token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;  // Return the access token
  } catch (error) {
    console.error('Error obtaining access token:', error);
    throw error;
  }
}
