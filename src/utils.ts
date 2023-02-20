import figlet from 'figlet';
import chalk from 'chalk';

/**
 * 输出 banner
 * @param banner
 * @param color
 */
export async function printBanner(banner: string, color: string = '#58bc58') {
  console.clear();
  const data = await new Promise((resolve, reject) => {
    figlet(banner, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });

  console.log(chalk.hex(color)(data));
}

export const logger = {
  error(...msg: string[]) {
    console.log(chalk.redBright(...msg));
  },
  wran(...msg: string[]) {
    console.log(chalk.redBright(...msg));
  },
  success(...msg: string[]) {
    console.log(chalk.greenBright(...msg));
  },
  info(...msg: string[]) {
    console.log(chalk.cyanBright(...msg));
  },
};
