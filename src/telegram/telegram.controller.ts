import { Controller, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import { Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs-extra';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly configService: ConfigService) {}
  @Post('webhook')
  @UseInterceptors(FileInterceptor('file'))
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const telegramApiToken = this.configService.get<string>('APP_TELEGRAM_API');
    const body = req.body;

    if (body.message && body.message.photo) {
      const caption = body.message.caption || '';

      const fileId = body.message.photo[body.message.photo.length - 1].file_id;

      const response = await axios.get(
        `https://api.telegram.org/bot${telegramApiToken}/getFile?file_id=${fileId}`,
      );

      const filePath = response.data.result.file_path;
      const fileUrl = `https://api.telegram.org/file/bot${telegramApiToken}/${filePath}`;

      const fileResponse = await axios.get(fileUrl, { responseType: 'stream' });
      const saveDir = path.join(__dirname, '../../uploads');
      await fs.ensureDir(saveDir);
      const saveFilename = `${caption}${path.extname(filePath)}`;
      const savePath = path.join(saveDir, saveFilename);
      const writer = fs.createWriteStream(savePath);

      fileResponse.data.pipe(writer);

      writer.on('finish', () => console.log(`File saved to ${savePath}`));
      writer.on('error', (err) => console.error(`Error saving file: ${err}`));
    }

    res.status(200).send('OK');
  }
}
