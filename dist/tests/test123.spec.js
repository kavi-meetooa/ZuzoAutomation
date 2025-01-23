"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const axios_1 = __importDefault(require("axios"));
// Constants for Microsoft Graph API
const GRAPH_API_BASE_URL = 'https://graph.microsoft.com/v1.0';
const TENANT_ID = 'd454e49e-dc50-4bab-9f06-fe9586952831';
const CLIENT_ID = '05a2a529-26a7-438a-9d51-2fdd6651984c';
const CLIENT_SECRET = 'gqj8Q~v9IxTivAECn.F-9pAQWIFCJjDPvks1XcaK';
const MAIL_FOLDER = '/me/mailFolders/Inbox/messages';
const LOGIN_EMAIL_SUBJECT = 'You have requested to log in to Zuzo';
const TARGET_EMAIL = 'kaviraj.meetooa@yoyogroup.com';
/**
 * Helper method to fetch the access token using OAuth 2.0 Client Credentials Flow
 */
async function getAccessToken() {
    const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
    const response = await axios_1.default.post(tokenUrl, new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    if (response.status === 200 && response.data.access_token) {
        return response.data.access_token;
    }
    else {
        throw new Error('Failed to fetch access token');
    }
}
(0, test_1.test)('Verify email and extract link from "Verify My Email" button', async ({ page }) => {
    // Step 1: Get the access token
    const accessToken = await getAccessToken();
    // Step 2: Fetch the user's inbox messages
    const response = await axios_1.default.get(`${GRAPH_API_BASE_URL}/users/${TARGET_EMAIL}/messages?$top=1&$search="subject:${LOGIN_EMAIL_SUBJECT}"`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    await page.waitForTimeout(10000);
    // Step 3: Ensure the email is found
    (0, test_1.expect)(response.status).toBe(200);
    const messages = response.data.value;
    (0, test_1.expect)(messages.length).toBeGreaterThan(0);
    const email = messages[0];
    console.log('Email Found:', email.subject);
    // Step 4: Parse the email body to find the "Verify My Email" link
    const emailBody = email.body.content;
    // Regex to match the "Verify My Email" link
    const linkRegex = /<a[^>]+href="([^"]+)"[^>]*>Verify My Email<\/a>/i;
    const match = emailBody.match(linkRegex);
    // Check if the link exists
    (0, test_1.expect)(match).not.toBeNull();
    const verificationLink = match[1]; // Extract the link
    console.log('Verification Link:', verificationLink);
    // Step 5: Use Playwright to open the verification link
    await page.goto(verificationLink);
    await page.waitForTimeout(10000);
});
