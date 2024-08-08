import { WebDriver } from 'selenium-webdriver';
import { ChromeDriver } from './ChromeDriver';


export class JobRoleTestPage extends ChromeDriver {

    constructor(driver: WebDriver) {
        super(driver);
    }

    async open(ROLE_NUMBER: number): Promise<void> {
        const WEBSITE_URL = process.env.WEBSITE_URL || "http://localhost:3000";
        const JOBROLE_URL = `${WEBSITE_URL}/jobRoles-${ROLE_NUMBER}`;
        console.log(`Navigating to URL: ${JOBROLE_URL}`);
        await this.go_to_url(JOBROLE_URL);
    }

    async getRoleName(): Promise<string> {
        const id = `job-role-name`; 
        return await this.getTextById(id);
    }


}