import chrome from 'selenium-webdriver/chrome';
import { Builder, By, WebDriver, until, WebElement } from 'selenium-webdriver';

export class ChromeDriver {
    driver: WebDriver;

    constructor(driver?: WebDriver) {
        this.driver = driver || new Builder()
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options())
            .build();
    }

    async go_to_url(theURL: string) {
        await this.driver.get(theURL);
    }

    async enterTextById(id: string, searchText: string) {
        console.log(`Entering text in element with ID: ${id}`);
        await this.driver.findElement(By.id(id)).sendKeys(searchText);

    }

    async getTextById(id: string) {
        console.log(`Getting text from element with ID: ${id}`);
        return await this.driver.findElement(By.id(id)).getText()
    }

    async getTextByXpath(path: string) {
        console.log(`Getting text from element with XPath: ${path}`);
        return await this.driver.findElement(By.xpath(path)).getText();
    }

    async clickById(id: string) {
        console.log(`Clicking element with ID: ${id}`);
        await this.driver.findElement(By.id(id)).click();
    }

    async clickByLinkText(linkText: string) {
        console.log(`Clicking element with Text: ${linkText}`);
        await this.driver.findElement(By.linkText(linkText)).click();
    }

    async closeBrowser() {
        console.log('Closing browser');
        await this.driver.quit();
    }
}
