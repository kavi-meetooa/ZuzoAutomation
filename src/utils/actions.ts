import { Page } from '@playwright/test';
import { config } from "../config/config";
import { loginPage } from '../pages/loginPage';
import * as helper from '../utils/helper';


export async function executeLogin(page : Page, email : string) : Promise<void> {
    const LoginPage = new loginPage(page);

    await page.goto(config.baseUrl);
    await helper.maximizeWindow(page);
    await LoginPage.navigateToLogin();
    await page.waitForTimeout(3000);
    await LoginPage.enterCompanyEmail(email);
    await LoginPage.clickSubmit();
    await page.waitForTimeout(3000);
    await LoginPage.verifyEmailSentMessage();
    await page.waitForTimeout(7000);

    //Make Graph API call to read read user's email
    const emailContent = await helper.retrieveEmail(config.credentials.email, config.loginemailSubject)

    //Extract the link from Verify My Email CTA
    const redirectUrl = await helper.extractCtaLink(emailContent);

    if (redirectUrl != null)
    {
        //Navigate to the url (passwordless login)
        await page.goto(redirectUrl);
        console.info(">> Navigating to Zuzo (Passwordless Login)");
        await page.waitForTimeout(10000);
    }
    else
    {
        console.error("Redirect URL is NULL.")
    }
}

