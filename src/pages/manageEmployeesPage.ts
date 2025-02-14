import { Page, expect } from 'playwright/test';
import * as helper from "../utils/helper";
import { faker } from '@faker-js/faker';

export class manageEmployeesPage {
    private page: Page;

    public employeeRowClass = 'bg-yoyo-charcoal-lite-1';
    // Locators object with dynamic locator function for channels
    private Locators = {
        optionAdHoc             : () => this.page.getByText('Ad-Hoc RewardOnce-off'),
        optionP2P               : () => this.page.getByRole('button', { name: 'Peer-to-Peer Recognition' }),
        btnContinue             : () => this.page.getByRole('button', { name: 'Continue' }),
        btnAddEmployee          : () => this.page.getByRole('button', { name: 'Add Employees' }),
        selectAllcheckbox       : () => this.page.getByLabel('Select all employees'),
        clearTeamsData          : () => this.page.getByRole('button', { name: 'Clear Teams data!' }),
        btnSyncSlackUsers       : () => this.page.getByRole('button', { name: 'Sync Slack Users' }),
        btnAddMultipleEmployees : () => this.page.getByRole('button', { name: 'Add Multiple Employees' }),
        txtName                 : () => this.page.getByLabel('Name', { exact: true }),
        txtSurname              : () => this.page.getByLabel('Surname'),
        txtEmail                : () => this.page.getByLabel('Email'),
        txtPhoneNumber          : () => this.page.getByLabel('Phone Number (Optional)'),
        txtEmployeeID           : () => this.page.getByLabel('Employee ID Number/Code ('),
        btnBack                 : () => this.page.getByRole('button', { name: 'Back' }),
        btnAdd                  : () => this.page.getByRole('button', { name: 'Add', exact: true }),
        employeeAddedModal      : () => this.page.getByRole('heading', { name: 'Employee Successfully Added!' }),
        employeeUpdatedModal    : () => this.page.getByRole('heading', { name: 'Employee updated successfully' }),
        btnThanks               : () => this.page.getByRole('button', { name: 'Thanks!' }),
        btnEdit                 : () => this.page.getByRole('cell', { name: 'Edit' }),
        btnProcessAdHocRewards  : () => this.page.getByRole('button', { name: 'Process Ad-Hoc Rewards' }),
        toggleIssueSameValue    : () => this.page.locator('div').filter({ hasText: /^Issue the same value to each recipient\?R$/ }).locator('path').first(),
        txtSameRewardAmount     : () => this.page.locator('#sameRewardValue'),
        toggleSendSameMsg       : () => this.page.locator('div').filter({ hasText: /^Send the same message to each recipient\?$/ }).locator('path').first(),
        txtareaRewardsMsg       : () => this.page.getByText('Hi {{name}}, this reward is'),
        btnEditSameMsg          : () => this.page.getByRole('button', { name: 'Edit Message' }).first(),
        textareaEditDefaultMsg  : () => this.page.getByLabel('Write a default message').getByLabel(''),
        btnDone                 : () => this.page.getByRole('button', { name: 'Done' }),
        confirmModalHeader      : () => this.page.getByRole('heading', { name: 'Please confirm your Ad-Hoc' }),
        btnConfirm              : () => this.page.getByRole('button', { name: 'Confirm' }),
        modalAdHocRewardConfirmed   : () => this.page.getByRole('heading', { name: 'Ad-Hoc Reward confirmed!' }),
        employeeRecord          : (employeeFullName: string) => this.page.getByText(employeeFullName, { exact: true }).first(),
        btnUpdate               : () => this.page.getByRole('button', { name: 'Update' }),
        removeEmployeeLink      : () => this.page.getByText('I want to remove this employee'),
        modalRemoveEmployee     : () => this.page.getByRole('heading', { name: 'Are you sure you want to' }),
        btnRemove               : () => this.page.getByRole('button', { name: 'Remove Employee' }),
        modalEmployeeRemoved    : () => this.page.getByRole('heading', { name: 'Employee Successfully Removed' }),
        btnThanksUpdateModal    : () => this.page.getByRole('button', { name: 'Thanks' }),
        txtSearchEmployee       : () => this.page.getByPlaceholder('Search employees')
    }
    constructor(page: Page) 
    {
        this.page = page;
    }
/*******************************************************************************************************************/ 
// Method to select a Reward type and click on Continue
async selectRewardType(rewardType: string): Promise<void> {
    if (rewardType.toLowerCase() === "ad-hoc") 
    {
        await helper.clickElement(this.Locators.optionAdHoc(), "Click on Ad Hoc Rewards");
    } 
    else if (rewardType.toLowerCase() === "peer-to-peer") 
    {
        await helper.clickElement(this.Locators.optionP2P(), "Click on Peer-to-Peer Recognition");
    } 
    else 
    {
        console.error("❌  Invalid reward type! Please use only these values: Ad-Hoc or Peer-to-Peer");
        throw new Error("❌  Test stopped due to incorrect reward type input.");
    }

    // Click on the Continue button after selecting a valid option
    await helper.clickElement(this.Locators.btnContinue(), "Click on Continue");
}
/*******************************************************************************************************************/ 
// Method to add an employee
async addSingleEmployee(): Promise<void> {
    await helper.clickElement(this.Locators.btnAddEmployee(), "Click on Add Employee button");

    const firstName = await helper.generateFakeData("firstName"); // Await here
    const lastName = await helper.generateFakeData("lastName"); // Await here

    if (!firstName || !lastName) 
    {
        throw new Error("❌  Failed to generate fake data for first name and last name.");
    }
    await helper.fillElement(this.Locators.txtName(), firstName, `Enter ${firstName} in the Name textbox`);
    await helper.fillElement(this.Locators.txtSurname(), lastName, `Enter ${lastName} in the Surname textbox`);
    
    const email = await helper.generateRandomEmail();
    // Check if a valid last name was generated
    if (!email) 
    {
        throw new Error('❌  Failed to generate an email');
    }
    await helper.fillElement(this.Locators.txtEmail(), email, `Enter ${email} in the email textbox`);

    const random8DigitNumber = Math.floor(10000000 + Math.random() * 90000000);
    const randomPhoneNum = `7` + random8DigitNumber;

    await helper.fillElement(this.Locators.txtPhoneNumber(), randomPhoneNum, `Enter ${randomPhoneNum} in the Phone number textbox`);
    await helper.clickElement(this.Locators.btnAdd(), "Click on Add button");

    await this.page.waitForTimeout(3000);

    await helper.verifyElementPresent(this.Locators.employeeAddedModal());
    await helper.clickElement(this.Locators.btnThanks(), "Click on Thanks button");
    await this.page.waitForTimeout(3000);

    const newEmployee = (firstName + " " + lastName);
    console.log(`[INFO] ℹ️ Searching for employee : ${newEmployee}`);
    await this.searchEmployee(newEmployee);

    const employeeAdded = this.Locators.employeeRecord(newEmployee);
    
    // Wait for the option to be visible and scroll it into view
    await employeeAdded.waitFor({ state: 'visible' });
    await employeeAdded.scrollIntoViewIfNeeded();
    await expect(employeeAdded).toBeVisible();
    
    console.log(`[INFO] ℹ️  New Employee ${firstName} ${lastName} has been successfully added`);
}
/*******************************************************************************************************************/ 
// Method to add bulk employees
// --> TBD

/*******************************************************************************************************************/ 
// Method to edit employee details (random)
async editEmployeeDetails(): Promise<void> 
{
    const numOfRows = await helper.countTableRowsByClass(this.page, this.employeeRowClass);
    console.log("Number of rows is : " + numOfRows);

    if (numOfRows === 0) 
    {
        console.log(`[INFO] ℹ️ Employee table is empty. Skipping edit operation.`);
        return; // Exit the function if no employees exist
    } else 
    {
        console.log(`[INFO] ℹ️  Total number of employees visible in table : ${numOfRows}`);

        // Generate a random row index
        const randomIndex = Math.floor(Math.random() * numOfRows); 
        console.log(`[INFO] ℹ️  Random row selected is  : ${randomIndex + 1}`);
        // Select a random row and edit the employee details
        const employeeNameLocator   = this.page.locator(`tr:nth-child(${randomIndex + 1}) > td:nth-child(2)`);
        const employeeName          = await employeeNameLocator.textContent();
        console.log(`[INFO] ℹ️  Employee details to be edited for : ${employeeName}`);

        const selectedRow = this.page.locator(`tr:nth-child(${randomIndex + 1}) > td:nth-child(6)`)

        await selectedRow.click(); // Click edit button inside the row
        await this.page.waitForTimeout(2000);

        // Fill in new details (example: updating name)
        const newFirstName = await helper.generateFakeData("firstName");
        const newLastName  = await helper.generateFakeData("lastName");

        if (!newFirstName || !newLastName) 
        {
            throw new Error("❌  Failed to generate fake data for first name and last name.");
        }

        await helper.clearTextbox(this.Locators.txtName(), "Clear FirstName textbox");
        await helper.fillElement(this.Locators.txtName(), newFirstName, `Enter ${newFirstName} in Name textbox`);

        await helper.clearTextbox(this.Locators.txtSurname(), "Clear Surname textbox");
        await helper.fillElement(this.Locators.txtSurname(), newLastName, `Enter ${newLastName} in Surname textbox`);

        await helper.clickElement(this.Locators.btnUpdate(), "Click on Update button");
        await this.page.waitForTimeout(2000);

        await helper.verifyElementPresent(this.Locators.employeeUpdatedModal());
        await helper.clickElement(this.Locators.btnThanksUpdateModal(), "Click on Thanks button");
        await this.page.waitForTimeout(3000);

        const updatedEmployee = (newFirstName + " " + newLastName);
        await this.searchEmployee(updatedEmployee);
        console.log(`[INFO] ℹ️ Searching for employee : ${updatedEmployee}`);
        const employeeUpdated = this.Locators.employeeRecord(updatedEmployee);
        

        // Wait for the option to be visible and scroll it into view
        await employeeUpdated.waitFor({ state: 'visible' });
        await employeeUpdated.scrollIntoViewIfNeeded();
        await expect(employeeUpdated).toBeVisible();
        
        console.log(`[INFO] ℹ️  Employee details have been successfully updated`);
    }
}
/*******************************************************************************************************************/ 
// Method to remove employee (random)
async removeEmployee() : Promise<void>
{
    const numOfRows = await helper.countTableRowsByClass(this.page, this.employeeRowClass);
    if (numOfRows === 0) 
    {
        console.log(`[INFO] ℹ️ Employee table is empty. Skipping edit operation.`);
        return; // Exit the function if no employees exist
    } else 
    {
        console.log(`[INFO] ℹ️ Total number of employees visible in table : ${numOfRows}`);

        // Generate a random row index
        const randomIndex = Math.floor(Math.random() * numOfRows); 

        // Select a random row and edit the employee details
        const employeeNameLocator   = this.page.locator(`tr:nth-child(${randomIndex + 1}) > td:nth-child(2)`);
        const employeeName          = await employeeNameLocator.textContent();
        console.log(`[INFO] Employee to be deleted : ${employeeName}`);

        const selectedRow = this.page.locator(`tr:nth-child(${randomIndex + 1}) > td:nth-child(6)`)

        await selectedRow.click(); // Click edit button inside the row
        await this.page.waitForTimeout(2000);

        await helper.clickElement(this.Locators.removeEmployeeLink(), "Click on link to remove employee");
        await this.page.waitForTimeout(4000);

        await helper.verifyElementPresent(this.Locators.modalRemoveEmployee());
        await helper.clickElement(this.Locators.btnRemove(), "Click on Remove button");
        await this.page.waitForTimeout(2000);
        await helper.verifyElementPresent(this.Locators.modalEmployeeRemoved());
        await helper.clickElement(this.Locators.btnThanks(), "Click on Thanks button");
        await this.page.waitForTimeout(4000);
        console.log(`[INFO] ℹ️ Searching for employee : ${employeeName}`);
        await this.searchEmployee(employeeName ?? "default");
        await expect(this.page.locator(`text=${employeeName}`)).toHaveCount(0);
        console.log(`[INFO] ℹ️ Employee ${employeeName} has been successfully removed`);
    }
}
/*******************************************************************************************************************/ 
// Method to search for employee by names
async searchEmployee(employee : string) : Promise<void>
{
    await helper.fillElement(this.Locators.txtSearchEmployee(), employee, `Search for Employee : ${employee}`);
    await this.page.waitForTimeout(2000);
}
/*******************************************************************************************************************/ 
}
