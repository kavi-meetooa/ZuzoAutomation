"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clickElement = clickElement;
exports.fillElement = fillElement;
exports.waitForElement = waitForElement;
exports.clearTextbox = clearTextbox;
exports.getElementText = getElementText;
exports.navigateToUrl = navigateToUrl;
exports.maximizeWindow = maximizeWindow;
exports.verifyMessage = verifyMessage;
exports.makeGraphApiCall = makeGraphApiCall;
exports.getAccessToken = getAccessToken;
exports.extractCtaLink = extractCtaLink;
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("../config/config");
/*----------------------------------------------------------------------------------------------------------------*/
// Function to check if an element is clickable
/*----------------------------------------------------------------------------------------------------------------*/
async function isClickable(locator) {
    try {
        // Wait for the element to be visible
        await locator.waitFor({ state: 'visible', timeout: 5000 });
        // Evaluate if the element is not disabled and is visible in the layout
        const isEnabled = await locator.evaluate((el) => {
            // Check if the element is an input or button, which have the 'disabled' property
            if (el instanceof HTMLInputElement || el instanceof HTMLButtonElement) {
                return !el.disabled && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden';
            }
            // For other elements, simply check visibility
            return getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden';
        });
        return isEnabled;
    }
    catch (error) {
        console.error(`Error checking if element is clickable: ${error.message}`);
        throw error;
        return false; // Return false if there's an error
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to click on a web element
/*----------------------------------------------------------------------------------------------------------------*/
async function clickElement(locator, stepName) {
    try {
        // Check if the element is clickable
        if (await isClickable(locator)) {
            // Scroll the element into view if needed
            await locator.scrollIntoViewIfNeeded();
            // Attempt to click the element
            await locator.click();
            console.info(`>>Test step : ${stepName} - PASS`);
        }
        else {
            console.error(`>>Test step : ${stepName} - FAIL >>> Element is not clickable.`);
        }
    }
    catch (error) {
        console.error(`>>Test step : ${stepName} - FAIL \nError: ${error.message}`);
        throw error;
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to enter text in a textbox/textarea
/*----------------------------------------------------------------------------------------------------------------*/
async function fillElement(locator, text, stepName) {
    try {
        // Wait for the locator to be visible
        await locator.waitFor({ state: 'visible' });
        // Check if the locator is editable
        if (await locator.isEditable()) {
            await locator.fill(text);
            console.info(`>>Test step : ${stepName} - PASS`);
        }
        else {
            throw new Error('Element is not editable');
        }
    }
    catch (error) {
        console.error(`>>Test step: ${stepName} - FAIL \nError: ${error.message}`);
        throw error;
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to click on a wait for an element with a timeout of 10s
/*----------------------------------------------------------------------------------------------------------------*/
async function waitForElement(locator, stepName, timeout = 10000) {
    try {
        await locator.waitFor({ state: 'visible', timeout });
        console.info(`>>Test step: ${stepName} - PASS`);
    }
    catch (error) {
        console.error(`>>Test step: ${stepName} - FAIL\nError: ${error.message}`);
        throw error;
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to clear a textbox
/*----------------------------------------------------------------------------------------------------------------*/
async function clearTextbox(locator, stepName) {
    try {
        // Focus on the textbox to ensure interaction
        await locator.click();
        // Clear the textbox
        await locator.fill('');
        console.log(`>>Test step: ${stepName} - PASS`);
    }
    catch (error) {
        console.error(`>>Test step: ${stepName} - FAIL\nError: ${error.message}`);
        throw error;
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to retrieve the text of an element
/*----------------------------------------------------------------------------------------------------------------*/
async function getElementText(selector) {
    try {
        // Wait for the element to be visible
        await selector.waitFor({ state: 'visible' });
        // Get the text content of the element
        const elementText = await selector.textContent();
        // Log and return the trimmed text content
        console.log(`Text of element: ${elementText?.trim()}`);
        return elementText ? elementText.trim() : null;
    }
    catch (error) {
        console.error(`Error getting text of element:`, error);
        return null;
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to navigate to a page
/*----------------------------------------------------------------------------------------------------------------*/
async function navigateToUrl(page, url) {
    try {
        console.log(`Navigating to URL: ${url}`);
        await page.goto(url, {
            waitUntil: 'networkidle', // Wait for no network connections
            timeout: 30000, // 
        });
        console.log(`Successfully navigated to: ${url}`);
    }
    catch (error) {
        console.error(`Failed to navigate to ${url}:`, error);
        throw error; // Re-throw the error to fail the test if navigation fails
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to maximise browser
/*----------------------------------------------------------------------------------------------------------------*/
async function maximizeWindow(page) {
    try {
        // Get the available screen dimensions
        const { width, height } = await page.evaluate(() => ({
            width: window.screen.availWidth,
            height: window.screen.availHeight
        }));
        // Set the viewport size to the available screen dimensions
        await page.setViewportSize({ width, height });
        console.info(`Test step: Browser window maximized - PASS`);
    }
    catch (error) {
        console.error(`Test step: FAIL - Error maximizing window: ${error.message}`);
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to assert for messages (success, info, error, toast etc)
/*----------------------------------------------------------------------------------------------------------------*/
async function verifyMessage(page, locator, message) {
    // Check if the locator contains the expected message
    await page.waitForTimeout(2000);
    const messageExists = await locator.locator(`text=${message}`).isVisible();
    if (messageExists) {
        console.log(`Test step : Verify message: "${message} is present - PASS"`);
    }
    else {
        throw new Error(`Test step : Verify message "${message}" is present - FAIL`);
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to make Graph API calls
/*----------------------------------------------------------------------------------------------------------------*/
async function makeGraphApiCall(endpoint, accessToken) {
    const url = `${config_1.config.graphApiBaseUrl}/${endpoint}`;
    const response = await (0, node_fetch_1.default)(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error(`Error fetching data from Graph API: ${response.statusText}`);
    }
    return response.json();
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to get the access token
/*----------------------------------------------------------------------------------------------------------------*/
async function getAccessToken() {
    const url = 'https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token';
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    body.append('client_id', process.env.CLIENT_ID || 'your-client-id');
    body.append('client_secret', process.env.CLIENT_SECRET || 'your-client-secret');
    body.append('scope', config_1.config.scope);
    const response = await (0, node_fetch_1.default)(url, {
        method: 'POST',
        body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    if (!response.ok) {
        throw new Error(`Error fetching access token: ${response.statusText}`);
    }
    const data = await response.json();
    return data.access_token;
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to extract CTA link from email content
/*----------------------------------------------------------------------------------------------------------------*/
async function extractCtaLink(emailBody) {
    const regex = /href=["'](https:\/\/[^\s]+)["']/; // Regex to match URL
    const match = emailBody.match(regex);
    return match ? match[1] : null;
}
/*----------------------------------------------------------------------------------------------------------------*/
