import { test, expect } from '@playwright/test';
import * as actions from '../../utils/actions';
import { paymentPage } from '../../pages/managePaymentPage';
import { manageEmployeesPage } from '../../pages/manageEmployeesPage';
import { issueRewardPage } from '../../pages/issueRewardPage';
import { slackPage } from '../../pages/slackPage';
import { p2pPage } from '../../pages/p2pPage';
import * as fs from 'fs';
import * as path from 'path';

let registeredEmail: string, company : string, cardName : string;

const dynamicConfigPath = path.join(__dirname, '../../config/dynamicConfig.json');

test.describe('Tests for New Zuzo Users', () => {
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
    test('As a new admin, I want to Register to Zuzo successfully', async ({ page }) => {
        registeredEmail = await actions.registerUser(page, "Slack");
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 New admin : Registration Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    });
/*--------------------------------------------------------------------------------------*/ 
    test('As a newly registered admin, I want to add a new payment method', async ({ page }) => {
        if (!registeredEmail) {
            const configData = JSON.parse(fs.readFileSync(dynamicConfigPath, 'utf8'));
            registeredEmail = configData.registeredEmail;
            company = configData.registeredCompany;
        }
        console.log("[INFO] ℹ️  Email used for login:", registeredEmail);
        await actions.executeLogin(page, registeredEmail);
        const PaymentsPage = new paymentPage(page);
        await PaymentsPage.navigateToPayments();
        await PaymentsPage.addNewCard();
        await PaymentsPage.verifyCardDetails();
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 New admin : Add New Payment Method Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    });
/*--------------------------------------------------------------------------------------*/ 
    test('As a newly registered admin, I want to add new Billing information', async ({ page }) => {
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
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 New admin : Add New Billing Info Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    });
/*--------------------------------------------------------------------------------------*/ 
    test('As an new admin, I want to edit my billing info', async ({ page }) => {
        await actions.executeLogin(page, registeredEmail);
        const PaymentsPage = new paymentPage(page);
        await PaymentsPage.navigateToPayments();
        await page.waitForTimeout(3000);
        await PaymentsPage.editBillingInfo();
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 New admin : Edit Billing Info Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    });  
/*--------------------------------------------------------------------------------------*/
    test('As an new admin, I want to add a new employee to my company', async ({ page }) => {
        await actions.executeLogin(page, registeredEmail);
        const employeePage = new manageEmployeesPage(page);
        await employeePage.selectRewardType("Ad-Hoc");
        await employeePage.addSingleEmployee();
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 New admin : Add a new employee Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    }); 
/*--------------------------------------------------------------------------------------*/ 
    test('As an new admin, I want to add some employees (10) to my company', async ({ page }) => {
        await actions.executeLogin(page, registeredEmail);
        const employeePage = new manageEmployeesPage(page);
        await employeePage.selectRewardType("Ad-Hoc");
        for (let i = 1; i <= 10; i++) {
            await employeePage.addSingleEmployee();
            console.log(`✅ Employee ${i} added successfully.`);
        }
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 Existing admin : Added 10 new employees Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    });
/*--------------------------------------------------------------------------------------*/ 
    test('As an new admin, I want to edit the details of an employee', async ({ page }) => {
        await actions.executeLogin(page, registeredEmail);
        const employeePage = new manageEmployeesPage(page);
        await employeePage.selectRewardType("Ad-Hoc");
        await employeePage.editEmployeeDetails();
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 Existing admin : Edit employee details Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    }); 
/*--------------------------------------------------------------------------------------*/ 
    test('As an new admin, I want to remove an employee from my company', async ({ page }) => {
        await actions.executeLogin(page, registeredEmail);
        const employeePage = new manageEmployeesPage(page);
        await employeePage.selectRewardType("Ad-Hoc");
        await employeePage.removeEmployee();
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 Existing admin : Remove employee Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    }); 
/*--------------------------------------------------------------------------------------*/ 
test.only('As an new admin, I want to create a new company, payment details and sync employees to Slack and activate P2P', async ({ page }) => {
    const employeeEmails: string[] = [];
    // Register company
    registeredEmail = await actions.registerUser(page, "Slack");
    console.log("-".repeat(60));
    console.log("👍 -- 🟢 New admin : Registration -> Test Passed 🎉 -- ");
    console.log("-".repeat(60));

    // Add a new card
    const PaymentsPage = new paymentPage(page);
    await PaymentsPage.navigateToPayments();
    await PaymentsPage.addNewCard();
    await PaymentsPage.verifyCardDetails();
    console.log("-".repeat(60));
    console.log("👍 -- 🟢 New admin : Add New Payment Method -> Test Passed 🎉 -- ");
    console.log("-".repeat(60));

    // Add a billing info
    await PaymentsPage.addBillingInfo();
    console.log("-".repeat(60));
    console.log("👍 -- 🟢 New admin : Add New Billing Info -> Test Passed 🎉 -- ");
    console.log("-".repeat(60));

    // Sync all employees to Slack
    const issuancePage     = new issueRewardPage(page);
    const slackActionsPage = new slackPage(page);

    const configData = JSON.parse(fs.readFileSync(dynamicConfigPath, 'utf8'));
    registeredEmail = configData.registeredEmail;

    const employeePage = new manageEmployeesPage(page);

    await employeePage.selectRewardType("peer-to-peer");

    // Create Slack Workspace
    const channelName = await slackActionsPage.createSlackWorkspaceWeb(registeredEmail);
    console.log("-".repeat(60));
    console.log("👍 -- 🟢 New admin : New Slack Workspace Creation -> Test Passed 🎉 -- ");
    console.log("-".repeat(60));
    
    // Sync Slack Users
    await slackActionsPage.syncSlackUsers();
    console.log("-".repeat(60));
    console.log("👍 -- 🟢 New admin : Sync Slack Users -> Test Passed 🎉 -- ");
    console.log("-".repeat(60));

    // Activate P2P
    const P2PPage = new p2pPage(page);
    await P2PPage.navigatetoP2Ppage();
    await issuancePage.selectAllEmployees();
    await P2PPage.activateP2P("50.00", "Teamwork");
    await PaymentsPage.authoriseCard();
    await P2PPage.confirmP2PEnabled();
    console.log("-".repeat(60));
    console.log("👍 -- 🟢 New admin : P2P Activation for all employees -> Test Passed 🎉 -- ");
    console.log("-".repeat(60));
}); 
/*--------------------------------------------------------------------------------------*/ 
test('As a new admin, I want to create a new slack workspace for my new company', async ({ page }) => {
    registeredEmail = await actions.registerUser(page, "Slack");
    console.log("-".repeat(60));
    console.log("👍 -- 🟢 New admin : Registration Test Passed 🎉 -- ");
    console.log("-".repeat(60));
    
    const slackActionsPage = new slackPage(page);

    const configData = JSON.parse(fs.readFileSync(dynamicConfigPath, 'utf8'));
    registeredEmail = configData.registeredEmail;
    await slackActionsPage.createSlackWorkspaceWeb(registeredEmail);
});
/*--------------------------------------------------------------------------------------*/
});
