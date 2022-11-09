import { log } from 'console';
import { DocsService } from './docs.service';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { parse } from 'csv-parse';
import { async } from 'rxjs';
import { readFileSync } from 'fs';

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
    const readStream = fs.createReadStream('uploads/100-contacts-homework.csv');
    const newArr = [];
    readStream
      .pipe(parse({ delimiter: ',', from_line: 2 }))
      .on('data', async (row) => {
        if (row[row.length - 1].endsWith('yahoo.com')) {
          newArr.push(row);
        }
      })
      .on('end', () => {
        const writeableStream = fs.createWriteStream(
          'filtered-documents/100-contacts-homework.csv',
        );
        writeableStream.write(
          'first_name,last_name,company_name,address,city,county,state,zip,phone1,phone,email\n',
        );

        newArr.map((element) => {
          const row = element.join(',');
          writeableStream.write(`${row}\n`);
        });
      });

    const filtredFile = readFileSync(
      'filtered-documents/100-contacts-homework.csv',
    ).toString();

    return filtredFile;
  }
}
