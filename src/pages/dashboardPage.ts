import { Page } from 'playwright';
import * as helper from "../utils/helper";

export class dashboardPage {
    private page: Page;

    // Locators object with dynamic locator function for channels
    private Locators = {
        rewardsMenu             : () => this.page.getByRole('button', { name: 'Rewards' }),
        createRewards           : () => this.page.locator('//*[@id="headlessui-menu-items-2"]/p[1]'),
        btnLogOut               : () => this.page.locator('//*[@id="logout"]'),
        btnContactUs            : () => this.page.getByRole('button', { name: 'Contact us' }),
        pageHeader              : () => this.page.locator('//p[contains(text(), "Reward Your Team Now")]'),
        optionAdHoc             : () => this.page.getByText('Ad-Hoc RewardOnce-off'),
        optionP2P               : () => this.page.getByText('Peer-to-Peer Recognition', { exact: false }),
        btnContinue             : () => this.page.getByRole('button', { name: 'Continue' }),
        noCardsModalbtnBack     : () => this.page.getByRole('button', { name: 'Back' }),
        noCardsModalbtnAddCard  : () => this.page.getByRole('button', { name: 'Add a Card' }),
        noCardModalbtnClose     : () => this.page.getByLabel('You don’t seem to have a').locator('svg'),
        btnCreateRewards        : () => this.page.getByRole('menuitem', { name: 'Create Rewards' }),
        btnRewardsHistory       : () => this.page.getByRole('menuitem', { name: 'Reward History' }),
        logoutModalHeader       : () => this.page.getByRole('heading', { name: 'Log Out of Zuzo?' }),
        logoutModalText         : () => this.page.getByText('Are you sure you would like'),
        btnCancel               : () => this.page.getByRole('button', { name: 'Cancel' }),
        btnLogOutModal          : () => this.page.getByRole('button', { name: 'Log out' }),
    };

    constructor(page: Page) 
    {
        this.page = page;
    }
/*******************************************************************************************************************/ 
// Assert succesful login/registration by verifying elements on the Dashboard page
async verifyDashboardElements() : Promise <void>
{
    console.log("[INFO] ℹ️  Verifying dashboard elements");
    await this.Locators.rewardsMenu().waitFor({ state: 'visible', timeout: 5000 });
    await helper.verifyElementPresent(this.Locators.rewardsMenu());

    await this.Locators.pageHeader().waitFor({ state: 'visible', timeout: 5000 });
    await helper.verifyElementPresent(this.Locators.pageHeader());

    await this.Locators.optionAdHoc().waitFor({ state: 'visible', timeout: 5000 });
    await helper.verifyElementPresent(this.Locators.optionAdHoc());

    await this.Locators.btnLogOut().waitFor({ state: 'visible', timeout: 5000 });
    await helper.verifyElementPresent(this.Locators.btnLogOut());

    console.log("[INFO] ℹ️  User has been redirected successfully to the Zuzo Dashboard page.");
    console.log("-------------------------");
}
/*******************************************************************************************************************/ 
async logOut() : Promise <void>
{
    await helper.clickElement(this.Locators.btnLogOut(), "Click on Logout button");
    await this.page.waitForTimeout(3000);
    await helper.clickElement(this.Locators.btnLogOutModal(), "Confirm logout in the modal box");
    console.log("[INFO] ℹ️  User has logged out successfully.");
    console.log("-------------------------");
}
/*******************************************************************************************************************/ 
}
