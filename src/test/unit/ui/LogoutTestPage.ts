import { ChromeDriver } from './ChromeDriver';
import { WebDriver } from 'selenium-webdriver';

export class LogoutTestPage extends ChromeDriver {

    constructor(driver: WebDriver) {
        super(driver);
    }

    
    async open(): Promise<void> {
        const url = 'https://nczcbkjcc7.eu-west-1.awsapprunner.com/logoutForm'
        await this.go_to_url(url);
    }

    async clickLogout(): Promise<void> {
        const element = 'submit';
        await this.clickById(element);
    }

}

