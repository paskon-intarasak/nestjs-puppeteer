import { Injectable } from '@nestjs/common';
import { PuppeteerOptionsFactory } from 'nestjs-puppeteer';
import { PuppeteerNodeLaunchOptions } from 'puppeteer';
import * as fs from 'fs';

@Injectable()
export class PuppeteerConfigService implements PuppeteerOptionsFactory {
  createPuppeteerOptions(): PuppeteerNodeLaunchOptions {
    const fileExists = (filePath) => fs.existsSync(filePath);
    return {
      // This logic is check if /usr/bin/google-chrome not found
      executablePath: fileExists('/usr/bin/google-chrome')
        ? '/usr/bin/google-chrome'
        : fileExists('/usr/bin/chromium-browser')
          ? '/usr/bin/chromium-browser'
          : fileExists('/usr/bin/chrome')
            ? '/usr/bin/chrome'
            : '',
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
      ignoreHTTPSErrors: true,
    };
  }
}
