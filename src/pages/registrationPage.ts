import { Page } from 'playwright';
import * as helper from "../utils/helper";
import messages from "../data/messages";
import { config } from "../config/config";
import { faker } from '@faker-js/faker';

export class registrationPage {
    private page: Page;

    // Locators object with dynamic locator function for channels
    private Locators = {
        pageHaeder              : () => this.page.getByText('Account Creation'),
        txtFirstName            : () => this.page.getByLabel('First Name'),
        txtLastName             : () => this.page.getByLabel('Last Name'),
        txtCompanyEmail         : () => this.page.getByLabel('Company Email'),
        txtCompanyName          : () => this.page.getByLabel('Company Name'),
        selectCountry           : () => this.page.getByRole('button', { name: 'Select a country' }),
        selectIndustry          : () => this.page.getByRole('button', { name: 'Choose an industry' }),
        industryOptions         : (industryOption: string) => this.page.getByText(industryOption, { exact: true }).first(),
        selectNumofEmployees    : () => this.page.getByRole('button', { name: 'Choose an amount' }),
        employeesOptions        : (employeeOption: string) => this.page.getByText(employeeOption, { exact: true }).first(),
        selectIntegrationTool   : () => this.page.getByRole('button', { name: 'Choose your integration tool' }),
        toolOptions             : (toolOption: string) => this.page.getByText(toolOption, { exact: true }).first(),
        checkboxTandC           : () => this.page.getByLabel('I agree to the Terms &'),
        btnSubmit               : () => this.page.getByRole('button', { name: 'Submit' }),
    };

    constructor(page: Page) {
        this.page = page;
    }
/*-----------------------------------------------------------------------------------------------------------------------*/
// Navigate to registration page
async navigateToRegistration() : Promise<void>
{
    await this.page.goto(config.registrationUrl);
    console.log("[INFO] ℹ️  Successfully navigated to Registration page");
}
/*-----------------------------------------------------------------------------------------------------------------------*/
// Enter First Name
async enterFirstName() : Promise<void>
{
    const firstName = faker.name.firstName();
    await helper.fillElement(this.Locators.txtFirstName(), firstName, `Enter ${firstName} in the First Name textbox`);
}
/*-----------------------------------------------------------------------------------------------------------------------*/
// Enter Last Name
async enterLastName() : Promise<void>
{
    const lastName = faker.name.lastName()
    await helper.fillElement(this.Locators.txtLastName(), lastName, `Enter ${lastName} in the Last Name textbox`);
}
/*-----------------------------------------------------------------------------------------------------------------------*/
// Enter Company Name
async enterCompanyName() : Promise<string>
{
    const companyName = faker.company.name();
    await helper.fillElement(this.Locators.txtCompanyName(), companyName, `Enter ${companyName} in the Company name textbox`);
    return companyName;
}
/*-----------------------------------------------------------------------------------------------------------------------*/
// Enter company email
async enterEmail() : Promise<string>
{
    const email = await helper.generateRandomEmail();
                    // Check if a valid last name was generated
                    if (!email) {
                        throw new Error('❌ Failed to generate an email');
                      }
    const emailTextbox = this.Locators.txtCompanyEmail();
    await emailTextbox.waitFor({ state: 'visible' }); 
    await helper.fillElement(emailTextbox, email, `Enter ${email} in Company Email field`);
    return email;
}
/*-----------------------------------------------------------------------------------------------------------------------*/
// Select a country
async selectCountry() : Promise<void>
{
    // Zuzo only availble in SA
    await helper.selectDropdownOption(this.Locators.selectCountry, "South Africa", this.page);
}
/*-----------------------------------------------------------------------------------------------------------------------*/
// Select an Industry (some options are : Manufacturing, Retail, Technology, Finance & Banking, Professional Services)
async selectIndustry() : Promise<void>
{
    const industries = [
        'Manufacturing',
        'Retail',
        'Technology',
        'Finance & Banking',
        'Professional Services'
    ];
    // Randomly select an industry from the list
    const randomIndustry = industries[Math.floor(Math.random() * industries.length)];

    // Click to open the industry dropdown
    await helper.clickElement(this.Locators.selectIndustry(), 'Click on Industry dropdown');

    const industryOption = this.Locators.industryOptions(randomIndustry);
    
    // Wait for the option to be visible and scroll it into view
    await industryOption.waitFor({ state: 'visible' });
    await industryOption.scrollIntoViewIfNeeded(); // Ensure the option is in view

    // Select the option from the dropdown
    await helper.clickElement(industryOption, `Select Industry : ${randomIndustry} from the dropdown`);
}
/*-----------------------------------------------------------------------------------------------------------------------*/
async selectNumofEmployees() : Promise<void>
{
    const numOfEmployees = [
        '1-20',
        '20-50',
        '50-100',
        '100-500',
        '500+'
    ]
    const randomNumEmployees = numOfEmployees[Math.floor(Math.random() * numOfEmployees.length)];
    // Click to open the Employees dropdown
    await helper.clickElement(this.Locators.selectNumofEmployees(), 'Click on Number of Employees dropdown');

    const employeeOption = this.Locators.employeesOptions(randomNumEmployees);
    
    // Wait for the option to be visible and scroll it into view
    await employeeOption.waitFor({ state: 'visible' });
    await employeeOption.scrollIntoViewIfNeeded(); // Ensure the option is in view

    // Select the option from the dropdown
    await helper.clickElement(employeeOption, `Select Number of Employees : ${randomNumEmployees} from the dropdown`);
}
/*-----------------------------------------------------------------------------------------------------------------------*/
// Select Integration Tool (Slack or Teams)
async selectIntegrationTool(tool : string) : Promise<void>
{
      // Click to open the integration tool dropdown
      await helper.clickElement(this.Locators.selectIntegrationTool(), 'Click Integration tool dropdown');

      const toolOption = this.Locators.toolOptions(tool);
      
      // Wait for the option to be visible and scroll it into view
      await toolOption.waitFor({ state: 'visible' });
      await toolOption.scrollIntoViewIfNeeded(); // Ensure the option is in view
  
      // Select the  option from the dropdown
      await helper.clickElement(toolOption, `Select Integration tool ${tool} from the dropdown`);
}
/*-----------------------------------------------------------------------------------------------------------------------*/
// Check options for Terms and Conditions
async checkTandC() : Promise<void>
{
   await helper.clickElement(this.Locators.checkboxTandC(), 'Tick Terms and Conditions checkbox')
}
/*-----------------------------------------------------------------------------------------------------------------------*/
// Click on Submit button
async clicksubmit() : Promise<void>
{
    await helper.clickElement(this.Locators.btnSubmit(), 'Click Submit button');
}
/*-----------------------------------------------------------------------------------------------------------------------*/
}