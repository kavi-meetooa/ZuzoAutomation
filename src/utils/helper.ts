import { Page, Locator } from 'playwright';

/*----------------------------------------------------------------------------------------------------------------*/
// Function to check if an element is clickable
/*----------------------------------------------------------------------------------------------------------------*/
async function isClickable(locator: Locator): Promise<boolean> {
  try 
  {
    // Wait for the element to be visible
    await locator.waitFor({ state: 'visible', timeout: 5000 });

    // Evaluate if the element is not disabled and is visible in the layout
    const isEnabled = await locator.evaluate((el) => {
      // Check if the element is an input or button, which have the 'disabled' property
      if (el instanceof HTMLInputElement || el instanceof HTMLButtonElement) 
        {
            return !el.disabled && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden';
        }
      // For other elements, simply check visibility
      return getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden';
    });
    return isEnabled;
  } catch (error) 
  {
    console.error(`Error checking if element is clickable: ${(error as Error).message}`);
    throw error;
    return false; // Return false if there's an error
  }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to click on a web element
/*----------------------------------------------------------------------------------------------------------------*/
export async function clickElement(locator: Locator, stepName: string): Promise<void> {
    try {
      // Check if the element is clickable
      if (await isClickable(locator)) {
        // Scroll the element into view if needed
        await locator.scrollIntoViewIfNeeded();
        // Attempt to click the element
        await locator.click();
        console.info(`>>Test step : ${stepName} - PASS`);
      } else {
        console.error(`>>Test step : ${stepName} - FAIL >>> Element is not clickable.`);
      }
    } catch (error) {
      console.error(`>>Test step : ${stepName} - FAIL \nError: ${(error as Error).message}`);
      throw error;
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to enter text in a textbox/textarea
/*----------------------------------------------------------------------------------------------------------------*/
export async function fillElement(locator: Locator, text: string, stepName: string): Promise<void> {
    try {
      // Wait for the locator to be visible
      await locator.waitFor({ state: 'visible' });

      // Check if the locator is editable
      if (await locator.isEditable()) {
        await locator.fill(text);
        console.info(`>>Test step : ${stepName} - PASS`);
      } else {
        throw new Error('Element is not editable');
      }
    } catch (error) {
      console.error(`>>Test step: ${stepName} - FAIL \nError: ${(error as Error).message}`);
      throw error;
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to click on a wait for an element with a timeout of 10s
/*----------------------------------------------------------------------------------------------------------------*/
export async function waitForElement(locator: Locator, stepName: string, timeout: number = 10000): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      console.info(`>>Test step: ${stepName} - PASS`);
    } catch (error) {
      console.error(`>>Test step: ${stepName} - FAIL\nError: ${(error as Error).message}`);
      throw error;
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to clear a textbox
/*----------------------------------------------------------------------------------------------------------------*/
export async function clearTextbox(locator: Locator, stepName: string): Promise<void> {
    try {
      // Focus on the textbox to ensure interaction
      await locator.click();
      // Clear the textbox
      await locator.fill('');
      console.log(`>>Test step: ${stepName} - PASS`);
    } catch (error) {
      console.error(`>>Test step: ${stepName} - FAIL\nError: ${(error as Error).message}`);
      throw error;
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to retrieve the text of an element
/*----------------------------------------------------------------------------------------------------------------*/
export async function getElementText(selector: Locator): Promise<string | null> {
  try {
    // Wait for the element to be visible
    await selector.waitFor({ state: 'visible' });

    // Get the text content of the element
    const elementText = await selector.textContent();

    // Log and return the trimmed text content
    console.log(`Text of element: ${elementText?.trim()}`);
    return elementText ? elementText.trim() : null;
  } catch (error) {
    console.error(`Error getting text of element:`, error);
    return null;
  }
}
/*----------------------------------------------------------------------------------------------------------------*/
// Function to navigate to a page
/*----------------------------------------------------------------------------------------------------------------*/
export async function navigateToUrl(page : Page, url : string): Promise<void> {
    try {
        console.log(`Navigating to URL: ${url}`);
        await page.goto(url, {
          waitUntil: 'networkidle', // Wait for no network connections
          timeout: 30000, // 
        });
        console.log(`Successfully navigated to: ${url}`);
      } catch (error) {
        console.error(`Failed to navigate to ${url}:`, error);
        throw error; // Re-throw the error to fail the test if navigation fails
      }
    }
/*----------------------------------------------------------------------------------------------------------------*/
// Function to maximise browser
/*----------------------------------------------------------------------------------------------------------------*/
  export async function maximizeWindow(page: Page): Promise<void> {
    try 
    {
      const { width, height } = await page.evaluate(() => ({
        width: window.screen.availWidth,
        height: window.screen.availHeight
      }));
      await page.setViewportSize({ width, height });
      console.info(`Test step : Browser window maximize - PASS`);
    } catch (error) 
    {
      console.error(`Test step: FAIL - Error maximizing window: ${(error as Error).message}`);
    }
  }
/*----------------------------------------------------------------------------------------------------------------*/
// Function to assert for messages (success, info, error, toast etc)
/*----------------------------------------------------------------------------------------------------------------*/
export async function verifyMessage(page: Page, locator: Locator, message: string): Promise<void> {
    // Check if the locator contains the expected message
    await page.waitForTimeout(2000);
    const messageExists = await locator.locator(`text=${message}`).isVisible();
  
    if (messageExists) 
    {
      console.log(`Test step : Verify message: "${message} is present - PASS"`);
    } else 
    {
      throw new Error(`Test step : Verify message "${message}" is present - FAIL`);
    }
  }
/*----------------------------------------------------------------------------------------------------------------*/