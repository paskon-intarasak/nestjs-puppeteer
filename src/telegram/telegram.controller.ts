import {
  BadRequestException,
  Controller,
  Logger,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs-extra';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';
import fetch from 'node-fetch';

@Controller('telegram')
export class TelegramController {
  private readonly logger = new Logger(TelegramController.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  @Post('webhook')
  @UseInterceptors(FileInterceptor('file'))
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    try {
      const telegramApiToken =
        this.configService.get<string>('APP_TELEGRAM_API');
      const body = req.body;

      if (body.message && body.message.photo) {
        const caption = body.message.caption || '';

        const fileId =
          body.message.photo[body.message.photo.length - 1].file_id;

        const responseFilePath = await fetch(
          `https://api.telegram.org/bot${telegramApiToken}/getFile?file_id=${fileId}`,
        );
        const filePathData: any = await responseFilePath.json();
        const filePath = filePathData.result.file_path;

        // Download the file using the file path
        const url = `https://api.telegram.org/file/bot${telegramApiToken}/${filePath}`;
        const response = await fetch(url);

        // Create a write stream to save the file to disk
        const saveFilename = `${caption}${path.extname(filePath)}`;
        const fileStream = fs.createWriteStream(
          path.join(__dirname, '../../uploads', saveFilename),
        );
        await new Promise((resolve, reject) => {
          response.body.pipe(fileStream);
          response.body.on('error', reject);
          fileStream.on('finish', resolve);
        });

        // const response = await axios.default.get(
        //   `https://api.telegram.org/bot${telegramApiToken}/getFile?file_id=${fileId}`,
        // );

        // const response = await lastValueFrom(
        //   this.httpService
        //     .get(
        //       `https://api.telegram.org/bot${telegramApiToken}/getFile?file_id=${fileId}`,
        //     )
        //     .pipe(
        //       catchError((errors: AxiosError) => {
        //         throw new BadRequestException();
        //       }),
        //       map((resp) => resp.data),
        //     ),
        // );
        // console.log('console log', response);

        // const filePath = response.data.result.file_path;
        // const fileUrl = `https://api.telegram.org/file/bot${telegramApiToken}/${filePath}`;

        // const fileResponse = await axios.default.get(fileUrl, {
        //   responseType: 'stream',
        // });

        // const fileResponse = await lastValueFrom(
        //   this.httpService
        //     .get(fileUrl, {
        //       responseType: 'stream',
        //     })
        //     .pipe(
        //       catchError((errors: AxiosError) => {
        //         throw new BadRequestException();
        //       }),
        //       map((resp) => {
        //         console.log('resp.data2', resp.data);
        //         return resp.data;
        //       }),
        //     ),
        // );

        // console.log('fileResponse', fileResponse);

        // const saveDir = path.join(__dirname, '../../uploads');
        // await fs.ensureDir(saveDir);
        // const saveFilename = `${caption}${path.extname(filePath)}`;
        // const savePath = path.join(saveDir, saveFilename);
        // const writer = fs.createWriteStream(savePath);

        // fileResponse.data.pipe(writer);

        // writer.on('finish', () => console.log(`File saved to ${savePath}`));
        // writer.on('error', (err) => console.error(`Error saving file: ${err}`));
      }

      res.status(200).send('OK');
    } catch (err) {
      console.error(err);
    }
  }
}
