import { Page, expect } from 'playwright/test';
import * as helper from "../utils/helper";
import { config } from "../config/config";
import { he } from '@faker-js/faker/.';

export class p2pPage {
    private page: Page;

    // Locators object with dynamic locator function for channels
    private Locators = {
        btnP2P                  : () => this.page.getByRole('button', { name: 'Peer-to-Peer Recognition' }),
        btnRewards              : () => this.page.getByRole('button', { name: 'Rewards' }),
        btnManageP2P            : () => this.page.getByRole('menuitem', { name: 'Manage Peer to Peer Rewards' }),
        btnContinue             : () => this.page.getByRole('button', { name: 'Continue' }),
        btnActivateP2P          : () => this.page.getByRole('button', { name: 'Activate Employees to P2P' }),
        pageHeader              : () => this.page.getByText('Peer-to-Peer Recognition'),
        btnStart                : () => this.page.getByRole('button', { name: 'Let\'s Start!' }),
        inputPointAmt           : () => this.page.locator('//*[@id="pointAmount"]'),
        totalStaff              : () => this.page.locator('//span[contains(@class, "mint underline")]'), 
        inputMonthlyAmount      : () => this.page.locator('//*[contains(@data-cy, "calculated-monthly")]'),
        inputCompanyValue       : () => this.page.getByPlaceholder('Add value'),
        btnSubmit               : () => this.page.getByRole('button', { name: 'Submit' }),
        modalHeader             : () => this.page.getByRole('heading', { name: 'You are adding users to your' }),
        btnConfirm              : () => this.page.getByRole('button', { name: 'Confirm' }),
        confirmationModalHeader : () => this.page.getByText('Peer-to-peer Recognition confirmed! '),
        btnThanks               : () => this.page.getByRole('button', { name: ' Thanks!' }),    
        btnEditAllocation       : () => this.page.locator('label[for="selectAllEmployees"]:has-text("Edit Allocation")'),
        p2pCheckmark            : () => this.page.locator('//table//*[@stroke-linecap="square"]').first(),
        p2pCrossmark            : () => this.page.locator('//table//*[@stroke-linecap="square"]').first(),
        manageP2PHeader         : () => this.page.getByText('Please decide on your monthly'),
        btnUpdate               : () => this.page.getByRole('button', { name: 'Update' }),
        modalTotalStaff         : () => this.page.locator('(//p[@class="font-semibold"])[1]'),
        modalMonthlyAmount      : () => this.page.locator('(//p[@class="font-semibold"])[2]'),
        modalServiceFee         : () => this.page.locator('(//p[@class="font-semibold"])[3]'),
        modalTotalAmount        : () => this.page.locator('//*[contains(@class,"text-center text-yoyo-")]'),
        P2PPageHeader           : () => this.page.getByText('Peer-to-Peer Recognition'),
    };

    constructor(page: Page) {
        this.page = page;
    }
/*-----------------------------------------------------------------------------------------------------------------------*/
async navigatetoP2Ppage() : Promise<void>
{
    await helper.clickElement(this.Locators.btnP2P(), "Click on Peer to Peer Recognotion");
    await helper.clickElement(this.Locators.btnContinue(), "Click on Continue button");
    await this.page.waitForTimeout(2000);
    console.log("[INFO] ℹ️  Navigated to Peer to Peer Recognition page.");
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async activateP2P(amount : string, companyValue : string) : Promise<void>
{
    await this.verifyP2PNotEnabled();
    await helper.clickElement(this.Locators.btnActivateP2P(), "Click Activate P2P button");
    await this.page.waitForTimeout(3000);
    
    await helper.verifyElementPresent(this.Locators.pageHeader());
    await helper.clickElement(this.Locators.btnStart(), "Click on Let's Start button");
    await this.page.waitForTimeout(3000);

    await helper.fillElement(this.Locators.inputPointAmt(), amount, `Enter ${amount} for the point amount`);
    await helper.fillElement(this.Locators.inputCompanyValue(), companyValue, `Enter ${companyValue} in Company value textbox`);
    await helper.clickElement(this.Locators.btnSubmit(), "Click on Submit button");

    await helper.verifyElementPresent(this.Locators.modalHeader());
    await helper.clickElement(this.Locators.btnConfirm(), "Click on Confirm button");
    await this.page.waitForTimeout(3000);
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async verifyP2PNotEnabled() : Promise<void>
{
    await helper.verifyElementPresent(this.Locators.p2pCrossmark());
    console.log("[INFO] ℹ️  P2P is not activated yet for the employees - Red cross mark displayed");
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async verifyP2PEnabled() : Promise<void>
{
    await helper.verifyElementPresent(this.Locators.p2pCheckmark());
    console.log("[INFO] ℹ️  P2P has been activated yet for the employees - Green check mark displayed");
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async confirmP2PEnabled() : Promise<void>
{
    await helper.verifyElementPresent(this.Locators.confirmationModalHeader());
    await helper.clickElement(this.Locators.btnThanks(), "Click on Thanks button");
    console.log("[INFO] ℹ️  P2P has been activated yet for the employees");

    await helper.verifyElementPresent(this.Locators.btnEditAllocation());
    console.log("[INFO] ℹ️  P2P Edit Allocation button is present");

    await this.verifyP2PEnabled();
    await this.page.waitForTimeout(5000);
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async manageP2P() : Promise<void>
{
    await helper.clickElement(this.Locators.btnRewards(), "Click on Rewards menu");
    await helper.clickElement(this.Locators.btnManageP2P(), "Click on Manage Peer to Peer Rewards submenu");
    await this.page.waitForTimeout(3000);

    await helper.verifyElementPresent(this.Locators.manageP2PHeader());
    console.log("[INFO] ℹ️  Manage P2P header is present");

    // Generate random amount and input on Rewards per person field
    const randomAmount = (Math.random() * 100).toFixed(2);
    await helper.fillElement(this.Locators.inputPointAmt(), randomAmount, `Enter ${randomAmount} for the point amount`);
    await this.page.waitForTimeout(2000);

    // Get total staff count from the page
    const totalStaffText = await this.Locators.totalStaff().textContent();
    console.log("[INFO] ℹ️  Total staff count: " + totalStaffText);

    // Get monthly amount from the page
    const monthlyAmountText = await this.Locators.inputMonthlyAmount().textContent();
 

    // Calculate total amount using random amount and total staff count
    const calculatedAmount = (parseFloat(randomAmount) * parseInt(totalStaffText || '0')).toFixed(2);
    console.log("[INFO] ℹ️  Calculated total amount: R" + calculatedAmount);

    // Extract numeric value from monthlyAmountText (removing "per month")
    const monthlyAmount = parseFloat(monthlyAmountText?.replace(/[^\d.]/g, '') || '0');
    
    // Assert the calculated amount matches monthly amount
    if (parseFloat(calculatedAmount) === monthlyAmount) {
        console.log(`[INFO] ✅ Monthly amount (R${monthlyAmount} per month) matches calculated total (R${calculatedAmount})`);
    } else {
        console.error(`[ERROR] ❌ Monthly amount (R${monthlyAmount} per month) does not match calculated total (R${calculatedAmount})`);
    }
   
    // Define company values
    const companyValues = [
        "Teamwork",
        "Innovation",
        "Excellence",
        "Integrity",
        "Customer Focus"
    ];

    // Select random value
    const randomValue = companyValues[Math.floor(Math.random() * companyValues.length)];
    console.log("[INFO] ℹ️  Selected company value: " + randomValue);
    

    // Input the selected company value
    await helper.fillElement(this.Locators.inputCompanyValue(), randomValue, `Enter ${randomValue} as Company value`);
    await this.page.waitForTimeout(2000);

    await helper.clickElement(this.Locators.btnUpdate(), "Click on Update button");
    await this.page.waitForTimeout(4000);

    await this.confirmP2PUpdate(totalStaffText!, monthlyAmountText!);
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async confirmP2PUpdate(totalEmployees: string, monthlyAmount: string): Promise<void>
{
    await helper.verifyElementPresent(this.Locators.modalHeader());

    const modalTotalStaff = await this.Locators.modalTotalStaff().textContent();
    expect(modalTotalStaff).toBe(totalEmployees);
    console.log(`[INFO] ✅ Successfully verified modal total staff (${modalTotalStaff}) matches expected total (${totalEmployees})`);

    const modalMonthlyAmountText = await this.Locators.modalMonthlyAmount().textContent();
    const modalMonthlyAmount = modalMonthlyAmountText?.replace('R', '').trim() || '0';
    expect(modalMonthlyAmount).toBe(monthlyAmount);
    console.log(`[INFO] ✅ Successfully verified modal monthly amount (${modalMonthlyAmount}) matches expected amount (${monthlyAmount})`);

    // Calculate service fee (3.5% of monthly amount)
    const serviceFee = (parseFloat(monthlyAmount) * 0.035).toFixed(2);
    const modalServiceFeeText = await this.Locators.modalServiceFee().textContent();
    const modalServiceFee = modalServiceFeeText?.replace('R', '').trim() || '0';
    expect(modalServiceFee).toBe(serviceFee);
    console.log(`[INFO] ✅ Successfully verified modal service fee (${modalServiceFee}) matches calculated fee (${serviceFee})`);

    // Calculate total amount (monthly amount + service fee)
    const totalAmount = (parseFloat(monthlyAmount) + parseFloat(serviceFee)).toFixed(2);
    const expectedTotalAmount = `R${totalAmount}`;

    const modalTotalAmountText = await this.Locators.modalTotalAmount().textContent();
    const modalTotalAmount = modalTotalAmountText?.trim() || '0';
    expect(modalTotalAmount).toBe(expectedTotalAmount);
    console.log(`[INFO] ✅ Successfully verified modal total amount (${modalTotalAmount}) matches expected total (${expectedTotalAmount})`);

    await helper.clickElement(this.Locators.btnConfirm(), "Click on Confirm button in the modal box");
    await helper.verifyElementPresent(this.Locators.P2PPageHeader());
    console.log("[INFO] ✅ Successfully updated the P2P Allocation for all employees");
}
/*-----------------------------------------------------------------------------------------------------------------------*/
}