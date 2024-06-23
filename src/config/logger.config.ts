import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const loggerConfig = (appName: string, logtailToken: string) => {
  const logtail = new Logtail(logtailToken);
  const logtailFormat = winston.format((info) => {
    info.appName = appName;
    return info;
  });

  return WinstonModule.createLogger({
    transports: [
      // file on daily rotation (error only)
      new winston.transports.DailyRotateFile({
        filename: `logs/%DATE%-error.log`,
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false, // don't want to zip our logs
        maxFiles: '30d', // will keep log until they are older than 30 days
      }),
      // same for all levels
      new winston.transports.DailyRotateFile({
        filename: `logs/%DATE%-combined.log`,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxFiles: '30d',
      }),
      new winston.transports.Console({
        level: 'silly',
        format: winston.format.combine(
          winston.format.errors({ stack: true }),
          winston.format.cli(),
          winston.format.splat(),
          winston.format.timestamp(),
          winston.format.printf(
            ({ level, message, context, timestamp, stack, trace }) => {
              return `${timestamp} [${appName}] [${context || 'App'}] ${level}: ${message} ${stack ? stack : ''} ${trace ? trace : ''}`;
            },
          ),
        ),
      }),
      new LogtailTransport(logtail, {
        level: 'silly',
        format: winston.format.combine(logtailFormat(), winston.format.json()),
      }),
    ],
  });
};
