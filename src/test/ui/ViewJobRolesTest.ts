import { expect } from 'chai';
import { LoginTestPage } from "./LoginTestPage";
import { LogoutTestPage } from "./LogoutTestPage";
import { HomeTestPage } from "../ui/HomeTestPage";
import { NavbarTestPage } from "./NavbarTestPage";
import { WebDriver } from 'selenium-webdriver';
import { ChromeDriver } from './ChromeDriver';

describe('View job roles Test', function () {
    this.timeout(30000) //Setting max timeout so test doesnt timeout after 2s

    let driver: WebDriver;
    let loginPage: LoginTestPage;
    let logoutPage: LogoutTestPage;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let homePage: HomeTestPage;
    let navBarPage: NavbarTestPage;

    before(async function () {

        driver = await new ChromeDriver().driver;
        loginPage = await new LoginTestPage(driver);
        logoutPage = await new LogoutTestPage(driver);
        homePage = await new HomeTestPage(driver);
        navBarPage = await new NavbarTestPage(driver);

    });

    after(async function () {
        try {
            await driver.quit();
        } catch (error) {
            console.error('Error quitting the driver:', error);
        }
    });

    it('', async function () {

        
    });



});
