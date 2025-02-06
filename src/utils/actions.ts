import { Page } from '@playwright/test';
import { config } from "../config/config";
import { loginPage } from '../pages/loginPage';
import { dashboardPage } from '../pages/dashboardPage';
import { registrationPage } from '../pages/registrationPage';
import * as helper from '../utils/helper';
import * as fs from 'fs';
import * as path from 'path';

/*-----------------------------------------------------------------------------------------------------*/
// Re-usable function to login to Zuzo with parameter the Login page, and Company email
// Use graph API function from helper file to access email, get CTA link and perform passwordless login
/*------------------------------------------------------------------------------------------------------*/
export async function executeLogin(page : Page, email : string) : Promise<void> {
    const LoginPage = new loginPage(page);
    const DashboardPage = new dashboardPage(page);

    await page.goto(config.baseUrl);
    await LoginPage.navigateToLogin();
    await page.waitForTimeout(3000);
    console.log("[INFO] ℹ️  Email is : " + email);
    await LoginPage.enterCompanyEmail(email);
    await LoginPage.clickSubmit();
    await page.waitForTimeout(3000);
    await LoginPage.verifyEmailSentMessage();
    console.log("[INFO] ℹ️  Email sent...Waiting for reception in Inbox...");
    await page.waitForTimeout(10000);

    //Make Graph API call to read read user's email
    const emailContent = await helper.retrieveEmail(email, config.loginemailSubject)

    //Extract the link from Verify My Email CTA
    const redirectUrl = await helper.extractCtaLink(emailContent);

    if (redirectUrl != null)
    {
        //Navigate to the url (passwordless login)
        await page.goto(redirectUrl);
        console.info("[INFO] ℹ️  Navigating to Zuzo (Passwordless Login)");
        await page.waitForTimeout(5000);
        //Assert succesful login
        DashboardPage.verifyDashboardElements();
    }
    else
    {
        console.error("❌ Error - Redirect URL is NULL.")
    }
}
/*--------------------------------------------------------------------------------------------------*/
// Re-usable function to register to Zuzo with parameter the Login page, and Company email
// Uses randomly generated data with a default email address and randomly select options from dropdown
// Parameter to be used is either Teams or Slack as integration tool
/*---------------------------------------------------------------------------------------------------*/
export async function registerUser(page : Page, integrationTool : string) : Promise<string>
{
    const registerPage = new registrationPage(page);
    const DashboardPage = new dashboardPage(page);
    const LoginPage = new loginPage(page);

    const dynamicConfigPath = path.join(__dirname, '../config/dynamicConfig.json');

    registerPage.navigateToRegistration()
    await page.waitForTimeout(3000);
    registerPage.enterFirstName();
    await page.waitForTimeout(1000);
    registerPage.enterLastName();
    await page.waitForTimeout(1000);
    const company = await registerPage.enterCompanyName();
    await page.waitForTimeout(1000);
    const email = await registerPage.enterEmail();
    await page.waitForTimeout(1000);
    registerPage.selectCountry();
    await page.waitForTimeout(1000);
    registerPage.selectIndustry();
    await page.waitForTimeout(1000);
    registerPage.selectNumofEmployees();
    await page.waitForTimeout(1000);
    registerPage.selectIntegrationTool("Slack");
    await page.waitForTimeout(1000);
    registerPage.checkTandC();
    await page.waitForTimeout(1000);
    registerPage.clicksubmit();

    await performPasswordlessLogin(page, email);
    console.log("[INFO] ℹ️ New user : " + email + " registered successfully.")
    DashboardPage.verifyDashboardElements();

    // Save email to dynamicConfig.json (
    const dynamicConfigData = { registeredEmail: email, registeredCompany : company, savedCardName : "" };

    try {
        console.log("[INFO] ℹ️ Writing to dynamicConfig.json...");
        fs.writeFileSync(dynamicConfigPath, JSON.stringify(dynamicConfigData, null, 4));
        console.log("[INFO] ℹ️ Successfully written to dynamicConfig.json");
    } catch (error) {
        console.error("❌ Error writing to dynamicConfig.json:", error);
    }

    return email;
}
/*--------------------------------------------------------------------------------------------------*/
// Function to retrieve mail using graph API and navigate to the magic link(passwordlessLogin)
/*---------------------------------------------------------------------------------------------------*/
export async function performPasswordlessLogin(page: Page, email : string) : Promise<void>
{
    const LoginPage = new loginPage(page);

    await page.waitForTimeout(2000);
    await LoginPage.verifyEmailSentMessage();
    console.log("[INFO] ℹ️ Email sent...Waiting for reception in Inbox...");
    await page.waitForTimeout(10000);

    //Make Graph API call to read read user's email
    const emailContent = await helper.retrieveEmail(config.credentials.email, config.loginemailSubject)

    //Extract the link from Verify My Email CTA
    const redirectUrl = await helper.extractCtaLink(emailContent);

    if (redirectUrl != null)
    {
        //Navigate to the url (passwordless login)
        await page.goto(redirectUrl);
        await page.waitForTimeout(5000);
        console.info("[INFO] ℹ️ Navigated to Zuzo (Passwordless Login)");
    }
    else
    {
        console.error("❌ Error - Redirect URL is NULL.")
    }
}

