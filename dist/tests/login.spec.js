"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const loginPage_1 = require("../pages/loginPage");
test_1.test.describe('Login Scenarios Tests for Zuzo', () => {
    let loginPageInstance;
    let page;
    /*********************************************************************************************************/
    // Setup before each test
    test_1.test.beforeEach(async ({ browser }) => {
        page = await browser.newPage(); // Create a new page for each test
        loginPageInstance = new loginPage_1.loginPage(page); // Instantiate the login page
        await loginPageInstance.navigateToLogin(); // Navigate to the login page
    });
    /*********************************************************************************************************/
    // Validate the Company Email field
    (0, test_1.test)('As a user, I want to navigate to the Login page and validate the Company email field', async () => {
        await loginPageInstance.validateEmail();
    });
    /*********************************************************************************************************/
    // Enter a valid email and verify for Email sent message    
    (0, test_1.test)('As a user, I want to enter a valid email and assert for email sent message', async () => {
        await loginPageInstance.enterCompanyEmail('kaviraj.meetooa+zuzo123@yoyogroup.com');
        await loginPageInstance.clickSubmit();
        await loginPageInstance.verifyEmailSentMessage();
    });
    /*********************************************************************************************************/
    // Click send again link to send email again   
    (0, test_1.test)('As a user, I want to send the confirmation email again', async () => {
        await loginPageInstance.enterCompanyEmail('kaviraj.meetooa+zuzo123@yoyogroup.com');
        await loginPageInstance.clickSubmit();
        await loginPageInstance.verifyEmailSentMessage();
        await loginPageInstance.clickSendAgain();
        await loginPageInstance.verifysendAgainToast();
    });
    /*********************************************************************************************************/
    // Cleanup after each test
    test_1.test.afterEach(async () => {
        await page.close(); // Close the page after each test
    });
    /*********************************************************************************************************/
}); // end of test.describe
