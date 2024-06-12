import { Injectable } from '@nestjs/common';
import { PuppeteerOptionsFactory } from 'nestjs-puppeteer';
import { PuppeteerNodeLaunchOptions } from 'puppeteer';

@Injectable()
export class PuppeteerConfigService implements PuppeteerOptionsFactory {
  createPuppeteerOptions(): PuppeteerNodeLaunchOptions {
    return {
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    };
  }
}
