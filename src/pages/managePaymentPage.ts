import { Page, expect } from 'playwright/test';
import * as helper from "../utils/helper";
import messages from "../data/messages";
import { faker } from '@faker-js/faker';
import { config } from "../config/config";
import * as fs from 'fs';
import * as path from 'path';

const dynamicConfigPath = path.join(__dirname, '../config/dynamicConfig.json');

export class paymentPage {
    private page: Page;

    // Locators object with dynamic locator function for channels
    private Locators = {
        btnPaymentMethods       : () => this.page.locator('//*[@id="paymentMethods"]'),
        btnAddNewPaymentMethod  : () => this.page.getByRole('button', { name: 'Add a Payment Method' }),
        txtCardName             : () => this.page.getByLabel('Name on card'),
        txtCardNumber           : () => this.page.getByLabel('Card number'),
        txtExpiryDate           : () => this.page.getByPlaceholder('MM/YY'),
        btnAdd                  : () => this.page.getByRole('button', { name: 'Add' }),
        //////////////////////////////////////////////////////////////////////////////////////////
        noCardMethodHeader      : () => this.page.locator('//*[@class="text-3xl"]'),
        noCardMethodText        : () => this.page.locator('//*[@class="my-8"]'),
        successCardAddedHeader  : () => this.page.getByRole('heading', { name: 'Payment Card Successfully Linked!  ' }),
        btnThanks               : () => this.page.getByRole('button', { name: 'Thanks!' }),
        btnDone                 : () => this.page.getByRole('button', { name: 'Done' }),
        //////////////////////////////////////////////////////////////////////////////////////////
        savedCardCompany        : () => this.page.locator('(//*[@class="mr-auto"])[1]'),
        savedCardName           : () => this.page.locator('//*[@class="text-xs mr-auto"]'),
        savedCardDate           : () => this.page.locator('(//*[contains(@class,"mt-auto")])[1]/p[2]'),
        btnRemoveCard           : () => this.page.getByRole('button', { name: 'Remove' }),
        btnAddBillingInfo       : () => this.page.getByRole('button', { name: 'Add Billing Information' }),
        //////////////////////////////////////////////////////////////////////////////////////////
        txtRegisteredCompany    : () => this.page.getByLabel('Registered Company Name'),
        txtVatNumber            : () => this.page.getByLabel('Vat Number'),
        txtAddressLine1         : () => this.page.getByLabel('Address Line 1'),
        txtAddressLine2         : () => this.page.getByLabel('Address Line 2'),
        txtAddressLine3         : () => this.page.getByLabel('Address Line 3'),
        txtCity                 : () => this.page.getByLabel('City'),
        txtPostalCode           : () => this.page.getByLabel('Postal Code'),
        txtProvince             : () => this.page.getByLabel('Province'),
        txtCountry              : () => this.page.getByLabel('Country'),
        txtBillingEmail         : () => this.page.getByLabel('Billing Email'),
        txtContactNumber        : () => this.page.getByLabel('Billing Contact Number'),
        btnSaveBillingInfo      : () => this.page.getByRole('button', { name: 'Add' }),
        registeredCompSection   : () => this.page.getByText('Registered Company Name'),
        compAddressSection      : () => this.page.getByText('Company Address'),
        billingEmailSection     : () => this.page.getByText('Billing Email'),
        //////////////////////////////////////////////////////////////////////////////////////////
        btnEditBilling          : () => this.page.getByRole('button', { name: 'Edit Billing Information' }),
        btnUpdate               : () => this.page.getByRole('button', { name: 'Update' }),
        /////////////////////////////////////////////////////////////////////////////////////////
        deleteCardModalHeader   : () => this.page.getByRole('heading', { name: 'Delete this credit card?' }),
        btnNeverMindModal       : () => this.page.getByRole('button', { name: 'Never Mind' }),
        btnDeleteCardModal      : () => this.page.getByRole('button', { name: 'Delete Card' }),
    };

    constructor(page: Page) 
    {
        this.page = page;
    }
/*-----------------------------------------------------------------------------------------------------------------------*/
// Navigate to payments page
async navigateToPayments() : Promise<void>
{
    await helper.clickElement(this.Locators.btnPaymentMethods(), "Click on Payment Methods")
    await this.page.waitForTimeout(2000);
    console.log("[INFO] ℹ️  Navigated to Payments Method page.");
}
/*-----------------------------------------------------------------------------------------------------------------------*/
// Verify No payment methods are available
async verifyNoPaymentMethodAvailable(): Promise<boolean> {
    try {
        //check if elements are visible
        const isNoCardMethodHeaderVisible = await this.Locators.noCardMethodHeader().isVisible();
        const isAddNewPaymentMethodButtonVisible = await this.Locators.btnAddNewPaymentMethod().isVisible();

        // If both elements are visible, return true (no payment method available)
        if (isNoCardMethodHeaderVisible && isAddNewPaymentMethodButtonVisible) {
            console.log("[INFO] ℹ️  No payment methods are available.");
            return true;
        } else {
            console.log("[INFO] ℹ️  Payment methods are available.");
            return false;
        }
    } catch (error) {
        // Catch any unexpected errors and log them
        console.log("[ERROR] ❌ Error while verifying payment methods: " + error);
        return false; // If an error occurs, consider that a payment method is available
    }
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async addNewCard() : Promise<void>
{
    // check whether if there is a card or not before adding a new one
    const noPaymentAvailable = await this.verifyNoPaymentMethodAvailable();
    //expect(noPaymentAvailable).toBeTruthy(); // This will fail if `noPaymentAvailable` is false, i.e if there is already a payment method
    
    if (noPaymentAvailable) {
        await helper.clickElement(this.Locators.btnAddNewPaymentMethod(), "Click on Add new Payment");
        await this.page.waitForTimeout(2000);

        const cardName = `${faker.person.firstName()} ${faker.person.lastName()}`;
        // Save cardName in dynamicConfig.json
        const dynamicConfigData = JSON.parse(fs.readFileSync(dynamicConfigPath, 'utf8'));
        dynamicConfigData.savedCardName = cardName;
        // Write the updated data back to dynamicConfig.json without overwriting other fields
        await fs.writeFileSync(dynamicConfigPath, JSON.stringify(dynamicConfigData, null, 4));

        await helper.fillElement(this.Locators.txtCardName(), cardName, `Enter ${cardName} in the Card Name textbox`);
        await helper.fillElement(this.Locators.txtCardNumber(), config.validCard, `Enter the card number : ${config.validCard}`);
        await helper.fillElement(this.Locators.txtExpiryDate(), config.expiryDate, `Enter the card number : ${config.expiryDate}`);
        await helper.clickElement(this.Locators.btnAdd(), "Click on Add button");
        await this.page.waitForTimeout(2000);
        console.log("[INFO] ℹ️  New card details added successfully");

        await this.authoriseCard();
    }
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async authoriseCard() : Promise<void>
{
    await this.page.waitForTimeout(3000);
    const iframe = await this.page.locator('iframe[src*="payment-form"]'); // Locate iframe
    const frame = await iframe.contentFrame(); // Get the frame content

    const btnOkIframeModal = frame.locator('(//*[@class="btn btn-default"])[2]');
    await btnOkIframeModal.click();
    console.log(">> ✅ Test step : PASS - Clicked on Ok on the iframe modal");

    const btnCardPayments = frame.locator('//*[@id="pmCreditcardBtn"]');
    await btnCardPayments.click();
    console.log(">> ✅ Test step : PASS - Click on Cards payment button in iframe");

    // Enter card details
    const txtCvv = frame.locator('//*[@id="ccCvv"]');
    await txtCvv.fill(config.cvv);
    console.log(">> ✅ Test step : PASS - Enter a CVV");

    const btnNext = frame.locator('//*[@id="nextBtn"]');
    await btnNext.click();
    console.log(">> ✅ Test step : PASS - Click on Next button");

    // Submit for authorisation by payment gateway
    const btnSubmit = frame.locator('//*[@class="form-submit-button"]');
    await btnSubmit.click();
    console.log(">> ✅ Test step : PASS - Click on Submit button");
    await this.page.waitForTimeout(5000);
    console.log("[INFO] ℹ️  Card payment has been authorised");
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async verifyCardAddedModals() : Promise<void>
{
    // Assert presence of modal for successful card addition
    const successHeader = this.Locators.successCardAddedHeader(); 
    await successHeader.waitFor({ state: 'visible', timeout: 60000 }); 
    console.log("[INFO] ℹ️  Success modal is displayed");

    // Optionally, you can also assert the text content of the modal header if needed
    await expect(successHeader).toHaveText('Payment Card Successfully Linked!  ');
    console.log("[INFO] ℹ️  Success modal text verified");

    await helper.clickElement(this.Locators.btnThanks(), "Click on Thanks button");
    await helper.clickElement(this.Locators.btnDone(), "Click on Done button");
    console.log("[INFO] ℹ️  Card has been authorised and new payment method has been successfully added");
}

/*-----------------------------------------------------------------------------------------------------------------------*/
async deletecard() : Promise<void>
{
    await this.navigateToPayments();

    // check whether if there is a card or not before deleting
    const noPaymentAvailable = await this.verifyNoPaymentMethodAvailable();
    //expect(noPaymentAvailable).toBeFalsy(); // This will fail if `noPaymentAvailable` is true

    if (!noPaymentAvailable) 
    {
        await helper.clickElement(this.Locators.btnRemoveCard(), "Click on Remove card button");
        // Assert confirmation modal is displayed for card deletion
        await helper.verifyElementPresent(this.Locators.deleteCardModalHeader());
        // Click on Delete card
        await helper.clickElement(this.Locators.btnDeleteCardModal(), "Click on Delete Card in the modal");
        await this.page.waitForTimeout(5000);
        //Assert presence of Add a payment method button when card has been deleted
        await this.verifyNoPaymentMethodAvailable();
        console.log("[INFO] ℹ️  Payment method has been successfully deleted");
    }
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async addBillingInfo(): Promise<void> {
    
    const cityToProvinceMap = {
        "Johannesburg": "Gauteng",
        "Cape Town": "Western Cape",
        "Durban": "KwaZulu-Natal",
        "Pretoria": "Gauteng",
        "Port Elizabeth": "Eastern Cape",
        "East London": "Eastern Cape",
        "Polokwane": "Limpopo",
        "Bloemfontein": "Free State",
        "Nelspruit": "Mpumalanga",
        "Kimberley": "Northern Cape",
        "Pietermaritzburg": "KwaZulu-Natal",
        "Mbombela": "Mpumalanga",
        "George": "Western Cape",
        "Boksburg": "Gauteng",
        "Mthatha": "Eastern Cape"
    };
    await this.navigateToPayments();

    const billingInfoAvailable = await this.verifyAvailableBillingInfo();
    // Assert that billingInfoAvailable is false
    //expect(billingInfoAvailable).toBeFalsy(); 

    // Proceed if no billing info is available
    if(!billingInfoAvailable)
    {
        const southAfricanCities = Object.keys(cityToProvinceMap) as (keyof typeof cityToProvinceMap)[];
        await helper.clickElement(this.Locators.btnAddBillingInfo(), "Click on Add Billing Info");

        // Use faker to generate dummy test data
        let companyName = faker.company.name();
        // Split the company name into words, remove special characters, and join with one space
        companyName = companyName
                    .split(' ')               // Split the name into words
                    .map(word => word.replace(/[^a-zA-Z0-9]/g, ''))  // Remove special characters from each word
                    .filter(word => word.length > 0)  // Remove any empty words (in case of extra spaces)
                    .join(' ');               // Join the words with exactly one space

        await helper.fillElement(this.Locators.txtRegisteredCompany(), companyName, "Enter a registered company name");

        const vatNumber = `4${faker.string.numeric(9)}`;
        await helper.fillElement(this.Locators.txtVatNumber(), vatNumber, "Enter a VAT number");

        await helper.fillElement(this.Locators.txtAddressLine1(), faker.location.streetAddress(), "Enter Address Line 1");
        await helper.fillElement(this.Locators.txtAddressLine2(), faker.location.secondaryAddress(), "Enter Address Line 2");

        // Randomly select a South African city
        const selectedCity = faker.helpers.arrayElement(southAfricanCities);
        await helper.fillElement(this.Locators.txtCity(), selectedCity, "Enter a City");
        await helper.fillElement(this.Locators.txtPostalCode(), faker.location.zipCode(), "Enter a Postal code");

        // Get the corresponding province for the selected city
        const province = cityToProvinceMap[selectedCity];

        // Fill the province field with the actual province, not the city name
        await helper.fillElement(this.Locators.txtProvince(), province, "Enter a Province");

        await helper.fillElement(this.Locators.txtCountry(), "South Africa", "Enter a country");
        await helper.fillElement(this.Locators.txtBillingEmail(), config.credentials.email, "Enter a billing email");
        
        const random8DigitNumber = Math.floor(10000000 + Math.random() * 90000000);
        const randomPhoneNum = `7` + random8DigitNumber;

        await helper.fillElement(this.Locators.txtContactNumber(), randomPhoneNum, "Enter a contact number");

        await helper.clickElement(this.Locators.btnSaveBillingInfo(), "Click on Add button");
        await this.page.waitForTimeout(2000);

        // Assert billing details have been saved and are present
        await helper.verifyElementPresent(this.Locators.registeredCompSection());
        await helper.verifyElementPresent(this.Locators.compAddressSection());
        await helper.verifyElementPresent(this.Locators.billingEmailSection());
        console.log("[INFO] ℹ️  Billing Information added successfully");
    }

    
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async verifyCardDetails(): Promise<void> {
    let company: string, cardName: string;
    await this.page.reload();

    // Wait for the card to be visible after reload
    await helper.verifyElementPresent(this.Locators.savedCardCompany());
    await helper.verifyElementPresent(this.Locators.savedCardName());
    await helper.verifyElementPresent(this.Locators.savedCardDate());

    // Check if there is a card available, otherwise fail the test
    const noPaymentAvailable = await this.verifyNoPaymentMethodAvailable();
    expect(noPaymentAvailable).toBeFalsy(); // This will fail if `noPaymentAvailable` is true

    if (!noPaymentAvailable) 
    {
        // Get the text (Company name, name, expiryDate) from the displayed card
        const companyText = await this.Locators.savedCardCompany().textContent();
        const nameText = await this.Locators.savedCardName().textContent();
        const expiryText = await this.Locators.savedCardDate().textContent();

        // Ensure text content is not null or empty
        if (!companyText || !nameText || !expiryText) {
            console.log("[ERROR] Some card details are missing or not visible.");
            return;
        }

        // Fetch data from dynamicConfig.json file
        const configData = JSON.parse(fs.readFileSync(dynamicConfigPath, 'utf8'));
        company = configData.registeredCompany;
        cardName = configData.savedCardName || ''; 

        // Assert if correct text is displayed by comparing with actual data entered and saved in config
        expect(company).toBe(companyText);
        console.log(`[INFO] ℹ️  Company Name is correctly displayed on the card: ${companyText}`);

        expect(config.expiryDate).toBe(expiryText);
        console.log(`[INFO] ℹ️  Expiry Date is correctly displayed on the card: ${expiryText}`);

        expect(cardName).toBe(nameText);
        console.log(`[INFO] ℹ️  Name is correctly displayed on the card: ${nameText}`);

        console.log("[INFO] ℹ️  Card details verified successfully");
    }
}
/*-----------------------------------------------------------------------------------------------------------------------*/
// Verify if billing information is available
async verifyAvailableBillingInfo(): Promise<boolean> 
{
    const editBillingBtnVisible = await this.Locators.btnEditBilling().isVisible();
    if (editBillingBtnVisible) 
    {
        console.log("[INFO] ℹ️ Billing information for the user is available.");
        return true;
    } else 
    {
        console.log("[INFO] ℹ️ There are no existing billing information for the user to edit.");
        return false;
    }
}
/*-----------------------------------------------------------------------------------------------------------------------*/
// Edit billing information if available
async editBillingInfo(): Promise<void> 
{
    const billingInfoAvailable = await this.verifyAvailableBillingInfo();
    // Assert that billingInfoAvailable is truthy
    //expect(billingInfoAvailable).toBeTruthy(); 

    if(billingInfoAvailable)
    {
       await helper.clickElement(this.Locators.btnEditBilling(), "Click on Edit Billing button");
        // Edit Address Line 1
        await helper.clearTextbox(this.Locators.txtAddressLine1(), "Clear Address Line 1");
        await helper.fillElement(this.Locators.txtAddressLine1(), faker.location.streetAddress(), "Edit Address Line 1");

        // Edit Zip Code
        await helper.clearTextbox(this.Locators.txtPostalCode(), "Clear Postal Code");
        await helper.fillElement(this.Locators.txtPostalCode(), faker.location.zipCode(), "Edit a Postal code");

        // Edit phone number
        await helper.clearTextbox(this.Locators.txtContactNumber(), "Clear Contact Number");
        await helper.fillElement(this.Locators.txtContactNumber(), faker.phone.number(), "Edit a contact number");
        await helper.clickElement(this.Locators.btnUpdate(), "Click on Update button");
        await this.page.waitForTimeout(3000);
    
        // Assert billing details have been saved and are present
        await helper.verifyElementPresent(this.Locators.registeredCompSection());
        console.log("[INFO] ℹ️  Billing Information modified successfully");
    }
}
/*-----------------------------------------------------------------------------------------------------------------------*/
}