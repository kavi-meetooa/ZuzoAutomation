import { test, expect } from '@playwright/test';
import * as actions from '../../utils/actions';
import { paymentPage } from '../../pages/paymentPage';
import * as fs from 'fs';
import * as path from 'path';

let registeredEmail: string, company : string, cardName : string;

const dynamicConfigPath = path.join(__dirname, '../../config/dynamicConfig.json');

test.describe('Registration Tests for New Users', () => {
/*--------------------------------------------------------------------------------------*/ 
    test.beforeAll(async () => {
        // Load registeredEmail from file before running any test
        try {
            const configData = JSON.parse(fs.readFileSync(dynamicConfigPath, 'utf8'));
            registeredEmail = configData.registeredEmail;
            console.log("[INFO] ℹ️  Loaded registeredEmail in beforeAll:", registeredEmail);
        } catch (error) {
            console.error("❌ Error reading dynamicConfig.json in beforeAll: ", error);
        }
    });
/*--------------------------------------------------------------------------------------*/ 
    test.only('As a new user, I want to Register to Zuzo successfully', async ({ page }) => {
        registeredEmail = await actions.registerUser(page, "Slack");
        console.log("-".repeat(50));
        console.log("👍 -- 🟢 New User : Registration Test Passed 🎉 -- ");
        console.log("-".repeat(50));
    });
/*--------------------------------------------------------------------------------------*/ 
    test.only('As a newly registered user, I want to add a new payment method', async ({ page }) => {
        if (!registeredEmail) {
            const configData = JSON.parse(fs.readFileSync(dynamicConfigPath, 'utf8'));
            registeredEmail = configData.registeredEmail;
            company = configData.registeredCompany;
            cardName = configData.cardName;
        }
        console.log("[INFO] ℹ️  Email used for login:", registeredEmail);
        await actions.executeLogin(page, registeredEmail);
        const PaymentsPage = new paymentPage(page);
        await PaymentsPage.navigateToPayments();
        await PaymentsPage.addNewCard();
        await PaymentsPage.authoriseCard();
        await PaymentsPage.verifyCardDetails();
        console.log("-".repeat(50));
        console.log("👍 -- 🟢 New User : Add New Payment Method Test Passed 🎉 -- ");
        console.log("-".repeat(50));
    });
/*--------------------------------------------------------------------------------------*/ 
    test('As a newly registered user, I want to add new Billing information', async ({ page }) => {
        if (!registeredEmail) {
            const configData = JSON.parse(fs.readFileSync(dynamicConfigPath, 'utf8'));
            registeredEmail = configData.registeredEmail;
        }
        if (!registeredEmail) {
            throw new Error("❌ registeredEmail is missing in dynamicConfig.json");
        }
        console.log("[INFO] ℹ️  Email used for billing info:", registeredEmail);
        await actions.executeLogin(page, registeredEmail);
        const paymentsPage = new paymentPage(page);
        await paymentsPage.addBillingInfo();
        console.log("-".repeat(50));
        console.log("👍 -- 🟢 New User : Add New Billing Info Test Passed 🎉 -- ");
        console.log("-".repeat(50));
    });
/*--------------------------------------------------------------------------------------*/ 
test('As an new user, I want to edit my billing info', async ({ page }) => {
    await actions.executeLogin(page, registeredEmail);
    const PaymentsPage = new paymentPage(page);
    await PaymentsPage.navigateToPayments();
    await page.waitForTimeout(3000);
    await PaymentsPage.editBillingInfo();
    console.log("-".repeat(50));
    console.log("👍 -- 🟢 New User : Edit Billing Info Test Passed 🎉 -- ");
    console.log("-".repeat(50));
});  
/*--------------------------------------------------------------------------------------*/
});
