import {
  Logger,
  MiddlewareConsumer,
  Module,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InjectBrowser, PuppeteerModule } from 'nestjs-puppeteer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PuppeteerConfigService } from './config/puppeteer.config';
import { Browser } from 'puppeteer';
import * as Joi from 'joi';
import { RequestLoggerMiddleware } from './middleware/request.logger';

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
        APP_WEB_URL: Joi.string().required(),
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
  private logger = new Logger(AppModule.name);
  constructor(@InjectBrowser() private readonly browser: Browser) {}

  // You can implement on init here
  async onModuleInit() {
    this.logger.error('Appmodule on Init');
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
