import { By, WebDriver } from 'selenium-webdriver';

export class HomeTestPage {
    private driver: WebDriver;
    
    // Locators
    private titleMessage: By = By.xpath("/html/body/div[1]/div/h2");

    constructor(driver: WebDriver) {
        this.driver = driver;
    }

    // Actions
    async open(url: string): Promise<void> {
        await this.driver.get(url);
    }

    async getTitleText(): Promise<string> {
        const element = await this.driver.findElement(this.titleMessage);
        return await element.getText();
    }
}