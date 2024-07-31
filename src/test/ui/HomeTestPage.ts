import { WebDriver } from 'selenium-webdriver';
import { ChromeDriver } from './ChromeDriver';


export class HomeTestPage extends ChromeDriver {

    constructor(driver: WebDriver) {
        super(driver);
    }

    async open(): Promise<void> {
        const BASE_URL = process.env.BASE_URL;
        await this.go_to_url(BASE_URL);
    }

}