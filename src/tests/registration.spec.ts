import { test, expect } from '@playwright/test';
import axios from 'axios';
import { URLSearchParams } from 'url';

// Replace with your actual values
const tenantId = 'd454e49e-dc50-4bab-9f06-fe9586952831';
const clientId = '05a2a529-26a7-438a-9d51-2fdd6651984c';
const redirectUri = 'https://app-dev.build.zuzocard.com/';
const scope = 'Mail.ReadWrite';

// Replace with actual username and password
const username = 'kaviraj.meetooa@yoyogroup.com';
const password = 'Anfield@2021';

// Step 1: Redirect user to Microsoft's authorization URL to get authorization code
const getAuthUrl = () => {
  const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?` +
    `client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&response_mode=query`;

  console.log("Step 1: Redirect user to Microsoft's authorization URL to get authorization code");
  console.log("Auth URL: " + authUrl);
  return authUrl;
};

// Step 2: Exchange authorization code for an access token
async function getAccessToken(authorizationCode: string) {
  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  
  const data = new URLSearchParams();
  data.append('grant_type', 'authorization_code');
  data.append('client_id', clientId);
  data.append('client_secret', 'gqj8Q~v9IxTivAECn.F-9pAQWIFCJjDPvks1XcaK'); 
  data.append('code', authorizationCode);
  data.append('redirect_uri', redirectUri);

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token; // Use this token for further requests
  } catch (error : unknown) {
    if (error instanceof Error) {
        console.error('Error fetching access token:', error.message);
      } else {
        console.error('Unknown error occurred:', error);
      }
      throw error;
  }
}

// Step 3: Fetch the email using Graph API with the user's token
async function readEmail(accessToken: string) {
  const graphUrl = 'https://graph.microsoft.com/v1.0/me/messages?$top=1'; // Read the latest email

  try {
    const response = await axios.get(graphUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const emailContent = response.data.value[0].body.content;
    const ctaLinkMatch = emailContent.match(/href="(https:\/\/app-dev\.build\.zuzocard\.com\/login\/callback\?code=[^\"]+)"/);

    if (ctaLinkMatch) {
      return ctaLinkMatch[1]; // Return CTA link if found
    } else {
      console.log('CTA link not found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching email:', error);
    throw error;
  }
}

// Full Playwright test to automate login, read email, and extract CTA link
test('Automate login and extract CTA link from email', async ({ page }) => {
  // Step 1: Generate the auth URL
  const authUrl = getAuthUrl();

  // Step 2: Open the browser and navigate to the auth URL
  await page.goto(authUrl);

  // Step 3: Fill in the username and submit
  await page.fill('input[name="loginfmt"]', username); // Username input
  await page.click('input[type="submit"]'); // Submit button

  // Step 4: Fill in the password and submit
  await page.fill('input[name="passwd"]', password); // Password input
  await page.click('input[type="submit"]'); // Sign in button

  /* Step 5: Handle "Stay signed in?" prompt if it appears
  try {
    await page.click('button[id="idBtn_Back"]'); // No button for staying signed in
  } catch (e) {
    console.log("No 'Stay signed in?' prompt appeared.");
  }*/

  // Step 6: Wait for redirect with authorization code
  await page.waitForURL(`${redirectUri}?code=*`);

  // Step 7: Extract authorization code from the URL
  const url = page.url();
  const urlParams = new URLSearchParams(url.split('?')[1]);
  const authorizationCode = urlParams.get('code');

  if (!authorizationCode) {
    console.error('Authorization code not found.');
    return;
  }
  console.log('Authorization code extracted:', authorizationCode);

  // Step 8: Get the access token using the authorization code
  const accessToken = await getAccessToken(authorizationCode);

  // Step 9: Fetch email and extract CTA link
  const ctaLink = await readEmail(accessToken);

  // Step 10: If CTA link is found, navigate to it and proceed with login or other actions
  if (ctaLink) {
    console.log('CTA Link:', ctaLink);
    await page.goto(ctaLink);

    // Fill in login form on the page
    await page.fill('input[name="username"]', username); // Replace with correct selector
    await page.fill('input[name="password"]', password); // Replace with correct selector
    await page.click('button[type="submit"]'); // Replace with correct selector

    // Check if the login was successful
    await expect(page.locator('text=Welcome')).toBeVisible();
  } else {
    console.error('Failed to extract CTA link.');
  }
});
