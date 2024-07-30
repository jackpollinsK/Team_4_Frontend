import { ChromeDriver } from './ChromeDriver';
import { WebDriver } from 'selenium-webdriver';

export class NavbarTestPage extends ChromeDriver {

    constructor(driver: WebDriver) {
        super(driver);
    }

    async clickHomeButton(): Promise<void> {
        const element = 'Home';
        await this.clickByLinkText(element);
    }
    async clickJobsButton(): Promise<void> {
        const element = 'Jobs';
        await this.clickByLinkText(element);
    }
    async clickAboutUsButton(): Promise<void> {
        const element = 'About Us';
        await this.clickByLinkText(element);
    }
    async clickoginButton(): Promise<void> {
        const element = 'Login';
        await this.clickByLinkText(element);
    }
    async clickLogoutButton(): Promise<void> {
        const element = 'Logout';
        await this.clickByLinkText(element);
    }
}