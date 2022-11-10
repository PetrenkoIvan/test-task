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

    const filtredFile = readFile(
      './filtered-documents/100-contacts-homework.csv',
      { encoding: 'utf8' },
    );

    return filtredFile;
  }
}
