import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InjectBrowser, PuppeteerModule } from 'nestjs-puppeteer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PuppeteerConfigService } from './config/puppeteer.config';
import { Browser } from 'puppeteer';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development')
          .required(),
        APP_NAME: Joi.string().required(),
        APP_PORT: Joi.number().positive().default(3000).required(),
        APP_TIGER_USERNAME: Joi.string().required(),
        APP_TIGER_PASSWORD: Joi.string().required(),
      }),
    }),
    PuppeteerModule.forRootAsync({
      useClass: PuppeteerConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectBrowser() private readonly browser: Browser) {}

  // You can implement on init here
  async onModuleInit() {
    const newPage = await this.browser.newPage();
    try {
      await newPage.setGeolocation({
        accuracy: 100,
        latitude: this.configService.get<number>('APP_GEO_LAT'),
        longitude: this.configService.get<number>('APP_GEO_LNG'),
      });

      const context = this.browser.defaultBrowserContext();
      context.overridePermissions(
        'https://www.titanbackoffice.com/WebTimemobile/Mobile/Work/WebCheckIn_m3.aspx?mode=loc_pic',
        ['geolocation'],
      );

      // Puppeteer Logic Here
      await newPage.goto(
        'https://www.titanbackoffice.com/WebTimemobile/Mobile/Work/WebCheckIn_m3.aspx?mode=loc_pic',
      );

      const userName = this.configService.get('APP_TIGER_USERNAME');
      const passWord = this.configService.get('APP_TIGER_PASSWORD');

      await newPage.setViewport({ width: 1280, height: 720 });

      await newPage.waitForSelector('select[name="DropDownList1"]');

      await newPage.type('input[name="txtUser"]', userName);
      await newPage.type('input[name="txtPWD"]', passWord);
      await newPage.select('select[name="DropDownList1"]', '9');
      await newPage.click('input[name="Button1"]');

      await newPage.waitForNavigation();
      await newPage.goto(
        'https://www.titanbackoffice.com/WebTimeMobile/Mobile/Work/WebCheckIn_m3.aspx?mode=loc_pic',
      );
      await newPage.click('div#DrpStatus');
      await newPage.waitForSelector('ul.rcbList');

      // Simulate pressing the down arrow key 4 times
      for (let i = 0; i < 4; i++) {
        await newPage.keyboard.press('ArrowDown');
      }

      // Simulate pressing the Enter key
      await newPage.keyboard.press('Enter', { delay: 1000 });

      await newPage.type('textarea[name="txtAddMemo2"]', 'เทสระบบ', {
        delay: 1000,
      });

      // await newPage.click('input[type="button"][name="Button1"]');
      await newPage.click(
        '.row .col-md-12.col-sm-12.col-xs-12.fixedPadding input[type="button"][name="Button1"]',
        { delay: 4000 },
      );

      await newPage.waitForSelector('.modal-dialog');
      await newPage.waitForSelector('.modal-footer');
      await newPage.waitForSelector(
        '.modal-dialog .modal-footer input[name="Button10"]:not([disabled])',
        { visible: true },
      );
      await newPage.click('.modal-dialog .modal-footer input[name="Button10"]');

      await newPage.waitForSelector('#takephoto', { visible: true });
    } catch (err) {
      console.error(err);
    } finally {
      // await newPage.close();
    }
  }
}
