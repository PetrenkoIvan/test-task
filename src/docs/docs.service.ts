import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import { readFile } from 'node:fs/promises';

@Injectable()
export class DocsService {
  async filter(file) {
    if (!file) {
      throw new HttpException(
        'You have not uploaded a file',
        HttpStatus.BAD_REQUEST,
      );
    }
    const readStream = fs.createReadStream('uploads/100-contacts-homework.csv');
    const writeStream = fs.createWriteStream(
      'filtered-documents/100-contacts-homework.csv',
    );

    writeStream.write(
      'first_name,last_name,company_name,address,city,county,state,zip,phone1,phone,email\n',
    );

    readStream
      .pipe(parse({ delimiter: ',', from_line: 2 }))
      .on('data', async (row) => {
        if (row[row.length - 1].endsWith('yahoo.com')) {
          writeStream.write(`${row.join(',')}\n`);
          return row;
        }
      })
      .on('end', () => {
        return fs.createReadStream(
          'filtered-documents/100-contacts-homework.csv',
        );
      });
  }
}
