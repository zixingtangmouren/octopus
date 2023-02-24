import figlet from 'figlet';
import chalk from 'chalk';
import { getNpmTarball, getAndExtractTarball, getLatestVersion } from 'ice-npm-utils';

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

/**
 * 通过 npm 下载模板
 * @param npmName
 * @param npmVerison
 * @param dir
 */
export const downloadFromNpm = async (npmName: string, npmVerison: string = 'latest', dir: string) => {
  let version: string = npmVerison;
  if (npmVerison === 'latest') {
    version = await getLatestVersion(npmName);
  }

  const tarball = await getNpmTarball(npmName, version);

  await getAndExtractTarball(dir, tarball);
};
