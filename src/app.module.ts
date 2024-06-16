import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PuppeteerModule } from 'nestjs-puppeteer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PuppeteerConfigService } from './config/puppeteer.config';
import * as Joi from 'joi';
import { TelegramModule } from './telegram/telegram.module';
import { ScheduleModule } from '@nestjs/schedule';
import * as fs from 'fs-extra';
import * as path from 'path';

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
        APP_GEO_LAT: Joi.number().precision(6).required(),
        APP_GEO_LNG: Joi.number().precision(6).required(),
        APP_TIGER_USERNAME: Joi.string().required(),
        APP_TIGER_PASSWORD: Joi.string().required(),
        APP_TELEGRAM_API: Joi.string().required(),
      }),
    }),

    PuppeteerModule.forRootAsync({
      useClass: PuppeteerConfigService,
    }),
    TelegramModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    await fs.ensureDir(path.join(__dirname, '../uploads'));

    await fs.ensureDir(path.join(__dirname, '../screenshot'));
  }
}
