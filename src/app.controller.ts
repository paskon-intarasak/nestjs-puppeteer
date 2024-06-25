import { Controller, Get, Logger, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  async getAll() {
    this.logger.log('Get All Bruh');
    return 'Ok';
  }

  @Get('title')
  async getHello() {
    console.log('Hello Matafaka');
    return await this.appService.getTitle();
  }

  @Get('describe-env')
  async getEnv() {
    const getNodeEnv = this.configService.get<string>('NODE_ENV');
    const getAppName = this.configService.get<string>('APP_NAME');
    const getAppPort = this.configService.get<number>('APP_PORT');
    const getWebUrl = this.configService.get<number>('APP_WEB_URL');

    return { getNodeEnv, getAppName, getAppPort, getWebUrl };
  }
}
