import { By, WebDriver } from 'selenium-webdriver';
import { ChromeDriver } from './ChromeDriver';


export class JobRolesTestPage extends ChromeDriver {

    constructor(driver: WebDriver) {
        super(driver);
    }

    async open(): Promise<void> {
        const WEBSITE_URL = process.env.WEBSITE_URL || "http://localhost:3000";
        const JOBROLES_URL = `${WEBSITE_URL}/jobRoles`;
        await this.go_to_url(JOBROLES_URL);
    }

    //Login button needs ID
    async getLoginButtonText(): Promise<string> {
        const linkText = 'Login';
        return await this.getTextByLinkText(linkText);
    }

    async getTable(): Promise<void> {
        const id = 'jobRolesTable';
        await this.getElementById(id);
    }

    async getData(row: number, col: number): Promise<string> {
        const id = 'jobRolesTable';
        return await this.getCellText(id, row, col);
    }

    async getNumRows(): Promise<number> {
        const id = 'jobRolesTable';
        return await this.getRowCount(id);
    }

    async getNumCols(): Promise<number> {
        const id = 'jobRolesTable';
        return await this.getColumnCount(id);
    }

    async clickTableCell(row: number, col: number): Promise<void> {
        const id = 'jobRolesTable';
        await this.clickCell(id, row, col);
    }

    async clickTableCellLink(row: number, col: number): Promise<void> {
        const link = await this.driver.findElement(By.css(`table#jobRolesTable tr:nth-child(${row}) td:nth-child(${col}) a`));
        await link.click();
    }

    async clickLogin(): Promise<void> {
        const element = 'not-logged-in';
        await this.clickById(element);
    }

    async clickViewJobs(): Promise<void> {
        const element = 'Click here to see all Job Roles';
        await this.clickByLinkText(element);
    }
}