import { expect } from 'chai';
import { LoginTestPage } from "./LoginTestPage";
import { LogoutTestPage } from "./LogoutTestPage";
import { HomeTestPage } from "../ui/HomeTestPage";
import { NavbarTestPage } from "./NavbarTestPage";
import { JobRolesTestPage } from "./JobRolesTestPage";
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
    let jobRolesPage: JobRolesTestPage;

    let Roles = ['Software Engineer', 'Product Manager'];
    let Location = ['Belfast', 'Birmingham', 'Derry'];
    let Capability = ['Engineering', 'Data and Artificial Intelligence'];
    let Band = ['Apprentice', 'Trainee', 'Associate']    

    before(async function () {

        driver = await new ChromeDriver().driver;
        loginPage = await new LoginTestPage(driver);
        logoutPage = await new LogoutTestPage(driver);
        homePage = await new HomeTestPage(driver);
        navBarPage = await new NavbarTestPage(driver);
        jobRolesPage = await new JobRolesTestPage(driver);

    });

    after(async function () {
        try {
            await driver.quit();
        } catch (error) {
            console.error('Error quitting the driver:', error);
        }
    });

    it('Should redirect to notLoggedIn URl if not logged ', async function () {

        await homePage.open();

        await navBarPage.clickJobsButton();
        
        //Verify 
        const actualText1 = await jobRolesPage.getLoginButtonText();
        expect(actualText1).to.equal('Login');        
        
    });

    it('Should able able to view jobs if logged in', async function () {

        await homePage.open();
 
        await navBarPage.clickJobsButton();

        await jobRolesPage.clickLogin();

        const EMAIL = process.env.LOGIN_EMAIL_1;
        const PASSWORD = process.env.LOGIN_PASSWORD_1;

        await loginPage.enterEmail(EMAIL);
        await loginPage.enterPassword(PASSWORD);
        await loginPage.clickLogin();

        await navBarPage.clickJobsButton();

        //Verifying that jobs are displayed
        const tabledata = await jobRolesPage.getData(1,1);
        expect(tabledata).to.equal('Software Engineer');        
        
        
    });

    it('Verify valid field names', async function () {

        await jobRolesPage.open();

        await jobRolesPage.clickLogin();

        const EMAIL = process.env.LOGIN_EMAIL_1;
        const PASSWORD = process.env.LOGIN_PASSWORD_1;

        await loginPage.enterEmail(EMAIL);
        await loginPage.enterPassword(PASSWORD);
        await loginPage.clickLogin();

        await navBarPage.clickJobsButton();

        const rows = await jobRolesPage.getNumRows();
        const colms = await jobRolesPage.getNumCols();
        console.log('Num of rows: ' + rows);
        console.log('Num of columns: ' + colms);

        //Verifying Role column
        for(let index = 1; index < rows; index++){
            const tabledata = await jobRolesPage.getData(index,1)
            console.log('Role: ' + tabledata)
            expect(Roles).to.include(tabledata); 
        }

        //Verifying Location column        
        for(let index = 1; index < rows; index++){
            const tabledata = await jobRolesPage.getData(index,2)
            console.log('Location: ' + tabledata)
            expect(Location).to.include(tabledata); 
        }

        //Verifying Capability column
        for(let index = 1; index < rows; index++){
            const tabledata = await jobRolesPage.getData(index,3)
            console.log('Capability: ' + tabledata)
            expect(Capability).to.include(tabledata); 
        }

        //Verifying Band column        
        for(let index = 1; index < rows; index++){
            const tabledata = await jobRolesPage.getData(index,4)
            console.log('Band: ' + tabledata)
            expect(Band).to.include(tabledata); 
        }      
        
        
    });


});
