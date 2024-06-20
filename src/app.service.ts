import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectBrowser } from 'nestjs-puppeteer';
import { Browser } from 'puppeteer';

@Injectable()
export class AppService {
  constructor(
    @InjectBrowser() private readonly browser: Browser,
    private configService: ConfigService,
  ) {}

  async getTitle() {
    const newPage = await this.browser.newPage();
    try {
      const getWebUrl = this.configService.get<string>('APP_WEB_URL');
      // Puppeteer Logic Here
      await newPage.goto(getWebUrl);
      const getTitle = await newPage.title();

      return getTitle;
    } catch (err) {
      console.error(err);
    } finally {
      await newPage.close();
    }
  }
}
