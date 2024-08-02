import { WebDriver } from 'selenium-webdriver';
import { ChromeDriver } from './ChromeDriver';


export class HomeTestPage extends ChromeDriver {

    constructor(driver: WebDriver) {
        super(driver);
    }

    async open(): Promise<void> {
        const WEBSITE_URL = process.env.WEBSITE_URL || 'http://localhost:3000/';
        await this.go_to_url(WEBSITE_URL);
    }

}