import { WebDriver } from 'selenium-webdriver';
import { ChromeDriver } from './ChromeDriver';

export class LoginTestPage extends ChromeDriver {

    constructor(driver: WebDriver) {
        super(driver);
    }   
         
 
    async open(): Promise<void> {
        const url : string = "https://nczcbkjcc7.eu-west-1.awsapprunner.com/loginForm"
        await this.go_to_url(url);
    }

    async enterEmail(email: string): Promise<void> {
        const element = 'email'
        await this.enterTextById(element, email)
    }

    async enterPassword(password: string): Promise<void> {
        const element = 'password'
        await this.enterTextById(element, password)
    }

    async clickLogin(): Promise<void> {
        const element = 'submit';
        await this.clickById(element);
    }

    async getErrorMessageText(): Promise<string> {
        const element = 'errorMessage';
        return await this.getTextById(element);
    }
}