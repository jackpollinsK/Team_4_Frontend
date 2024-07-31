import { WebDriver } from 'selenium-webdriver';
import { ChromeDriver } from './ChromeDriver';


export class HomeTestPage extends ChromeDriver {

    constructor(driver: WebDriver) {
        super(driver);
    }

    async open(): Promise<void> {
        const url = 'https://nczcbkjcc7.eu-west-1.awsapprunner.com'
        await this.go_to_url(url);
    }

}