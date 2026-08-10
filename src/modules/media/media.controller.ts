import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';

@Controller('media')
export class MediaController {
  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const proto = req.protocol;
    const host = req.get('host');
    const sub = file.destination.split(/[\\/]/).pop();
    const url = `${proto}://${host}/uploads/${sub}/${file.filename}`;
    return {
      url,
      path: `/uploads/${sub}/${file.filename}`,
      mime_type: file.mimetype,
      size: file.size,
      original_name: file.originalname,
      bucket: sub,
    };
  }
}