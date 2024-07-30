import { WebDriver } from 'selenium-webdriver';
import { ChromeDriver } from './ChromeDriver';

export class LoginTestPage extends ChromeDriver {

    constructor(driver: WebDriver) {
        super(driver);
    }        
 
    async open(theURL:string): Promise<void> {
        await this.go_to_url(theURL);
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