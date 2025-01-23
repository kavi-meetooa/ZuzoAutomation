"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginPage = void 0;
const config_1 = require("../config/config");
const helper = __importStar(require("../utils/helper"));
const messages_1 = __importDefault(require("../data/messages"));
class loginPage {
    constructor(page) {
        // Locators object with dynamic locator function for channels
        this.Locators = {
            txtCompanyEmail: () => this.page.getByLabel('Company Email'),
            btnLogin: () => this.page.getByRole('button', { name: 'Log in' }),
            btnSubmit: () => this.page.getByRole('button', { name: 'Submit' }),
            SignUplink: () => this.page.getByText('Sign up'),
            sendAgainlink: () => this.page.getByText('send again'),
            emailSentToast: () => this.page.locator('.p-4'),
            emailErrorMsg: () => this.page.locator('xpath=.//span[contains(@class, "yoyo-error-red")]'),
            emailSentMsg: () => this.page.locator('//*[contains(@class, "text-6xl")]'),
            emailErrorToast: () => this.page.locator('.p-4'),
        };
        this.page = page;
    }
    /*******************************************************************************************************************/
    // Navigate to Login page
    async navigateToLogin() {
        await helper.navigateToUrl(this.page, config_1.config.baseUrl);
        this.clickLoginBtn();
        console.info("Test step : Navigate to Login page - PASS");
    }
    /*******************************************************************************************************************/
    // Click on Login Button on Homepage
    async clickLoginBtn() {
        await helper.clickElement(this.Locators.btnLogin(), 'Click on Login button on Homepage.');
        console.log("-------------------------");
    }
    /*******************************************************************************************************************/
    async enterCompanyEmail(email) {
        await helper.fillElement(this.Locators.txtCompanyEmail(), email, `Enter ${email} in the Company Email textbox.`);
        console.log("-------------------------");
    }
    /*******************************************************************************************************************/
    // Click on Submit Button 
    async clickSubmit() {
        await helper.clickElement(this.Locators.btnSubmit(), 'Click on Submit button.');
        console.log("-------------------------");
    }
    /********************************************************************************************************************/
    // Click on Sign up button
    async clickSignUp() {
        await helper.clickElement(this.Locators.SignUplink(), 'Click on Sign up link on the Login page.');
        console.log("-------------------------");
    }
    /********************************************************************************************************************/
    // Click on Sign up button
    async clickSendAgain() {
        await helper.clickElement(this.Locators.sendAgainlink(), 'Click Send Again link.');
        await this.page.waitForTimeout(3000);
        // Verify the toast message
        await helper.verifyMessage(this.page, this.Locators.emailSentToast(), messages_1.default.toastMessages['email.sendAgain']);
        console.log("-------------------------");
    }
    /********************************************************************************************************************/
    async validateEmail() {
        console.log('Scenario 1 : Click on Submit with blank email field');
        this.clickSubmit();
        helper.verifyMessage(this.page, this.Locators.emailErrorMsg(), messages_1.default.errorMessages['login.blank_email']);
        console.log('Scenario 2 : Enter an invalid format for email and click on Submit');
        helper.fillElement(this.Locators.txtCompanyEmail(), 'abc$%$5.com@', 'Enter an invalid email format for Company email');
        helper.verifyMessage(this.page, this.Locators.emailErrorMsg(), messages_1.default.errorMessages['login.invalid_email']);
    }
    /********************************************************************************************************************/
    async verifyEmailSentMessage() {
        helper.verifyMessage(this.page, this.Locators.emailSentMsg(), messages_1.default.infoMessage['sentEmail.header']);
    }
    /********************************************************************************************************************/
    async verifysendAgainToast() {
        helper.verifyMessage(this.page, this.Locators.emailSentToast(), messages_1.default.toastMessages['email.sendAgain']);
    }
} // end of class
exports.loginPage = loginPage;
