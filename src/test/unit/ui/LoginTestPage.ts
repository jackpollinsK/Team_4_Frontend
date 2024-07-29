// src/pages/LoginTestPage.ts
import { By, WebDriver } from 'selenium-webdriver';

export class LoginTestPage {
    private driver: WebDriver;
    
    // Locators
    private emailField: By = By.id('email');
    private passwordField: By = By.id('password');
    private loginButton: By = By.id('submit');
    private errorMessage: By = By.xpath("/html/body/div/div/div/h3");

    constructor(driver: WebDriver) {
        this.driver = driver;
    }

    // Actions
    async open(url: string): Promise<void> {
        await this.driver.get(url);
    }

    async enterEmail(email: string): Promise<void> {
        const element = await this.driver.findElement(this.emailField);
        await element.sendKeys(email);
    }

    async enterPassword(password: string): Promise<void> {
        const element = await this.driver.findElement(this.passwordField);
        await element.sendKeys(password);
    }

    async clickLogin(): Promise<void> {
        const element = await this.driver.findElement(this.loginButton);
        await element.click();
    }

    async getErrorMessageText(): Promise<string> {
        const element = await this.driver.findElement(this.errorMessage);
        return await element.getText();
    }
}