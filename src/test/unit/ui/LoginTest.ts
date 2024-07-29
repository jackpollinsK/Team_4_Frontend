import { Builder, Capabilities, WebDriver } from 'selenium-webdriver';
import { expect } from 'chai';
import { LoginTestPage } from "./LoginTestPage";
import { LogoutTestPage } from "./LogoutTestPage";
import { HomeTestPage } from "./HomeTestPage";
import { NavbarTestPage } from "./NavbarTestPage";
import * as chrome from 'selenium-webdriver/chrome';


describe('Login Test', function () {
    this.timeout(10000) //Setting max timeout, default 2s
    let driver: WebDriver;
    let loginPage: LoginTestPage;
    let logoutPage: LogoutTestPage;
    let homePage: HomeTestPage;
    let navBarPage: NavbarTestPage;
    before(async function () {
        driver = new Builder()
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options())
            .build();

        loginPage = new LoginTestPage(driver);
        logoutPage = new LogoutTestPage(driver);
        homePage = new HomeTestPage(driver);
        navBarPage = new NavbarTestPage(driver);

    });

    after(async function () {
        try {
            await driver.quit(); // Ensure this is awaited
        } catch (error) {
            console.error('Error quitting the driver:', error);
        }
    });

    it('Should successfully login and logout with valid email and password', async function () {
        const url: string = process.env.UI_TEST_URL || 'https://nczcbkjcc7.eu-west-1.awsapprunner.com/loginForm';
        await loginPage.open(url);

        await loginPage.enterEmail('adam@random.com');
        await loginPage.enterPassword('pass123');
        await loginPage.clickLogin();
        await navBarPage.clickLogoutButton();
        await logoutPage.clickLogout();

        //Checking that user returned to home page after logged out
        const actualText = await homePage.getTitleText();
        expect(actualText).to.equal('The story so far');
        
    });

    it('Should fail login with no email and pasword', async function () {
        const url: string = process.env.UI_TEST_URL || 'https://nczcbkjcc7.eu-west-1.awsapprunner.com/loginForm';
        await loginPage.open(url);

        await loginPage.enterEmail('');
        await loginPage.enterPassword('');
        await loginPage.clickLogin();
        
        const actualText = await loginPage.getErrorMessageText();
        expect(actualText).to.equal('user does not exist.');
        
    });

    it('Should fail login with invalid email and pasword', async function () {
        const url: string = process.env.UI_TEST_URL || 'https://nczcbkjcc7.eu-west-1.awsapprunner.com/loginForm';
        await loginPage.open(url);

        await loginPage.enterEmail('adam123@random.com');
        await loginPage.enterPassword('pass123');
        await loginPage.clickLogin();
        
        const actualText = await loginPage.getErrorMessageText();
        expect(actualText).to.equal('user does not exist.');
        
    });

    it('Should fail login with valid email and invalid pasword', async function () {
        const url: string = process.env.UI_TEST_URL || 'https://nczcbkjcc7.eu-west-1.awsapprunner.com/loginForm';
        await loginPage.open(url);

        await loginPage.enterEmail('adam@random.com');
        await loginPage.enterPassword('123');
        await loginPage.clickLogin();
        
        const actualText = await loginPage.getErrorMessageText();
        expect(actualText).to.equal('user is not valid: Invalid Credentials.');
        
    });


});
