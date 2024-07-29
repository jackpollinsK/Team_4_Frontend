import { By, WebDriver } from 'selenium-webdriver';

export class NavbarTestPage {
    private driver: WebDriver;
    
    // Locators
    private homeButton: By = By.linkText("Home");
    private jobsButton: By = By.linkText("Jobs");
    private aboutUsButton: By = By.linkText("About Us");
    private loginButton: By = By.linkText("Login");
    private logoutButton: By = By.linkText("Logout");

    constructor(driver: WebDriver) {
        this.driver = driver;
    }

    // Actions
    async open(url: string): Promise<void> {
        await this.driver.get(url);
    }

    async clickHomeButton(): Promise<void> {
        const element = await this.driver.findElement(this.homeButton);
        await element.click();
    }
    async clickJobsButton(): Promise<void> {
        const element = await this.driver.findElement(this.jobsButton);
        await element.click();
    }
    async clickAboutUsButton(): Promise<void> {
        const element = await this.driver.findElement(this.aboutUsButton);
        await element.click();
    }
    async clickoginButton(): Promise<void> {
        const element = await this.driver.findElement(this.loginButton);
        await element.click();
    }
    async clickLogoutButton(): Promise<void> {
        const element = await this.driver.findElement(this.logoutButton);
        await element.click();
    }
}