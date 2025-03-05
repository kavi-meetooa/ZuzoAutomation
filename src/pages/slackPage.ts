import { Page } from 'playwright';
import * as helper from "../utils/helper";
import { config } from '../config/config';
import axios from 'axios'
import * as fs from 'fs';
import * as path from 'path';
import { faker } from '@faker-js/faker';

const dynamicConfigPath = path.join(__dirname, '../config/dynamicConfig.json');

export class slackPage {
    private page: Page;

    // Locators object with dynamic locator function for channels
    private Locators = {
        btnSyncSlack            : () => this.page.getByRole('button', { name: 'Sync Slack Users' }),
        headerSyncSlackModal    : () => this.page.getByRole('heading', { name: 'Sync Slack Users -' }),
        btnContinue             : () => this.page.getByRole('button', { name: 'Continue' }),
        //////////////////////////////////////////////////////////////////////////////////
        createNewWorkspaceLink  : () => this.page.getByRole('link', { name: 'Create a new workspace' }),
        txtSlackEmail           : () => this.page.getByPlaceholder('name@work-email.com'),
        btnContinueSlack        : () => this.page.getByLabel('Continue'),
        headerSlackCode         : () => this.page.getByRole('heading', { name: 'Check your email for a code' }),
        txtSlackCompanyName     : () => this.page.getByPlaceholder('Ex: Acme Marketing or Acme Co'),
        txtSlackFullName        : () => this.page.getByPlaceholder('Enter your full name'),
        btnSlackNextStep        : () => this.page.getByLabel('Go to next step'),
        slackSkipStep           : () => this.page.getByRole('button', { name: 'Skip this step' }),
        btnSlackSkipStep        : () => this.page.getByLabel('Skip Step'),
        btnLimitedVersion       : () => this.page.getByLabel('Start with the Limited Free'),
        txtSlackProject         : () => this.page.getByPlaceholder('Ex: Q4 budget, autumn campaign'),
        newSlackChannel         : () => this.page.getByRole('treeitem', { name: 'zuzo-rewards' }).locator('div').first(),
        btnSwitchWorkspace      : () => this.page.getByLabel('Switch workspaces'),
        workspaceLocator        : () => this.page.locator('//*[@class="p-account_switcher__row_team"]/div[2]'),
        addCoWorkerInput        : () => this.page.getByLabel('Add coworker by email - Enter'),
        btnSlackNext            : () => this.page.getByLabel('Next'),
        syncSlackModalHeader    : () => this.page.getByRole('heading', { name: 'Sync Slack Users -' }),
        syncUserChannelDropdown : () => this.page.getByPlaceholder('Search for a channel...'),
        syncUsersChannelOption  : () => this.page.getByText('zuzo-rewards-'),
        btnAllow                : () => this.page.getByLabel('Allow'),
        p2pModalHeader          : () => this.page.getByRole('heading', { name: 'Peer-to-Peer Recognition' }),
        btnThanks               : () => this.page.getByRole('button', { name: 'Thanks!' }),
        slacktxtAdminName       : () => this.page.getByPlaceholder('Enter your full name'),
        btnAddChannel           : () => this.page.getByRole('button', { name: 'Add channels' }),
        btnCreateChannel        : () => this.page.getByRole('menuitem', { name: 'Create a new channel' }),
        btnSubMenuCreateChannel : () => this.page.getByRole('menuitem', { name: 'Create channel' }),
        btnNext                 : () => this.page.getByLabel('Next'),
        txtChannelName          : () => this.page.getByPlaceholder('e.g. plan-budget'),
        btnCreate               : () => this.page.getByLabel('Create', { exact: true }),
        radioBtnAddSpecific     : () => this.page.getByLabel('Add specific people', { exact: true }),
        btnSkipForNow           : () => this.page.getByRole('button', { name: 'Skip for now' }),
        channelDropdowm         : () => this.page.getByPlaceholder('Search for a channel...'),
        btnAllowPermission      : () => this.page.getByLabel('Allow'),
        btnCloseSlackHelp       : () => this.page.getByLabel(/^Meet #.*-channel, your team$/).getByLabel('Close'),
        slackUserLocator        : () => this.page.getByRole('cell', { name: 'automationuser Slack' }).first(),
    };

    constructor(page: Page) 
    {
        this.page = page;
    }
/*******************************************************************************************************************/ 
// Retrieve Slack Code from email
async retrieveEmail(emailSubject: string): Promise<string> {
    // Constants for Microsoft Graph API
    const GRAPH_API_BASE_URL = config.graphApiBaseUrl;
    const TENANT_ID = process.env.TENANT_ID;
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
  
    // Ensure environment variables are defined
    if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
      throw new Error('>> ❌ Missing required environment variables');
    }
    else
    {
      console.info('[INFO] ℹ️ Client ID is : ' + CLIENT_ID);
      console.info('[INFO] ℹ️ Environment variables have been loaded successfully');
    }
  
    const EMAIL_SUBJECT = emailSubject;
    const TARGET_EMAIL = config.credentials.email;
  
    // Step 1:  Fetch the access token using OAuth 2.0 Client Credentials Flow
    const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
  
    let accessToken: string;
  
    try {
      console.log('[INFO] ℹ️ Fetching the access Token using OAuth 2.0 Client Credentials Flow');
      const apiResponse = await axios.post(
        tokenUrl,
        new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          scope: config.scope,
          grant_type: 'client_credentials',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      if (apiResponse.status === 200 && apiResponse.data.access_token) {
        accessToken = apiResponse.data.access_token;
        console.log("[INFO] ℹ️ Access token has been retrieved");
      } else {
        throw new Error('>> ❌ Failed to fetch access token');
      }
    } catch (error) {
      console.error('❌ Error fetching access token:', error);
      throw new Error('❌ Failed to fetch access token');
    }
  
    // Step 2: Fetch the user's inbox messages
    console.log("[INFO] ℹ️ Fetching email from user's inbox");
    console.log("[INFO] ℹ️ Endpoint : " + `${GRAPH_API_BASE_URL}/users/${TARGET_EMAIL}/messages?$top=1&$search="subject:${EMAIL_SUBJECT}"`)
    const response = await axios.get(
      `${GRAPH_API_BASE_URL}/users/${TARGET_EMAIL}/messages?$top=1&$search="subject:${EMAIL_SUBJECT}"`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  
    // Step 3: Ensure the email is found
    if (response.status !== 200) {
      throw new Error(`❌ Failed to fetch messages: ${response.status}`);
    }
  
    const messages = response.data.value;
    if (messages.length === 0) {
      throw new Error('>> ❌ No email found with the given subject');
    }
    const subject = response.data.value[0].subject;
    console.log('[INFO] ℹ️ Email Found with subject :', subject);
  
    // Return the email body content
    return subject;
  }
/*******************************************************************************************************************/
//Method to enter the Slack code extracted from email subject
async extractSlackCode(emailSubject : string) : Promise<void>
{
    // Step 1: Simulate fetching email content (Replace this with Graph API)
    const emailContent = emailSubject;

    // Step 2: Extract Slack Code using Regex
    const match = emailContent.match(/Slack confirmation code:\s*([A-Z0-9-]+)/);
    if (!match) {
        console.error("🚨 Slack confirmation code not found in email.");
        return;
    }

    let slackCode = match[1]; 
    console.log("📩 Extracted Slack Code:", slackCode);

    // Step 3: Format the code (Remove "-" and split characters)
    const codeArray = slackCode.replace(/-/g, "").split(""); 

    if (codeArray.length !== 6) {
        console.error("🚨 Invalid Slack Code: Must be exactly 6 characters long.");
        return;
    }

    // Step 4: Enter each digit into Slack verification fields
    for (let i = 0; i < 6; i++) {
        await this.page.getByLabel(`digit ${i + 1} of`).fill(codeArray[i]);
    }

    console.log("✅ Successfully entered the Slack confirmation code.");
    await this.page.waitForTimeout(7000);
}
/*******************************************************************************************************************/ 
// Method to sync slack users
async createSlackWorkspace(email : string, employeesEmail : string[]) : Promise<string|null>
{
    await helper.clickElement(this.Locators.btnSyncSlack(), "Click on Sync Slack Users button");
    await helper.verifyElementPresent(this.Locators.headerSyncSlackModal());
    await helper.clickElement(this.Locators.btnContinue(), "Click on Continue in the modal");
    await this.page.waitForTimeout(5000);

    await helper.clickElement(this.Locators.createNewWorkspaceLink(), "Click on Create new workspace link");
    await this.page.waitForTimeout(3000);

    await helper.fillElement(this.Locators.txtSlackEmail(), email , "Enter email for slack user");
    await helper.clickElement(this.Locators.btnContinueSlack(), "Click on Continue button")
    await this.page.waitForTimeout(2000);
    await helper.verifyElementPresent(this.Locators.headerSlackCode());
    await this.page.waitForTimeout(10000);

    const emailSubject = await this.retrieveEmail(config.slackemalSubject);
    console.log("Email subject is : " + emailSubject);
    await this.extractSlackCode(emailSubject);

    const configData = JSON.parse(fs.readFileSync(dynamicConfigPath, 'utf8'));
    const companyName = faker.company.name();
    await helper.fillElement(this.Locators.txtSlackCompanyName(), companyName, "Enter a company Name in Slack");
    await helper.clickElement(this.Locators.btnSlackNextStep(), "Click on Next button");
    await this.page.waitForTimeout(3000);
    await helper.fillElement(this.Locators.slacktxtAdminName(), companyName + "- Admin", "Enter name for the Admin");
    await helper.clickElement(this.Locators.btnSlackNextStep(), "Click on Next button");
    await this.page.waitForTimeout(3000);

    /*
    // Add all employees stored in the array -> same ones that were added to the new company
    for (const employeeEmail of employeesEmail) {
        await this.Locators.addCoWorkerInput().type(employeeEmail, { delay: 50 });
        await this.page.keyboard.press('Space'); // Press space after each email
        await this.page.waitForTimeout(2000);
        await this.page.keyboard.press('Enter'); // Press Enter after each email
        await this.page.waitForTimeout(2000);
        console.log(`✅ Added email: ${employeeEmail}`);
    }
    console.log("🎉 All employee emails have been entered successfully!");
    */

    for (let i = 1; i <= 5; i++) 
    {
        const employeeEmail = await helper.generateRandomEmail();
        if (employeeEmail) 
        {
            await this.Locators.addCoWorkerInput().type(employeeEmail, { delay: 25 });
            await this.page.keyboard.press('Space'); // Press space after each email
            await this.page.waitForTimeout(2000);
            await this.page.keyboard.press('Enter'); // Press Enter after each email
            await this.page.waitForTimeout(2000);
            console.log(`✅ Added email: ${employeeEmail}`);
        } else 
        {
            console.error("Generated email is null or undefined");
        }
    } 
    await helper.clickElement(this.Locators.btnSlackNext(), "Click on Next button");
    //await helper.clickElement(this.Locators.slackSkipStep(), "Click on Skip Step link");
    //await helper.clickElement(this.Locators.btnSlackSkipStep(), "Click on Skip Step in modal");

    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const newChannel   = "testChannel - " +  randomNumber;
    await helper.fillElement(this.Locators.txtSlackProject(), newChannel, "Enter a project type");
    await helper.clickElement(this.Locators.btnSlackNextStep(), "Click on Next button");

    await this.page.waitForTimeout(3000);
    await helper.clickElement(this.Locators.btnLimitedVersion(), "Click on Start with Free version button");
    await this.page.waitForTimeout(15000);

   //await helper.verifyElementPresent(this.Locators.newSlackChannel());
    //await helper.clickElement(this.Locators.btnCloseSlackHelp(), "Close help modal");
    
    //await helper.clickElement(this.Locators.btnSwitchWorkspace(), 'Click on Switch Workspace button');
    //const slackWorkspace = await this.Locators.workspaceLocator().textContent();
    //console.log("Workspace created is : " + slackWorkspace);

    await helper.clickElement(this.Locators.btnAddChannel(), "Click on Channel Button");
    await helper.clickElement(this.Locators.btnCreateChannel(), "Click on Create Channel Button");
    await helper.clickElement(this.Locators.btnSubMenuCreateChannel(), "Click on Create Channelsub menu");
    await helper.clickElement(this.Locators.btnNext(), "Click on Next button");
    const channelName   = "zuzoReward-" +  randomNumber;
    await helper.fillElement(this.Locators.txtChannelName(), channelName, "Enter a Channel Name");
    //await helper.clickElement(this.Locators.btnCloseSlackHelp(), "Close help modal");
    await helper.clickElement(this.Locators.btnCreate(), "Click on Create button");
    await helper.clickElement(this.Locators.radioBtnAddSpecific(), "Select option Add Specific people");
    await helper.clickElement(this.Locators.btnSkipForNow(), "Click Skip for Now button");


    console.log("[INFO] ℹ️  New Slack channel created : " + channelName);

    console.log("[INFO] ℹ️  Navigating back to Zuzo");
    await this.page.goto('https://app-dev.build.zuzocard.com/dashboard/create-rewards/ad-hoc');
    await this.page.waitForTimeout(3000);
    return channelName;
}
/*******************************************************************************************************************/ 
// Method to get sync slackUsers
async syncSlackUsers() : Promise<void>
{
    await helper.verifyElementPresent(this.Locators.btnSyncSlack());
    await helper.clickElement(this.Locators.btnSyncSlack(), "Click on Sync Slack button");
    await helper.verifyElementPresent(this.Locators.syncSlackModalHeader());
    await helper.clickElement(this.Locators.btnContinue(), "Click on Continue button in Sync Slack Users modal");
    await this.page.waitForTimeout(10000);
    await helper.clickElement(this.Locators.channelDropdowm(), "Click on Channel dropdown");

    const option = this.page.locator(`//*[contains(text(), "zuzoreward")]`); 
    await option.click(); 

    await helper.clickElement(this.Locators.btnAllowPermission(), "Click on Allow button");
    await this.page.waitForTimeout(10000);
    await helper.clickElement(this.Locators.btnContinue(), "Click on Continue button");
    await helper.clickElement(this.Locators.btnThanks(), "Click on Thanks button");
    await this.page.waitForTimeout(7000);
    await helper.verifyElementPresent(this.Locators.slackUserLocator());
    console.log(`✅  Slack Users imported successfully`);
}
/*******************************************************************************************************************/
// Method to create a new workspace on Slack Web
async createSlackWorkspaceWeb (email : string) : Promise<string|null>
{
    await this.page.goto('https://slack.com/get-started#/create', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await helper.fillElement(this.Locators.txtSlackEmail(), email, `Enter ${email} in Slack company email textbox`);
    await helper.clickElement(this.Locators.btnContinueSlack(), "Click on Continue button");

    await helper.verifyElementPresent(this.Locators.headerSlackCode());
    await this.page.waitForTimeout(9000);

    const emailSubject = await this.retrieveEmail(config.slackemalSubject);
    console.log("Email subject is : " + emailSubject);
    await this.extractSlackCode(emailSubject);

    const configData = JSON.parse(fs.readFileSync(dynamicConfigPath, 'utf8'));
    const companyName = faker.company.name();
    await helper.fillElement(this.Locators.txtSlackCompanyName(), companyName, "Enter a company Name in Slack");
    await helper.clickElement(this.Locators.btnSlackNextStep(), "Click on Next button");
    await this.page.waitForTimeout(3000);
    await helper.fillElement(this.Locators.slacktxtAdminName(), companyName + "- Admin", "Enter name for the Admin");
    await helper.clickElement(this.Locators.btnSlackNextStep(), "Click on Next button");
    await this.page.waitForTimeout(3000);

    for (let i = 1; i <= 5; i++) 
        {
            const employeeEmail = await helper.generateRandomEmail();
            if (employeeEmail) 
            {
                await this.Locators.addCoWorkerInput().type(employeeEmail, { delay: 25 });
                await this.page.keyboard.press('Space'); // Press space after each email
                await this.page.waitForTimeout(2000);
                await this.page.keyboard.press('Enter'); // Press Enter after each email
                await this.page.waitForTimeout(2000);
                console.log(`✅ Added email: ${employeeEmail}`);
            } else 
            {
                console.error("Generated email is null or undefined");
            }
        } 
        await helper.clickElement(this.Locators.btnSlackNext(), "Click on Next button");

        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        const newChannel   = "testChannel - " +  randomNumber;
        await helper.fillElement(this.Locators.txtSlackProject(), newChannel, "Enter a project type");
        await helper.clickElement(this.Locators.btnSlackNextStep(), "Click on Next button");

        await this.page.waitForTimeout(3000);
        await helper.clickElement(this.Locators.btnLimitedVersion(), "Click on Start with Free version button");
        await this.page.waitForTimeout(15000);

        if (await (this.Locators.btnCloseSlackHelp()).isVisible()) 
        {
            await helper.clickElement(this.Locators.btnCloseSlackHelp(), "Close Slack help modal");
        }
        
        await helper.clickElement(this.Locators.btnAddChannel(), "Click on Channel Button");
        await helper.clickElement(this.Locators.btnCreateChannel(), "Click on Create New Channel Button");

        await helper.clickElement(this.Locators.btnNext(), "Click on Next button");
        const channelName   = "zuzoReward-" +  randomNumber;
        await helper.fillElement(this.Locators.txtChannelName(), channelName, "Enter a Channel Name");
        await this.page.keyboard.press('Tab'); 
        await helper.clickElement(this.Locators.btnCreate(), "Click on Create button");
        await helper.clickElement(this.Locators.radioBtnAddSpecific(), "Select option Add Specific people");
        await helper.clickElement(this.Locators.btnSkipForNow(), "Click Skip for Now button");

        await helper.clickElement(this.Locators.btnSwitchWorkspace(), 'Click on Switch Workspace button');
        const slackWorkspace = await this.Locators.workspaceLocator().textContent();
        console.log("Workspace created is : " + slackWorkspace + " and new channel created is : " + channelName);
        return slackWorkspace;
}   

}

