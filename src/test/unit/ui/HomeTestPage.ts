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

    async getTitleText(): Promise<string> {
        const element = '/html/body/div[1]/div/h2'; //Placeholder, waiting for hotfix for better solution
        return await this.getTextByXpath(element);
    }
}