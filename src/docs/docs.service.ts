import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import { resolve } from 'path';

@Injectable()
export class DocsService {
  async filter(file) {
    if (!file) {
      throw new HttpException(
        'You have not uploaded a file',
        HttpStatus.BAD_REQUEST,
      );
    }
    const uploadPath = 'uploads/100-contacts-homework.csv';
    const filtrPath = 'filtered-documents/100-contacts-homework.csv';
    const readStream = fs.createReadStream(`${uploadPath}`);
    const writeStream = fs.createWriteStream(`${filtrPath}`);
    let dataFile = '';

    writeStream.write(
      'first_name,last_name,company_name,address,city,county,state,zip,phone1,phone,email\n',
    );

    const result = await new Promise((resolve) => {
      readStream
        .pipe(parse({ delimiter: ',', from_line: 2 }))
        .on('data', async (row) => {
          if (row[row.length - 1].endsWith('yahoo.com')) {
            writeStream.write(`${row.join(',')}\n`);
            dataFile = dataFile + `${row.join(',')}\n`;
          }
        })
        .on('end', () => resolve(dataFile));
    });

    return result;
  }
}
