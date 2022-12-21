import axios from 'axios';
import fs from 'fs';

export const downloadImageFromUrl = async (
  url: string,
  filepath: string
): Promise<string> => {
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream',
    headers: {
      'User-Agent': 'XSB/0.0 (https://X.es; X@X.es) generic-library/0.0',
    },
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filepath))
      .on('error', reject)
      .once('close', () => resolve(filepath));
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
