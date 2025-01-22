import { Page } from 'playwright';
import { config } from "../config/config";
import * as helper from "../utils/helper";
import messages from "../data/messages";

export class loginPage {
    private page: Page;

    // Locators object with dynamic locator function for channels
    private Locators = {
        txtCompanyEmail : () => this.page.getByLabel('Company Email'),
        btnLogin        : () => this.page.getByRole('button', { name: 'Log in' }),
        btnSubmit       : () => this.page.getByRole('button', { name: 'Submit' }),
        SignUplink      : () => this.page.getByText('Sign up'),
        sendAgainlink   : () => this.page.getByText('send again'),
        emailSentToast  : () => this.page.locator('.p-4'),
        emailErrorMsg   : () => this.page.locator('.//span[contains(@class, "yoyo-error-red")]'),
        emailSentMsg    : () => this.page.locator('//*[contains(@class, "text-6xl")]'),
        emailErrorToast : () => this.page.locator('.p-4'),
    };

    constructor(page: Page) {
        this.page = page;
    }

/*******************************************************************************************************************/ 
// Navigate to Login page
async navigateToLogin() : Promise<void>
{
    await helper.navigateToUrl(this.page, config.baseUrl);
    await helper.maximizeWindow(this.page);
    this.clickLoginBtn();
    console.info("Test step : Navigate to Login page - PASS");
}
/*******************************************************************************************************************/ 
// Click on Login Button on Homepage
async clickLoginBtn() : Promise<void> 
{
    await helper.clickElement(this.Locators.btnLogin(), 'Click on Login button on Homepage.');
    console.log("-------------------------");
}
/*******************************************************************************************************************/ 
async enterCompanyEmail(email : string) : Promise<void>
{
    await helper.fillElement(this.Locators.txtCompanyEmail(), email, `Enter ${email} in the Company Email textbox.`);
    console.log("-------------------------");
}
/*******************************************************************************************************************/ 
// Click on Submit Button 
async clickSubmit() : Promise<void> 
{
    await helper.clickElement(this.Locators.btnSubmit(), 'Click on Submit button.');
    console.log("-------------------------");
}
/********************************************************************************************************************/
// Click on Sign up button
async clickSignUp() : Promise<void> 
{
    await helper.clickElement(this.Locators.SignUplink(), 'Click on Sign up link on the Login page.');
    console.log("-------------------------");
}
/********************************************************************************************************************/
// Click on Sign up button
async clickSendAgain() : Promise<void> 
{
    await helper.clickElement(this.Locators.sendAgainlink(), 'Click Send Again link.');
    await this.page.waitForTimeout(3000);
    // Verify the toast message
    await helper.verifyMessage(this.page, this.Locators.emailSentToast(), messages.toastMessages['email.sendAgain']); 
    console.log("-------------------------");
}
/********************************************************************************************************************/
async validateEmail() : Promise<void>
{
    'Scenario 1 : Click on Submit with blank email field'
    this.clickSubmit();
    helper.verifyMessage(this.page, this.Locators.emailErrorMsg(), messages.errorMessages['login.blank_email']);

    'Scenario 2 : Enter an invalid format for email and click on Submit'
    helper.fillElement(this.Locators.txtCompanyEmail(), 'abc$%$5.com@', 'Enter an invalid email format for Company email');
    helper.verifyMessage(this.page, this.Locators.emailErrorMsg(), messages.errorMessages['login.invalid_email']);
}
/********************************************************************************************************************/
async verifyEmailSentMessage() : Promise<void>
{
    helper.verifyMessage(this.page, this.Locators.emailSentMsg(), messages.infoMessage['sentEmail.header']);
}
/********************************************************************************************************************/
async verifysendAgainToast() : Promise<void>
{
    helper.verifyMessage(this.page, this.Locators.emailSentToast(), messages.toastMessages['email.sendAgain']);
}
/********************************************************************************************************************/
}// end of class