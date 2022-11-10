import { DocsService } from './docs.service';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('docs')
export class DocsController {
  constructor(private docsService: DocsService) {}

  @Post('/import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          callback(null, `${name}${fileExtName}`);
        },
      }),
    }),
  )
  async docFilter(@UploadedFile() file: Express.Multer.File) {
    const result = this.docsService.filter(file);
    return result;
  }
}
