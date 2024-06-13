import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { InjectBrowser } from 'nestjs-puppeteer';
import { Browser } from 'puppeteer';

@Injectable()
export class AppService {
  constructor(@InjectBrowser() private readonly browser: Browser) {}

  async testBrowser() {
    const newPage = await this.browser.newPage();
    try {
      // Puppeteer Logic Here
      await newPage.goto('https://www.google.com');
      const imageBuffer = await newPage.screenshot();
      return imageBuffer;
    } catch (err) {
      console.error(err);
    } finally {
      await newPage.close();
    }
  }
}
