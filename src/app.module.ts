import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InjectBrowser, PuppeteerModule } from 'nestjs-puppeteer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PuppeteerConfigService } from './config/puppeteer.config';
import { Browser } from 'puppeteer';

@Module({
  imports: [
    ConfigModule,
    PuppeteerModule.forRootAsync({
      useClass: PuppeteerConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(@InjectBrowser() private readonly browser: Browser) {}

  async testBrowser() {
    const newPage = await this.browser.newPage();
    try {
      await newPage.goto('');
    } catch (err) {
    } finally {
      await newPage.close();
    }
  }
}
