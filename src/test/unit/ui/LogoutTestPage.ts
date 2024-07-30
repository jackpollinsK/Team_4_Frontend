import { ChromeDriver } from './ChromeDriver';
import { WebDriver } from 'selenium-webdriver';

export class LogoutTestPage extends ChromeDriver {

    constructor(driver: WebDriver) {
        super(driver);
    }

    async open(theURL:string): Promise<void> {
        await this.go_to_url(theURL);
    }

    async clickLogout(): Promise<void> {
        const element = 'submit';
        await this.clickById(element);
    }

}

