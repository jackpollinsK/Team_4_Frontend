import { WebDriver, WebElement } from 'selenium-webdriver';
import { ChromeDriver } from './ChromeDriver';


export class JobRolesTestPage extends ChromeDriver {

    constructor(driver: WebDriver) {
        super(driver);
    }

    async open(): Promise<void> {
        const WEBSITE_URL = process.env.WEBSITE_URL;
        const JOBROLES_URL = `${WEBSITE_URL}/job-roles`;
        await this.go_to_url(JOBROLES_URL);
    }

    //Login button needs ID
    async getLoginButtonText(): Promise<string> {
        const linkText = 'Login'; 
        return await this.getTextByLinkText(linkText);
    }

    //Table needs ID
    async getTable(): Promise<void> {
        const id = 'JobRoleTable'; 
        await this.getElementById(id);
    }

    //Placeholder class until table has ID
    async getTableXpath(): Promise<WebElement> {
        const xpath = '/html/body/div/div/table'; 
        return await this.getTableWithXpath(xpath);
    }

    //Placeholder class until table has ID
    async getData(row: number, col: number): Promise<string> {
        const id = '/html/body/div/div/table'; // Switch to ID
        return await this.getCellText(id, row, col);
    }

    //Placeholder class until table has ID
    async getNumRows(): Promise<number> {
        const id = '/html/body/div/div/table'; // Switch to ID
        return await this.getRowCount(id);
    } 

    //Placeholder class until table has ID
    async getNumCols(): Promise<number> {
        const id = '/html/body/div/div/table'; // Switch to ID
        return await this.getColumnCount(id);
    } 

   //Click ce
   async clickTableCell(row: number, col: number): Promise<void> {
    const id = '/html/body/div/div/table'; // Switch to ID
    await this.clickCell(id, row, col); //Switch to ID when ID implemented
}    

   //Login button needs ID
    async clickLogin(): Promise<void> {
        const element = 'Login';
        await this.clickByLinkText(element); //Switch to ID when ID implemented
    }
}