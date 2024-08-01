import { WebDriver } from 'selenium-webdriver';
import { ChromeDriver } from './ChromeDriver';


export class JobRolesTestPage extends ChromeDriver {

    constructor(driver: WebDriver) {
        super(driver);
    }

    async open(): Promise<void> {
        const WEBSITE_URL = process.env.WEBSITE_URL;
        const JOBROLES_URL = `${WEBSITE_URL}/job-roles`;
        await this.go_to_url(WEBSITE_URL);
    }

}