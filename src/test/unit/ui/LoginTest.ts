import { expect } from 'chai';
import { LoginTestPage } from "./LoginTestPage";
import { LogoutTestPage } from "./LogoutTestPage";
import { HomeTestPage } from "./HomeTestPage";
import { NavbarTestPage } from "./NavbarTestPage";
import { WebDriver } from 'selenium-webdriver';
import { ChromeDriver } from './ChromeDriver';

describe('Login Test', function () {
    this.timeout(30000) //Setting max timeout so test doesnt timeout after 2s

    let driver: WebDriver;
    let loginPage: LoginTestPage;
    let logoutPage: LogoutTestPage;
    let homePage: HomeTestPage;
    let navBarPage: NavbarTestPage;

    before(async function () {

        driver = new ChromeDriver().driver;
        loginPage = new LoginTestPage(driver);
        logoutPage = new LogoutTestPage(driver);
        homePage = new HomeTestPage(driver);
        navBarPage = new NavbarTestPage(driver);

    });

    after(async function () {
        try {
            await driver.quit();
        } catch (error) {
            console.error('Error quitting the driver:', error);
        }
    });

    it('Should successfully login and logout with valid email and password', async function () {
        const EMAIL = process.env.LOGIN_EMAIL_1
        const PASSWORD = process.env.LOGIN_PASSWORD_1
        
        await loginPage.open();

        await loginPage.enterEmail(EMAIL);
        await loginPage.enterPassword(PASSWORD);
        await loginPage.clickLogin();

        //Checking that user returned to home page after loging in
        const actualText1 = await navBarPage.getLogoutButtonText();
        expect(actualText1).to.equal('Logout');

        await navBarPage.clickLogoutButton();
        await logoutPage.clickLogout();

        //Checking that user returned to home page after logged out
        const actualText2 = await navBarPage.getLoginButtonText();
        expect(actualText2).to.equal('Login');
        
    });

    it('Should fail login with no email and password', async function () {
        const EMAIL = ''
        const PASSWORD = ''
        
        await loginPage.open();

        await loginPage.enterEmail(EMAIL);
        await loginPage.enterPassword(PASSWORD);
        await loginPage.clickLogin();
        
        const actualText = await loginPage.getErrorMessageText();
        expect(actualText).to.equal('Invalid Email - Try Again.');
        
    });

    it('Should fail login with invalid email and password', async function () {
        const EMAIL = 'adam123@random.com'
        const PASSWORD = process.env.LOGIN_PASSWORD_1
        
        await loginPage.open();

        await loginPage.enterEmail(EMAIL);
        await loginPage.enterPassword(PASSWORD);
        await loginPage.clickLogin();
        
        const actualText = await loginPage.getErrorMessageText();
        expect(actualText).to.equal('Invalid Email - Try Again.');
        
    });

    it('Should fail login with valid email and invalid pasword', async function () {
        const EMAIL = process.env.LOGIN_EMAIL_1
        const PASSWORD = '123'
        
        await loginPage.open();

        await loginPage.enterEmail(EMAIL);
        await loginPage.enterPassword(PASSWORD);
        await loginPage.clickLogin();
        
        const actualText = await loginPage.getErrorMessageText();
        expect(actualText).to.equal('Invalid Credentials.');
        
    });


});
