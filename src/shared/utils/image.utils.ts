import axios from 'axios';
import fs from 'fs';
import { Logger } from '../services/logger.service';

export const downloadImageFromUrl = (
  url: string,
  filePath: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        headers: {
          'User-Agent':
            'XSB/0.0 (https://JoseXS.github.io/; X@X.es) generic-library/0.0',
        },
      });
      resolve(response.data.pipe(fs.createWriteStream(filePath)));
    } catch (err) {
      Logger.error(err);
      reject(err);
    }
  });
};

export const bytesToSize = (bytes: number, decimals: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals <= 0 ? 0 : decimals || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
