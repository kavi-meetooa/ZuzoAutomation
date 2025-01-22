import { test, expect } from '@playwright/test';
import axios from 'axios';

// Graph API client credentials (replace with your actual values)
const tenantId = '';
const clientId = '';
const clientSecret = '';

// Email subject to search
const searchSubject = "You have requested to log in to Zuzo";

// Function to get an access token
async function getAccessToken() {
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const response = await axios.post(
    tokenUrl,
    new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
}

// Function to fetch the most recent email with a specific subject
async function getMostRecentEmailBySearch(accessToken: string, subject: string, userEmail: string) {
  const apiUrl = `https://graph.microsoft.com/v1.0/users/${userEmail}/messages?$top=1&$search="subject:'${subject}'"&$orderby=receivedDateTime desc`;

  const response = await axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data.value;
}

// Function to extract the link from a button labeled "Verify My Email"
function extractLinkFromButton(emailBody: string, buttonText: string): string | null {
  const regex = new RegExp(
    `<a[^>]*href="([^"]+)"[^>]*>(\\s*${buttonText}\\s*)<\/a>`,
    'i'
  );
  const match = regex.exec(emailBody);

  return match ? match[1] : null;
}

// Playwright test to fetch and interact with the "Verify My Email" button link
test('Extract Verify My Email button link from the most recent email', async ({ page }) => {
  // Step 1: Get Access Token
  const userEmail = 'kaviraj.meetooa@yoyogroup.com';
  const accessToken = await getAccessToken();
  expect(accessToken).toBeDefined();

  // Step 2: Fetch the Most Recent Email with Specific Subject
  const emails = await getMostRecentEmailBySearch(accessToken, searchSubject, userEmail);
  expect(emails.length).toBeGreaterThan(0); // Ensure at least one email is found

  // Step 3: Extract the link for the "Verify My Email" button
  const recentEmailBody = emails[0].body.content;
  const verifyEmailLink = extractLinkFromButton(recentEmailBody, "Verify My Email");

  expect(verifyEmailLink).toBeDefined(); // Ensure a link is found
  console.log('Extracted Link:', verifyEmailLink);

  // Step 4: Navigate to the extracted link using Playwright
  if (verifyEmailLink) {
    await page.goto(verifyEmailLink); // Navigate to the extracted link
  }
});
