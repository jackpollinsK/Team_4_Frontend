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
            await loginPage.closeBrowser();
        } catch (error) {
            console.error('Error quitting the driver:', error);
        }
    });

    it('Should successfully login and logout with valid email and password', async function () {
        await loginPage.open("https://nczcbkjcc7.eu-west-1.awsapprunner.com/loginForm");

        await loginPage.enterEmail('adam@random.com');
        await loginPage.enterPassword('pass123');
        await loginPage.clickLogin();

        //Checking that user returned to home page after loging in
        const actualText1 = await homePage.getTitleText();
        expect(actualText1).to.equal('The story so far');

        await navBarPage.clickLogoutButton();
        await logoutPage.clickLogout();

        //Checking that user returned to home page after logged out
        const actualText2 = await homePage.getTitleText();
        expect(actualText2).to.equal('The story so far');
        
    });

    it('Should fail login with no email and password', async function () {
        await loginPage.open("https://nczcbkjcc7.eu-west-1.awsapprunner.com/loginForm");

        await loginPage.enterEmail('');
        await loginPage.enterPassword('');
        await loginPage.clickLogin();
        
        const actualText = await loginPage.getErrorMessageText();
        expect(actualText).to.equal('Invalid Email - Try Again.');
        
    });

    it('Should fail login with invalid email and password', async function () {
        await loginPage.open("https://nczcbkjcc7.eu-west-1.awsapprunner.com/loginForm");

        await loginPage.enterEmail('adam123@random.com');
        await loginPage.enterPassword('pass123');
        await loginPage.clickLogin();
        
        const actualText = await loginPage.getErrorMessageText();
        expect(actualText).to.equal('Invalid Email - Try Again.');
        
    });

    it('Should fail login with valid email and invalid pasword', async function () {
        await loginPage.open("https://nczcbkjcc7.eu-west-1.awsapprunner.com/loginForm");

        await loginPage.enterEmail('adam@random.com');
        await loginPage.enterPassword('123');
        await loginPage.clickLogin();
        
        const actualText = await loginPage.getErrorMessageText();
        expect(actualText).to.equal('Invalid Credentials.');
        
    });


});
