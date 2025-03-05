import { test, expect, Page } from '@playwright/test';
import  *  as actions from '../../utils/actions';
import { config } from "../../config/config"; 
import { paymentPage } from '../../pages/managePaymentPage';
import { manageEmployeesPage } from '../../pages/manageEmployeesPage';
import { issueRewardPage } from '../../pages/issueRewardPage';
import { slackPage } from '../../pages/slackPage';

test.describe('Tests for Existing User', () => {
/*--------------------------------------------------------------------------------------*/ 
    test.beforeEach(async ({ page }) => {
        //await actions.executeLogin(page, config.credentials.email);
        await actions.executeLogin(page, "AutomationUser+90367@yoyogroup.com");
        
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 Existing user : Login to Zuzo Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    });
/*--------------------------------------------------------------------------------------*/ 
    test('As an existing user, I delete my existing payment method', async ({ page }) => {
        const PaymentsPage = new paymentPage(page);
        await PaymentsPage.deletecard();
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 Existing user : Delete Payment Method Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    });  
/*--------------------------------------------------------------------------------------*/ 
    test('As an existing user, I want to add a new payment method', async ({ page }) => {
        const PaymentsPage = new paymentPage(page);
        await PaymentsPage.navigateToPayments();
        await page.waitForTimeout(3000);
        await PaymentsPage.addNewCard();
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 Existing user : Add New Payment Method Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    });  
/*--------------------------------------------------------------------------------------*/
    test('As an existing user, I want to add a new billing info', async ({ page }) => {
        const PaymentsPage = new paymentPage(page);
        await PaymentsPage.navigateToPayments();
        await page.waitForTimeout(3000);
        await PaymentsPage.addBillingInfo();
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 Existing user : Add New Billing Info Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    });  
/*--------------------------------------------------------------------------------------*/ 
    test('As an existing user, I want to edit my billing info', async ({ page }) => {
        const PaymentsPage = new paymentPage(page);
        await PaymentsPage.navigateToPayments();
        await page.waitForTimeout(3000);
        await PaymentsPage.editBillingInfo();
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 Existing user : Edit Billing Info Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    });  
/*--------------------------------------------------------------------------------------*/
    test('As an existing user, I want to add one new employee to my company', async ({ page }) => {
        const employeePage = new manageEmployeesPage(page);
        await employeePage.selectRewardType("Ad-Hoc");
        await employeePage.addSingleEmployee();
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 Existing user : Add a new employee Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    }); 
/*--------------------------------------------------------------------------------------*/
    test('As an existing user, I want to add some employees (10) to my company', async ({ page }) => {
        const employeePage = new manageEmployeesPage(page);
        await employeePage.selectRewardType("Ad-Hoc");
        for (let i = 1; i <= 10; i++) {
            await employeePage.addSingleEmployee();
            console.log(`✅ Employee ${i} added successfully.`);
        }
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 Existing user : Added 10 new employees Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    });
/*--------------------------------------------------------------------------------------*/ 
    test('As an existing user, I want to edit the details of an employee', async ({ page }) => {
        const employeePage = new manageEmployeesPage(page);
        await employeePage.selectRewardType("Ad-Hoc");
        await employeePage.editEmployeeDetails();
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 Existing user : Edit employee details Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    }); 
/*--------------------------------------------------------------------------------------*/ 
    test('As an existing user, I want to remove an employee from my company', async ({ page }) => {
        const employeePage = new manageEmployeesPage(page);
        await employeePage.selectRewardType("Ad-Hoc");
        await employeePage.removeEmployee();
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 Existing user : Remove employee Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    }); 
/*-----------------------------------------------------------------------------------------------------------------*/ 
    test('As an existing user, I send an Ad Hoc Reward of same value to multiple employees', async ({ page }) => {
        const issuancePage = new issueRewardPage(page);
        const PaymentsPage = new paymentPage(page);

        await issuancePage.selectMultipleEmployees(6);
        await issuancePage.processAdHocRewards("samevalue");
        await PaymentsPage.authoriseCard();
        await issuancePage.confirmPaymentProcessed();
    
        console.log("-".repeat(100));
        console.log("👍 -- 🟢 Existing user : Process Ad Hoc Rewards(same value) for Multiple employees Test Passed 🎉 -- ");
        console.log("-".repeat(100));
    }); 
/*---------------------------------------------------------------------------------------------------------------*/ 
    test('As an existing user, I send an Ad Hoc Reward of same value to a single employees', async ({ page }) => {
        const employeePage = new manageEmployeesPage(page);
        const issuancePage = new issueRewardPage(page);
        const PaymentsPage = new paymentPage(page);

        await employeePage.selectRewardType("Ad-Hoc");
        await issuancePage.selectSingleEmployee();
        await issuancePage.processAdHocRewards("samevalue");
        await PaymentsPage.authoriseCard();
        await issuancePage.confirmPaymentProcessed();
    
        console.log("-".repeat(100));
        console.log("👍 -- 🟢 Existing user : Process Ad Hoc Rewards(same value) for a single employee Test Passed 🎉 -- ");
        console.log("-".repeat(100));
    }); 
/*---------------------------------------------------------------------------------------------------------------*/ 
    test('As an existing user, I send an Ad Hoc Reward of same value to all employees', async ({ page }) => {
        const employeePage = new manageEmployeesPage(page);
        const issuancePage = new issueRewardPage(page);
        const PaymentsPage = new paymentPage(page);

        await employeePage.selectRewardType("Ad-Hoc");
        await issuancePage.selectAllEmployees();
        await issuancePage.processAdHocRewards("samevalue");
        await PaymentsPage.authoriseCard();
        await issuancePage.confirmPaymentProcessed();
    
        console.log("-".repeat(100));
        console.log("👍 -- 🟢 Existing user : Process Ad Hoc Rewards(same value) for all employees Test Passed 🎉 -- ");
        console.log("-".repeat(100));
    }); 
/*---------------------------------------------------------------------------------------------------------------*/ 
    test.only('As an existing user, I sync all my employees to Slack', async ({ page }) => {
        const employeePage     = new manageEmployeesPage(page);
        const issuancePage     = new issueRewardPage(page);
        const slackActionsPage = new slackPage(page);

        await employeePage.selectRewardType("Ad-Hoc");
        await issuancePage.selectAllEmployees();
        //await slackActionsPage.createSlackWorkspace("AutomationUser+95494@yoyogroup.com");
    });
/*---------------------------------------------------------------------------------------------------------------*/ 
});// end of test.describe

