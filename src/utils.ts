import figlet from 'figlet';
import { getNpmTarball, getAndExtractTarball, getLatestVersion } from 'ice-npm-utils';
import gradient from 'gradient-string';
import { type TipsValue } from './defineTmeplate.js';
import { type CreatorConext } from './creator.js';

export interface BannerConfig {
  type: 'text' | 'block';
  color: string;
  value: string;
}

/**
 * 输出 value
 * @param banner
 * @param color
 */
export async function printBanner(bannerConf: BannerConfig) {
  console.clear();

  const { type, color, value } = bannerConf;

  const colors = color.split('-');

  let data: string;
  switch (type) {
    case 'block':
      data = await new Promise((resolve, reject) => {
        figlet(value, (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(data as string);
        });
      });
      break;
    case 'text':
      data = value;
      break;
  }
  console.log(' ');
  console.log(gradient(colors.length > 1 ? colors : [colors[0], colors[0]])(data));
  console.log(' ');
}

export const logger = {
  error(...msg: string[]) {
    console.log(gradient('red', 'red')(...msg));
  },
  wran(...msg: string[]) {
    console.log(gradient('red', 'red')(...msg));
  },
  success(...msg: string[]) {
    console.log(gradient('#58bc58', '#58bc58')(...msg));
  },
  info(...msg: string[]) {
    console.log(gradient('cyan', 'cyan')(...msg));
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

/**
 * 通过 git 下载
 */
export const downloadFromGit = async () => {
  //
};

export const processTip = (tip: TipsValue<string | string[]>, context: CreatorConext) => {
  if (typeof tip === 'function') {
    return tip(context);
  }

  return tip;
};
