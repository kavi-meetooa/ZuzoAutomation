import { test, expect, Page } from '@playwright/test';
import  *  as actions from '../../utils/actions';
import { config } from "../../config/config"; 


test.describe('Existing User - Succesful Login Test', () => {
    test.beforeEach(async ({ page }) => {
        await actions.executeLogin(page, config.credentials.email);
    });
/*--------------------------------------------------------------------------------------*/ 
test.only('As an existing user, I want to login to the Zuzo app and land on the Homepage', async ({ page }) => {
    console.log("Successfully logged into Zuzo");
});  
/*--------------------------------------------------------------------------------------*/ 
});