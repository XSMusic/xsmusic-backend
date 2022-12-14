import moment from 'moment';
import * as os from 'os';
import { exec, execFile, fork, spawn } from 'child_process';

export class SystemService {
  async getResume() {
    try {
      const freeMemory = this.bytesToSize(os.freemem());
      const totalMemory = this.bytesToSize(os.totalmem());
      const upTime = moment(moment().unix() * 1000)
        .locale('es')
        .fromNow();

      const hdd = await this.hdd();
      return {
        memory: {
          value: `${freeMemory}/${totalMemory}`,
          percentage: `${(Number(os.freemem) / Number(os.totalmem)).toFixed(
            2
          )}%`,
        },
        upTime,
        hdd,
      };
    } catch (e) {
      return e;
    }
  }

  private bytesToSize(bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    const i = Number(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }

  hdd() {
    return new Promise((resolve, reject) => {
      exec('df -k', (error, stdout) => {
        if (error) {
          reject();
        }
        let total = 0;
        let used = 0;
        let free = 0;
        const lines = stdout.split('\n');
        const str_disk_info = lines[1].replace(/[\s\n\r]+/g, ' ');
        const disk_info = str_disk_info.split(' ');
        total = Math.ceil((Number(disk_info[1]) * 1024) / Math.pow(1024, 2));
        used = Math.ceil((Number(disk_info[2]) * 1024) / Math.pow(1024, 2));
        free = Math.ceil((Number(disk_info[3]) * 1024) / Math.pow(1024, 2));
        console.log({ total, free, used });
        resolve({ total, free, used });
      });
    });
  }
}
