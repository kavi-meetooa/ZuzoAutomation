import { test, expect, Browser, Page } from '@playwright/test';
import { loginPage } from '../pages/loginPage';

test.describe('Login Scenarios Tests for Zuzo', () => 
    {
    let browser: Browser;
    let page: Page;
    let loginPageInstance: loginPage;

    // Initialize the browser, context, and page manually in beforeAll
    test.beforeAll(async ({ browser: testBrowser }) => 
    {
        browser = testBrowser;
        const context = await browser.newContext();
        page = await context.newPage();
        loginPageInstance = new loginPage(page);
        await loginPageInstance.navigateToLogin();
    });

    // Clean up the browser context after all tests
    test.afterAll(async () => 
    {
        await page.close();
        await browser.close();
    });
/*------------------------------------------------------------------------------------------------------------------*/
    // Validate the Company Email field
    test('As a user, I want to navigate to the Login page and validate the Company email field', async () => 
    {
        await loginPageInstance.validateEmail();
    });
/*------------------------------------------------------------------------------------------------------------------*/
// Enter a valid email and verify for Email sent message    
test('As a user, I want to enter a valid email and assert for email sent message', async () => 
    {
        await loginPageInstance.enterCompanyEmail('kaviraj.meetooa+zuzo123@yoyogroup.com');
        await loginPageInstance.clickSubmit();
        await loginPageInstance.verifyEmailSentMessage();
    });
/*------------------------------------------------------------------------------------------------------------------*/
// Click send again link to send email again   
test('As a user, I want to send the confirmation email again', async () => 
    {
        await loginPageInstance.clickSendAgain();
        await loginPageInstance.verifysendAgainToast();
    });
/*------------------------------------------------------------------------------------------------------------------*/    
}); // end of test.describe
