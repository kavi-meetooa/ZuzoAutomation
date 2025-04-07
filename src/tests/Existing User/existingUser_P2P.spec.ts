import { test, expect, Page } from '@playwright/test';
import  *  as actions from '../../utils/actions';
import { p2pPage } from '../../pages/p2pPage';
import { paymentPage } from '../../pages/managePaymentPage';

test.describe('P2P Tests for Existing User', () => {
/*--------------------------------------------------------------------------------------*/ 
    test.beforeEach(async ({ page }) => {
        await actions.executeLogin(page, "AutomationUser+90367@yoyogroup.com");
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 Existing user : Login to Zuzo Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    });
/*--------------------------------------------------------------------------------------*/ 
    test('As an existing user, I manage P2P for all my employees', async ({ page }) => {
        const P2PPage   = new p2pPage(page);

        await P2PPage.manageP2P();
        console.log("-".repeat(60));
        console.log("👍 -- 🟢 Existing user : Manage Peer to Peer Recognition Test Passed 🎉 -- ");
        console.log("-".repeat(60));
    });

/*--------------------------------------------------------------------------------------*/ 
test.only('As an existing user, I want to edit the P2P allocation for a single employee', async ({ page }) => {
    const P2PPage       = new p2pPage(page);
    const PaymentsPage  = new paymentPage(page);

    await P2PPage.editSingleAllocation();
    await PaymentsPage.authoriseCard();
    await P2PPage.confirmP2PChanges();
    console.log("-".repeat(60));
    console.log("👍 -- 🟢 Existing user : Edit P2P Allocation for single employee Test Passed 🎉 -- ");
    console.log("-".repeat(60));
});
/*--------------------------------------------------------------------------------------*/ 
});// end of test.describe

