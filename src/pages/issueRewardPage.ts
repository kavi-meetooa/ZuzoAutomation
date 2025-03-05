import { Page, expect } from 'playwright/test';
import * as helper from "../utils/helper";
import { config } from "../config/config"; 

export class issueRewardPage {
    private page: Page;

    private employeeRowClass = 'bg-yoyo-charcoal-lite-1';
    private selectedEmployeeCount: number = 0;

    // Locators object with dynamic locator function for channels
    private Locators = {
        selectAllcheckbox       : () => this.page.getByLabel('Select all employees'),
        clearTeamsData          : () => this.page.getByRole('button', { name: 'Clear Teams data!' }),
        btnThanks               : () => this.page.getByRole('button', { name: 'Thanks!' }),
        btnProcessAdHocRewards  : () => this.page.getByRole('button', { name: 'Process Ad-Hoc Rewards' }),
        toggleIssueSameValue    : () => this.page.locator('.cursor-pointer.mr-7'),
        txtSameRewardAmount     : () => this.page.locator('#sameRewardValue'),
        toggleSendSameMsg       : () => this.page.locator('.cursor-pointer'),
        txtareaRewardsMsg       : () => this.page.getByText('Hi {{name}}, this reward is'),
        btnEditSameMsg          : () => this.page.getByRole('button', { name: 'Edit Message' }).first(),
        textareaEditDefaultMsg  : () => this.page.getByLabel('Write a default message').getByLabel(''),
        btnDone                 : () => this.page.getByRole('button', { name: 'Done' }),
        confirmModalHeader      : () => this.page.getByRole('heading', { name: 'Please confirm your Ad-Hoc' }),
        btnConfirm              : () => this.page.getByRole('button', { name: 'Confirm' }),
        modalAdHocRewardConfirmed   : () => this.page.getByRole('heading', { name: 'Ad-Hoc Reward confirmed!' }),
        employeeRecord          : (employeeFullName: string) => this.page.getByText(employeeFullName, { exact: true }).first(),
        btnContinue             : () => this.page.getByRole('button', { name: 'Continue' }),
        modalPaymentProcessed   : () => this.page.getByRole('heading', { name: 'Ad-Hoc Reward confirmed!' }),
        btnActivateP2P          : () => this.page.getByRole('button', { name: 'Activate Employees to P2P' })
    }
    constructor(page: Page) 
    {
        this.page = page;
    }
/*-----------------------------------------------------------------------------------------------------------------------*/
// Method to get the selected employee count
getSelectedEmployeeCount(): number 
{
    return this.selectedEmployeeCount;
}
/*-----------------------------------------------------------------------------------------------------------------------*/
// Method to select a single employee
async selectSingleEmployee() : Promise<void>
{
    const numOfRows = await helper.countTableRowsByClass(this.page, this.employeeRowClass);
    console.log("Number of rows is : " + numOfRows);
    
    if (numOfRows === 0) 
    {
        throw new Error(`[ERROR] ❌ Employee table is empty.`);
    } else 
    {
        console.log(`[INFO] ℹ️  Total number of employees visible in table : ${numOfRows}`);

        // Generate a random row index
        const randomIndex = Math.floor(Math.random() * numOfRows); 
        console.log(`[INFO] ℹ️  Random row selected is  : ${randomIndex + 1}`);
        // Select a random row and edit the employee details
        const employeeNameLocator   = this.page.locator(`tr:nth-child(${randomIndex + 1}) > td:nth-child(2)`);
        const employeeEmailLocator  = this.page.locator(`tr:nth-child(${randomIndex + 1}) > td:nth-child(3)`);
        const employeeName          = await employeeNameLocator.textContent();
        const employeeEmail         = await employeeEmailLocator.textContent();

        const employeeCheckbox = this.page.locator(`//tr[${randomIndex + 1}]/td[1]/div/input`);
        await employeeCheckbox.click();
        console.log(`[INFO] ℹ️  Employee selected is : ${employeeName} and email is : ${employeeEmail}`);
        this.selectedEmployeeCount = 1;
    }
}
/*-----------------------------------------------------------------------------------------------------------------------*/
// Method to select all employees
async selectAllEmployees(): Promise<void> {
    await helper.clickElement(this.Locators.selectAllcheckbox(), "Tick Select All employees checkbox");

    const totalEmployeesLocator = this.page.locator('//*[@class="text-yoyo-flint-mint inline"]');
    
    // Scroll into view if needed
    await totalEmployeesLocator.scrollIntoViewIfNeeded();
    
    // Get the text content and convert it to a number
    const totalEmployeesText = await totalEmployeesLocator.textContent();
    const totalEmployees = totalEmployeesText ? parseInt(totalEmployeesText.trim(), 10) : 0;

    console.log(`[INFO] ℹ️  All employees have been selected (${totalEmployees})`);

    // Store the selected employee count in the class variable
    this.selectedEmployeeCount = totalEmployees;
}
/*-----------------------------------------------------------------------------------------------------------------------*/    
// Method to select multiple employees (first N employees as specified by employeeCount) 
async selectMultipleEmployees(employeeCount: number): Promise<void> {
    const numOfRows = await helper.countTableRowsByClass(this.page, this.employeeRowClass);
    console.log(`[INFO] ℹ️  Total number of employees visible in table: ${numOfRows}`);

    // Fail the test if there are not enough employees
    if (numOfRows < employeeCount) {
        throw new Error(`[ERROR] ❌ Not enough employees available. Expected at least ${employeeCount}, but found ${numOfRows}.`);
    }
    // Select the specified number of employees
    for (let index = 1; index <= employeeCount; index++) {
        const checkboxLocator = this.page.locator(`//tr[${index}]/td[1]/div/input`);
        const employeeNameLocator   = this.page.locator(`tr:nth-child(${index}) > td:nth-child(2)`);
        const employeeEmailLocator  = this.page.locator(`tr:nth-child(${index}) > td:nth-child(3)`);
        const employeeName          = await employeeNameLocator.textContent();
        const employeeEmail         = await employeeEmailLocator.textContent();

        await checkboxLocator.check();

        console.log(`[INFO] ℹ️  Selected employee at row ${index}, Name : ${employeeName} and Email : ${employeeEmail}`);
        this.selectedEmployeeCount = employeeCount;
    }
}
/*-----------------------------------------------------------------------------------------------------------------------*/ 
// Method to Process Ad Hoc Rewards
async processAdHocRewards(issuanceType : string) : Promise<void>
{
    await helper.clickElement(this.Locators.btnProcessAdHocRewards(), "Click on Process Ad Hoc Rewards button");

    if (issuanceType.toLowerCase() == "samevalue")
    {
        await this.selectIssuanceValue(25.00);
        await this.editIssuanceMessage();
        await this.confirmIssuanceModal();
        console.log(`[INFO] ℹ️  Issuance send -> Awaiting for card approval`);
    }
    else if (issuanceType.toLowerCase() == "uniquevalue")
    {

    }
}
/*-----------------------------------------------------------------------------------------------------------------------*/ 
// Method to select same value for issuance
async selectIssuanceValue(amount : number) : Promise<void>
{
    await helper.clickElement(this.Locators.toggleIssueSameValue(), "Set toggle to Yes for Issue same value to each recipient");
    await helper.fillElement(this.Locators.txtSameRewardAmount(), amount.toString(), `Enter ${amount} in the amount textbox`);
    
    const employeeCount = this.getSelectedEmployeeCount();

    const totalPayout = "R" + (employeeCount * amount);
    const totalPayoutLocator = this.page.getByText(totalPayout);
    await totalPayoutLocator.scrollIntoViewIfNeeded();
    await helper.verifyElementPresent(totalPayoutLocator);

    await helper.clickElement(this.Locators.btnContinue(), "Click on Continue button");
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async editIssuanceMessage() : Promise<void>
{
    await helper.clickElement(this.Locators.btnEditSameMsg(), "Click on Edit Message button");
    await helper.clearTextbox(this.Locators.textareaEditDefaultMsg(), "Clear default Message");
    await helper.fillElement(this.Locators.textareaEditDefaultMsg(), config.issuanceMessage, "Edit default message");
    await helper.clickElement(this.Locators.btnDone(), "Click on Done button");
    await this.page.waitForTimeout(2000);
    await helper.clickElement(this.Locators.btnContinue(), "Click on Continue button");
    await this.page.waitForTimeout(2000);
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async confirmIssuanceModal() : Promise<void>
{
    await helper.verifyElementPresent(this.Locators.confirmModalHeader());
    await helper.clickElement(this.Locators.btnConfirm(), "Click on Confirm button");
    await this.page.waitForTimeout(2000);
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async confirmPaymentProcessed() : Promise<void>
{
    await this.page.waitForTimeout(2000);
    await helper.verifyElementPresent(this.Locators.modalPaymentProcessed());
    await helper.clickElement(this.Locators.btnThanks(), "Click on Thanks button after processing payment");
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async activateP2P() : Promise<void>
{
    const totalEmployeesLocator = this.page.locator('//*[@class="text-yoyo-flint-mint inline"]');
    // Scroll into view if needed
    await totalEmployeesLocator.scrollIntoViewIfNeeded();
    
    // Get the text content and convert it to a number
    const totalEmployeesText = await totalEmployeesLocator.textContent();
    const totalEmployees = totalEmployeesText ? parseInt(totalEmployeesText.trim(), 10) : 0;

    console.log(`${totalEmployees} have been selected for P2P Activation`);

    await helper.clickElement(this.Locators.btnActivateP2P(), "Click on Activate P2P button");
}
/*-----------------------------------------------------------------------------------------------------------------------*/
}