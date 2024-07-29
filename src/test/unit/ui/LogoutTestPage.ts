import { By, WebDriver } from 'selenium-webdriver';

export class LogoutTestPage {
    private driver: WebDriver;
    
    // Locators
    private logoutButton: By = By.id('submit');
    private logoutText: By = By.xpath("/html/body/footer/div[1]/div/div[1]/h5");

    constructor(driver: WebDriver) {
        this.driver = driver;
    }

    // Actions
    async open(url: string): Promise<void> {
        await this.driver.get(url);
    }


    async clickLogout(): Promise<void> {
        const element = await this.driver.findElement(this.logoutButton);
        await element.click();
    }

    async getLogoutText(): Promise<string> {
        const element = await this.driver.findElement(this.logoutText);
        return await element.getText();
    }
}