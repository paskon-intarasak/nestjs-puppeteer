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
        APP_DEEP_SECRET_ONE: Joi.string().required(),
        APP_DEEP_SECRET_TWO: Joi.string().required(),
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
    console.log(`The module has been initialized.`);
  }
}
