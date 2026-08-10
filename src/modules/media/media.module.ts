import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';
import { existsSync, mkdirSync } from 'fs';
import { MediaController } from './media.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (c: ConfigService) => {
        const base = c.get<string>('UPLOAD_DIR', 'uploads');
        if (!existsSync(base)) mkdirSync(base, { recursive: true });
        return {
          storage: diskStorage({
            destination: (req, file, cb) => {
              try {
                const sub = guessBucket(file.mimetype);
                const dir = join(process.cwd(), base, sub);
                if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
                cb(null, dir);
              } catch (e) {
                cb(e, '');
              }
            },
            filename: (req, file, cb) => {
              try {
                const ext = file.originalname ? extname(file.originalname) : '';
                cb(null, `${uuid()}${ext}`);
              } catch (e) {
                cb(e, '');
              }
            },
          }),
          limits: { fileSize: +c.get('MAX_FILE_SIZE', 10485760) }, // 10MB default
        };
      },
    }),
  ],
  controllers: [MediaController],
})
export class MediaModule {}

function guessBucket(mime?: string) {
  if (!mime) return 'documents';
  if (mime.startsWith('image/')) return 'images';
  if (mime.startsWith('video/')) return 'videos';
  if (mime.startsWith('audio/')) return 'voice';
  return 'documents';
}