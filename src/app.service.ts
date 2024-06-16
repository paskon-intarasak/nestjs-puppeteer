import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectBrowser } from 'nestjs-puppeteer';
import { Browser } from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs-extra';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService {
  constructor(
    @InjectBrowser() private readonly browser: Browser,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM, { timeZone: 'Asia/Bangkok' })
  @Cron(CronExpression.EVERY_DAY_AT_6PM, { timeZone: 'Asia/Bangkok' })
  async autoCheckInToTigerSoft() {
    const currentDate = new Date()
      .toISOString()
      .split('T')[0]
      .split('-')
      .reverse()
      .join('-');
    const now = new Date();
    const hours = now.getHours();
    let fileName = `${currentDate}_${hours >= 12 ? 'pm' : 'am'}`;

    const saveDir = path.join(__dirname, '../uploads');
    await fs.ensureDir(saveDir);

    const combineFileName = path.join(saveDir, fileName);

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
        'https://www.titanbackoffice.com/WebTimeMobile/default1m.aspx',
      );
      const userName = this.configService.get('APP_TIGER_USERNAME');
      const passWord = this.configService.get('APP_TIGER_PASSWORD');
      await newPage.setViewport({ width: 1280, height: 720 });
      await newPage.waitForSelector('select[name="DropDownList1"]');
      await newPage.type('input[name="txtUser"]', userName);
      await newPage.type('input[name="txtPWD"]', passWord);
      await newPage.select('select[name="DropDownList1"]', '9');
      await newPage.click('input[name="Button1"]');
      await newPage.waitForSelector('#empPic_standard', { visible: true });
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

      const inputFile = await newPage.$('input[type="file"]');
      console.log(`${combineFileName}.jpg`);
      const fileToUpload = `${combineFileName}.jpg`;

      await inputFile.uploadFile(fileToUpload);

      await newPage.waitForSelector('#Button8', { visible: true });

      await newPage.click('.modal-dialog .modal-footer input[name="Button8"]');
    } catch (err) {
      console.error(err);
      console.log('Can not Checkin Please Manual or Contact Admin');
    } finally {
      const telegramApiToken =
        this.configService.get<string>('APP_TELEGRAM_API');
      const saveDir = path.join(__dirname, '../screenshot');
      await fs.ensureDir(saveDir);
      const timestamp = Date.now();
      await newPage.screenshot({
        path: path.join(saveDir, `${timestamp}.jpg`),
      });
      // Send to Telegram
      await newPage.close();
      const image = fs.readFileSync(path.join(saveDir, `${timestamp}.jpg`));
      const base64Image = Buffer.from(image).toString('base64');
      await axios.post(
        `https://api.telegram.org/bot${telegramApiToken}/sendPhoto`,
        {
          chat_id: parseInt('587931895'),
          photo: `data:image/jpeg;base64,${base64Image}`,
        },
      );
    }
  }
}
