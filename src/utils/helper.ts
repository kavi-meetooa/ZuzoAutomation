import { Page, Locator, defineConfig } from 'playwright/test';
import fetch from 'node-fetch';
import { config } from '../config/config';
import axios from 'axios'
import * as dotenv from 'dotenv';

//Load environment variables from .env file
dotenv.config();

/*----------------------------------------------------------------------------------------------------------------*/
// Function to check if an element is clickable
/*----------------------------------------------------------------------------------------------------------------*/
async function isClickable(locator: Locator): Promise<boolean> {
  try 
  {
    // Wait for the element to be visible
    await locator.waitFor({ state: 'visible', timeout: 5000 });

    // Evaluate if the element is not disabled and is visible in the layout
    const isEnabled = await locator.evaluate((el) => {
      // Check if the element is an input or button, which have the 'disabled' property
      if (el instanceof HTMLInputElement || el instanceof HTMLButtonElement) 
        {
            return !el.disabled && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden';
        }
      // For other elements, simply check visibility
      return getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden';
    });
    return isEnabled;
  } catch (error) 
  {
    console.error(`Error checking if element is clickable: ${(error as Error).message}`);
    throw error;
    return false; // Return false if there's an error
  }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to click on a web element
/*----------------------------------------------------------------------------------------------------------------*/
export async function clickElement(locator: Locator, stepName: string): Promise<void> {
    try {
      // Check if the element is clickable
      if (await isClickable(locator)) {
        // Scroll the element into view if needed
        await locator.scrollIntoViewIfNeeded();
        // Attempt to click the element
        await locator.click();
        console.info(`>>Test step : ${stepName} - PASS`);
      } else {
        console.error(`>>Test step : ${stepName} - FAIL >>> Element is not clickable.`);
      }
    } catch (error) {
      console.error(`>>Test step : ${stepName} - FAIL \nError: ${(error as Error).message}`);
      throw error;
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to enter text in a textbox/textarea
/*----------------------------------------------------------------------------------------------------------------*/
export async function fillElement(locator: Locator, text: string, stepName: string): Promise<void> {
    try {
      // Wait for the locator to be visible
      await locator.waitFor({ state: 'visible' });

      // Check if the locator is editable
      if (await locator.isEditable()) {
        await locator.fill(text);
        console.info(`>>Test step : ${stepName} - PASS`);
      } else {
        throw new Error('Element is not editable');
      }
    } catch (error) {
      console.error(`>>Test step: ${stepName} - FAIL \nError: ${(error as Error).message}`);
      throw error;
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to click on a wait for an element with a timeout of 10s
/*----------------------------------------------------------------------------------------------------------------*/
export async function waitForElement(locator: Locator, stepName: string, timeout: number = 10000): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      console.info(`>>Test step: ${stepName} - PASS`);
    } catch (error) {
      console.error(`>>Test step: ${stepName} - FAIL\nError: ${(error as Error).message}`);
      throw error;
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to clear a textbox
/*----------------------------------------------------------------------------------------------------------------*/
export async function clearTextbox(locator: Locator, stepName: string): Promise<void> {
    try {
      // Focus on the textbox to ensure interaction
      await locator.click();
      // Clear the textbox
      await locator.fill('');
      console.log(`>>Test step: ${stepName} - PASS`);
    } catch (error) {
      console.error(`>>Test step: ${stepName} - FAIL\nError: ${(error as Error).message}`);
      throw error;
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to retrieve the text of an element
/*----------------------------------------------------------------------------------------------------------------*/
export async function getElementText(selector: Locator): Promise<string | null> {
  try {
    // Wait for the element to be visible
    await selector.waitFor({ state: 'visible' });

    // Get the text content of the element
    const elementText = await selector.textContent();

    // Log and return the trimmed text content
    console.log(`Text of element: ${elementText?.trim()}`);
    return elementText ? elementText.trim() : null;
  } catch (error) {
    console.error(`Error getting text of element:`, error);
    return null;
  }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to navigate to a page
/*----------------------------------------------------------------------------------------------------------------*/
export async function navigateToUrl(page : Page, url : string): Promise<void> {
    try {
        console.log(`Navigating to URL: ${url}`);
        await page.goto(url, {
          waitUntil: 'networkidle', // Wait for no network connections
          timeout: 30000, // 
        });
        console.log(`Successfully navigated to: ${url}`);
      } catch (error) {
        console.error(`Failed to navigate to ${url}:`, error);
        throw error; // Re-throw the error to fail the test if navigation fails
      }
    }
/*----------------------------------------------------------------------------------------------------------------*/
// Function to maximise browser
/*----------------------------------------------------------------------------------------------------------------*/
export async function maximizeWindow(page: Page): Promise<void> {
  try {
    // Check if we are running in headed mode
    const isHeaded = !process.env.HEADLESS || process.env.HEADLESS === 'false';

    if (isHeaded) {
      // Set the viewport to the maximum screen dimensions for headed mode
      const { width, height } = await page.evaluate(() => ({
        width: window.screen.width,
        height: window.screen.height
      }));

      await page.setViewportSize({ width, height });
      console.info(`Test step: Browser window maximized - PASS`);
    } else {
      console.info(`Test step: Skipping window maximization in headless mode.`);
    }
  } catch (error) {
    console.error(`Test step: FAIL - Error maximizing window: ${(error as Error).message}`);
  }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to assert for messages (success, info, error, toast etc)
/*----------------------------------------------------------------------------------------------------------------*/
export async function verifyMessage(page: Page, locator: Locator, message: string): Promise<void> {
    // Check if the locator contains the expected message
    await page.waitForTimeout(2000);
    const messageExists = await locator.locator(`text=${message}`).isVisible();
  
    if (messageExists) 
    {
      console.log(`Test step : Verify message: "${message} is present - PASS"`);
    } else 
    {
      throw new Error(`Test step : Verify message "${message}" is present - FAIL`);
    }
  }
/*----------------------------------------------------------------------------------------------------------------*/
// Function to extract CTA link from email content
/*----------------------------------------------------------------------------------------------------------------*/
export async function extractCtaLink(emailBody: string): Promise<string | null> {
  // Regex to match the "Verify My Email" link
  const linkRegex = /<a[^>]+href="([^"]+)"[^>]*>Verify My Email<\/a>/i;
  const match = emailBody.match(linkRegex);
  console.log("Extracting the link from CTA button Verify My Email");
  // If a match is found, return the link. Otherwise, return null.
  return match ? match[1] : null;
}

/*----------------------------------------------------------------------------------------------------------------*/
// Function to make graph API call and retrieve email content from inbox
/*----------------------------------------------------------------------------------------------------------------*/
export async function retrieveEmail(companyEmail: string, emailSubject: string): Promise<string> {
  // Constants for Microsoft Graph API
  const GRAPH_API_BASE_URL = config.graphApiBaseUrl;
  const TENANT_ID = process.env.TENANT_ID;
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;

  // Ensure environment variables are defined
  if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('>> Missing required environment variables');
  }
  else
  {
    console.info('Client ID is : ' + CLIENT_ID);
    console.info('>> Environment variables have been loaded successfully');
  }

  const EMAIL_SUBJECT = emailSubject;
  const TARGET_EMAIL = 'kaviraj.meetooa@yoyogroup.com';

  // Step 1:  Fetch the access token using OAuth 2.0 Client Credentials Flow
  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  let accessToken: string;

  try {
    console.log('>> Fetching the access Token using OAuth 2.0 Client Credentials Flow');
    const apiResponse = await axios.post(
      tokenUrl,
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: config.scope,
        grant_type: 'client_credentials',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (apiResponse.status === 200 && apiResponse.data.access_token) {
      accessToken = apiResponse.data.access_token;
      console.log(">> Access token has been retrieved");
    } else {
      throw new Error('>> Failed to fetch access token');
    }
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw new Error('Failed to fetch access token');
  }

  // Step 2: Fetch the user's inbox messages
  console.log(">> Fetching email from user's inbox");
  console.log(">> Endpoint : " + `${GRAPH_API_BASE_URL}/users/${TARGET_EMAIL}/messages?$top=1&$search="subject:${EMAIL_SUBJECT}"`)
  const response = await axios.get(
    `${GRAPH_API_BASE_URL}/users/${TARGET_EMAIL}/messages?$top=1&$search="subject:${EMAIL_SUBJECT}"`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  // Step 3: Ensure the email is found
  if (response.status !== 200) {
    throw new Error(`Failed to fetch messages: ${response.status}`);
  }

  const messages = response.data.value;
  if (messages.length === 0) {
    throw new Error('>> No email found with the given subject');
  }

  const email = messages[0];
  console.log('>> Email Found with subject :', email.subject);

  // Step 4: Parse the email body to find the "Verify My Email" link
  const emailBody = email.body.content;

  // Return the email body content
  return emailBody;
}
/*----------------------------------------------------------------------------------------------------------------*/
