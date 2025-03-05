import { Page, Locator, defineConfig } from 'playwright/test';
import fetch from 'node-fetch';
import { config } from '../config/config';
import axios from 'axios'
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

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
    console.error(`❌ Error checking if element is clickable: ${(error as Error).message}`);
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
        console.info(`>> ✅ Test step : PASS - ${stepName}`);
      } else {
        console.error(`>> ❌ Test step : FAIL - ${stepName} >> Element is not clickable.`);
      }
    } catch (error) {
      console.error(`>> ❌ Test step : FAIL - ${stepName}\nError: ${(error as Error).message}`);
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
        console.info(`>> ✅ Test step : PASS - ${stepName}`);
      } else {
        throw new Error('❌ Element is not editable');
      }
    } catch (error) {
      console.error(`>> ❌ Test step: FAIL - ${stepName}\nError: ${(error as Error).message}`);
      throw error;
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to click on a wait for an element with a timeout of 10s
/*----------------------------------------------------------------------------------------------------------------*/
export async function waitForElement(locator: Locator, stepName: string, timeout: number = 10000): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      console.info(`>> ✅ Test step: PASS - ${stepName}`);
    } catch (error) {
      console.error(`>> ❌ Test step: FAIL - ${stepName}\nError: ${(error as Error).message}`);
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
      console.log(`>> ✅ Test step: PASS - ${stepName}`);
    } catch (error) {
      console.error(`>> ❌ Test step: FAIL - ${stepName}\nError: ${(error as Error).message}`);
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
    console.log(`[INFO] ℹ️ Text of element: ${elementText?.trim()}`);
    return elementText ? elementText.trim() : null;
  } catch (error) {
    console.error(`❌ Error getting text of element:`, error);
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
        console.log(`[INFO] ℹ️ Successfully navigated to: ${url}`);
      } catch (error) {
        console.error(`❌ Failed to navigate to ${url}:`, error);
        throw error; // Re-throw the error to fail the test if navigation fails
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
      console.log(`>> ✅ Test step : PASS - Verify message: "${message} is present"`);
    } else 
    {
      throw new Error(`>> ❌ Test step : FAIL - Verify message "${message}" is present`);
    }
  }
/*----------------------------------------------------------------------------------------------------------------*/
// Function to extract CTA link from email content
/*----------------------------------------------------------------------------------------------------------------*/
export async function extractCtaLink(emailBody: string): Promise<string | null> {
  // Regex to match the "Verify My Email" link
  const linkRegex = /<a[^>]+href="([^"]+)"[^>]*>Verify My Email<\/a>/i;
  const match = emailBody.match(linkRegex);
  console.log("[INFO] ℹ️ Extracting the link from CTA button Verify My Email");
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
    throw new Error('>> ❌ Missing required environment variables');
  }
  else
  {
    console.info('[INFO] ℹ️ Client ID is : ' + CLIENT_ID);
    console.info('[INFO] ℹ️ Environment variables have been loaded successfully');
  }

  const EMAIL_SUBJECT = emailSubject;
  const TARGET_EMAIL = config.credentials.email;

  // Step 1:  Fetch the access token using OAuth 2.0 Client Credentials Flow
  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  let accessToken: string;

  try {
    console.log('[INFO] ℹ️ Fetching the access Token using OAuth 2.0 Client Credentials Flow');
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
      console.log("[INFO] ℹ️ Access token has been retrieved");
    } else {
      throw new Error('>> ❌ Failed to fetch access token');
    }
  } catch (error) {
    console.error('❌ Error fetching access token:', error);
    throw new Error('❌ Failed to fetch access token');
  }

  // Step 2: Fetch the user's inbox messages
  console.log("[INFO] ℹ️ Fetching email from user's inbox");
  console.log("[INFO] ℹ️ Endpoint : " + `${GRAPH_API_BASE_URL}/users/${TARGET_EMAIL}/messages?$top=1&$search="subject:${EMAIL_SUBJECT}"`)
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
    throw new Error(`❌ Failed to fetch messages: ${response.status}`);
  }

  const messages = response.data.value;
  if (messages.length === 0) {
    throw new Error('>> ❌ No email found with the given subject');
  }
  const subject = response.data.value[0].subject;
  const email = messages[0];
  console.log('[INFO] ℹ️ Email Found with subject :', subject);

  // Step 4: Parse the email body to find the "Verify My Email" link
  const emailBody = email.body.content;

  // Return the email body content
  return emailBody;
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to verify if an element is visible on a page
/*----------------------------------------------------------------------------------------------------------------*/
export async function verifyElementPresent(locator: Locator, timeout: number = 15000): Promise<boolean> {
  try {
    // Wait for the element to be present in the DOM
    await locator.waitFor({ state: 'attached', timeout });

    // Check if the element is visible
    const isVisible = await locator.isVisible();

    const elementName = await locator.textContent();
    
    // Log the result and return true/false
    if (isVisible) {
      console.log(`>> ✅ Test step: PASS - Element ${elementName} is present and visible.`);
      return true;
    } else {
      console.log(`>> ❌ Test step: FAIL - Element ${elementName} is not visible.`);
      return false;
    }
  } catch (error) {
    console.error(`>> ❌ Test step: FAIL - Element is not present. Error: ${(error as Error).message}`);
    return false;
  }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Use Faker to generate test data by passing parameter the attribute(firstName, lastName, companyName)
export async function generateFakeData(attribute: string): Promise<string | null> {
  try {
    let fakeData: string;

    // Check if the attribute is supported
    if (!['firstName', 'lastName', 'companyName'].includes(attribute)) {
      throw new Error(`❌ Unsupported attribute: ${attribute}`);
    }

    switch (attribute) {
      case 'firstName':
        fakeData = faker.person.firstName(); // Using Faker to generate a first name
        break;
      case 'lastName':
        fakeData = faker.person.lastName(); // Using Faker to generate a last name
        break;
      case 'companyName':
        fakeData = faker.company.name(); // Using Faker to generate a company name
        break;
      default:
        return null; // In case something goes wrong
    }

    return fakeData; // Return the generated data
  } catch (error) {
    console.error(
      `>> ❌ Error - Could not generate test data for ${attribute}, due to error: ${(error as Error).message}`
    );
    return null;
  }
}
/*----------------------------------------------------------------------------------------------------------------*/
// generate an email by combining the default automation email with a random number
export async function generateRandomEmail() : Promise <string|null>
{
  try
  {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const randomEmail = "AutomationUser+" + randomNum + "@yoyogroup.com";
    console.log("[INFO] ℹ️ Email generated is : " + randomEmail);
    return randomEmail;

  }
  catch (error) 
  {
    console.error(`>> ❌ Error - Could not randon email`);
    return null;
}
}
/*----------------------------------------------------------------------------------------------------------------*/
// // Function to select an option from a dropdown defined as <button> in the code
export async function selectDropdownOption(
  dropdownLocator: () => Locator, // Locator for the dropdown button
  optionText: string,             // The text of the option to select
  page: Page                      // Playwright page object
): Promise<void> {
  try {
    // Step 1: Click the dropdown button to open the dropdown
    await dropdownLocator().click();

    // Wait for the options to be visible and interactable
    const dropdownOptions = page.locator('[role="option"]');
    await dropdownOptions.waitFor({ state: 'visible' }); 

    // Step 2: Find the desired option by its text and select it
    const option = dropdownOptions.locator(`text=${optionText}`);
    await option.click({ force: true }); // Force click if needed
  } catch (error) 
  {
    console.error(`❌ Failed to select "${optionText}" from the dropdown. Error: ${error}`);
    throw error;
  }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Method to count the number of rows in a table
export async function countTableRows(page: Page): Promise<number> 
{
  await page.waitForTimeout(5000);
  await page.waitForSelector('table tbody tr', { state: 'visible' });
  const numOfRow = await page.locator('table tr:visible').count();
  return numOfRow;
}
/*----------------------------------------------------------------------------------------------------------------*/
// Method to count the number of rows in a table by using tr class name
export async function countTableRowsByClass(page: Page, Class: string): Promise<number> {
  const selector = `tr[class*="${Class}"]:visible`;

  await page.waitForSelector(selector, { state: 'visible' });
  return await page.locator(selector).count();
}
/*----------------------------------------------------------------------------------------------------------------*/
