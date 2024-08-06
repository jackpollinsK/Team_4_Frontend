import { ChromeDriver } from './ChromeDriver';
import { WebDriver } from 'selenium-webdriver';

export class LogoutTestPage extends ChromeDriver {

    constructor(driver: WebDriver) {
        super(driver);
    }

    
    async open(): Promise<void> {
        const WEBSITE_URL = process.env.WEBSITE_URL || "http://localhost:3000";
        const LOGOUT_URL = `${WEBSITE_URL}/logoutForm`;
        await this.go_to_url(LOGOUT_URL);
    }

    async clickLogout(): Promise<void> {
        const element = 'submit';
        await this.clickById(element);
    }

}

