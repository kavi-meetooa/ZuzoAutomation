import { Page } from 'playwright';
import * as helper from "../utils/helper";
import { config } from "../config/config";

export class p2pPage {
    private page: Page;

    // Locators object with dynamic locator function for channels
    private Locators = {
        btnP2P                  : () => this.page.getByRole('button', { name: 'Peer-to-Peer Recognition' }),
        btnContinue             : () => this.page.getByRole('button', { name: 'Continue' }),
        btnActivateP2P          : () => this.page.getByRole('button', { name: 'Activate Employees to P2P' }),
        pageHeader              : () => this.page.getByText('Peer-to-Peer Recognition'),
        btnStart                : () => this.page.getByRole('button', { name: 'Let\'s Start!' }),
        inputPointAmt           : () => this.page.locator('//*[@id="pointAmount"]'),
        inputCompanyValue       : () => this.page.getByPlaceholder('Add value'),
        btnSubmit               : () => this.page.getByRole('button', { name: 'Submit' }),
        modalHeader             : () => this.page.getByRole('heading', { name: 'You are adding users to your' }),
        btnConfirm              : () => this.page.getByRole('button', { name: 'Confirm' }),
        confirmationModalHeader : () => this.page.getByText('Peer-to-peer Recognition confirmed! '),
        btnThanks               : () => this.page.getByRole('button', { name: ' Thanks!' }),    
        btnEditAllocation       : () => this.page.locator('label[for="selectAllEmployees"]:has-text("Edit Allocation")'),
        p2pCheckmark            : () => this.page.locator('//table//*[@stroke-linecap="square"]').first(),
        p2pCrossmark            : () => this.page.locator('//table//*[@stroke-linecap="square"]').first()

    };

    constructor(page: Page) {
        this.page = page;
    }
/*-----------------------------------------------------------------------------------------------------------------------*/
async navigatetoP2Ppage()
{
    await helper.clickElement(this.Locators.btnP2P(), "Click on Peer to Peer Recognotion");
    await helper.clickElement(this.Locators.btnContinue(), "Click on Continue button");
    await this.page.waitForTimeout(2000);
    console.log("[INFO] ℹ️  Navigated to Peer to Peer Recognition page.");
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async activateP2P(amount : string, companyValue : string)
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
async verifyP2PNotEnabled()
{
    await helper.verifyElementPresent(this.Locators.p2pCrossmark());
    console.log("[INFO] ℹ️  P2P is not activated yet for the employees - Red cross mark displayed");
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async verifyP2PEnabled()
{
    await helper.verifyElementPresent(this.Locators.p2pCheckmark());
    console.log("[INFO] ℹ️  P2P has been activated yet for the employees - Green check mark displayed");
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async confirmP2PEnabled()
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
}