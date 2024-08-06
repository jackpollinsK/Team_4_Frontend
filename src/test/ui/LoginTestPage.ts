import { WebDriver } from 'selenium-webdriver';
import { ChromeDriver } from './ChromeDriver';

export class LoginTestPage extends ChromeDriver {

    constructor(driver: WebDriver) {
        super(driver);
    }   
         
 
    async open(): Promise<void> {
        const WEBSITE_URL = process.env.WEBSITE_URL || 'http://localhost:3000';
        const LOGIN_URL = `${WEBSITE_URL}/loginForm`;
        await this.go_to_url(LOGIN_URL);
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