import { test, expect, Page } from '@playwright/test';
import { loginPage } from '../pages/loginPage';

test.describe('Login Scenarios Tests for Zuzo', () => {
    let loginPageInstance: loginPage;
    let page: Page;
/*********************************************************************************************************/
    // Setup before each test
    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage(); // Create a new page for each test
        loginPageInstance = new loginPage(page); // Instantiate the login page
        await loginPageInstance.navigateToLogin(); // Navigate to the login page
    });
/*********************************************************************************************************/
    // Validate the Company Email field
    test('As a user, I want to navigate to the Login page and validate the Company email field', async () => {
        await loginPageInstance.validateEmail();
    });
/*********************************************************************************************************/
    // Enter a valid email and verify for Email sent message    
    test('As a user, I want to enter a valid email and assert for email sent message', async () => {
        await loginPageInstance.enterCompanyEmail('kaviraj.meetooa+zuzo123@yoyogroup.com');
        await loginPageInstance.clickSubmit();
        await loginPageInstance.verifyEmailSentMessage();
    });
/*********************************************************************************************************/
    // Click send again link to send email again   
    test('As a user, I want to send the confirmation email again', async () => {
        await loginPageInstance.enterCompanyEmail('kaviraj.meetooa+zuzo123@yoyogroup.com');
        await loginPageInstance.clickSubmit();
        await loginPageInstance.verifyEmailSentMessage();
        await loginPageInstance.clickSendAgain();
        await loginPageInstance.verifysendAgainToast();
    });
/*********************************************************************************************************/
    // Cleanup after each test
    test.afterEach(async () => {
        await page.close(); // Close the page after each test
    });
/*********************************************************************************************************/
}); // end of test.describe