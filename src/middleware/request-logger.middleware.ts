import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import * as util from 'util';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, path: url } = req;
    const userAgent = req.get('user-agent') || '';
    res.on('finish', () => {
      const statusCode = res.statusCode;

      const contentLength = res.get('content-length');
      if (statusCode === 401 || statusCode === 404 || statusCode === 405) {
        this.logger.warn(
          `[${method}] ${req.url} ${statusCode} ${contentLength}ms - ${userAgent} ${ip} params: ${JSON.stringify(
            req.params,
          )} query: ${JSON.stringify(req.query)} body: ${JSON.stringify(req.body)}`,
        );
      } else {
        this.logger.log(
          `[${method}] ${req.url} ${statusCode} ${contentLength}ms - ${userAgent} ${ip} params: ${JSON.stringify(
            req.params,
          )} query: ${JSON.stringify(req.query)} body: ${JSON.stringify(req.body)}`,
        );
      }
    });

    next();
  }
}
