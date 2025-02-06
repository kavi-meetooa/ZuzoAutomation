import { test, expect, Page } from '@playwright/test';
import  *  as actions from '../../utils/actions';
import { config } from "../../config/config"; 
import { paymentPage } from '../../pages/paymentPage';

test.describe('Tests for Existing User', () => {
/*--------------------------------------------------------------------------------------*/ 
    test.beforeEach(async ({ page }) => {
        await actions.executeLogin(page, config.credentials.email);
        console.log("-".repeat(50));
        console.log("👍 -- 🟢 Existing user : Login to Zuzo Test Passed 🎉 -- ");
        console.log("-".repeat(50));
    });
/*--------------------------------------------------------------------------------------*/ 
test('As an existing user, I delete my existing payment method', async ({ page }) => {
    const PaymentsPage = new paymentPage(page);
    await PaymentsPage.deletecard();
    console.log("-".repeat(50));
    console.log("👍 -- 🟢 Existing user : Delete Payment Method Test Passed 🎉 -- ");
    console.log("-".repeat(50));
});  
/*--------------------------------------------------------------------------------------*/ 
test('As an existing user, I want to add a new payment method', async ({ page }) => {
    const PaymentsPage = new paymentPage(page);
    await PaymentsPage.navigateToPayments();
    await page.waitForTimeout(3000);
    await PaymentsPage.addNewCard();
    await PaymentsPage.authoriseCard();
    console.log("-".repeat(50));
    console.log("👍 -- 🟢 Existing user : Add New Payment Method Test Passed 🎉 -- ");
    console.log("-".repeat(50));
});  
/*--------------------------------------------------------------------------------------*/
test('As an existing user, I want to add a new billing info', async ({ page }) => {
    const PaymentsPage = new paymentPage(page);
    await PaymentsPage.navigateToPayments();
    await page.waitForTimeout(3000);
    await PaymentsPage.addBillingInfo();
    console.log("-".repeat(50));
    console.log("👍 -- 🟢 Existing user : Add New Payment Method Test Passed 🎉 -- ");
    console.log("-".repeat(50));
});  
/*--------------------------------------------------------------------------------------*/ 
test('As an existing user, I want to edit my billing info', async ({ page }) => {
    const PaymentsPage = new paymentPage(page);
    await PaymentsPage.navigateToPayments();
    await page.waitForTimeout(3000);
    await PaymentsPage.editBillingInfo();
    console.log("-".repeat(50));
    console.log("👍 -- 🟢 Existing user : Edit Billing Info Test Passed 🎉 -- ");
    console.log("-".repeat(50));
});  
/*--------------------------------------------------------------------------------------*/
});// end of test.describe