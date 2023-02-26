import { type TipsValue } from './defineTmeplate';
import { type CreatorConext } from './creator';
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
export declare function printBanner(bannerConf: BannerConfig): Promise<void>;
export declare const logger: {
    error(...msg: string[]): void;
    wran(...msg: string[]): void;
    success(...msg: string[]): void;
    info(...msg: string[]): void;
};
/**
 * 通过 npm 下载模板
 * @param npmName
 * @param npmVerison
 * @param dir
 */
export declare const downloadFromNpm: (npmName: string, npmVerison: string | undefined, dir: string) => Promise<void>;
/**
 * 通过 git 下载
 */
export declare const downloadFromGit: () => Promise<void>;
export declare const processTip: (tip: TipsValue<string | string[]>, context: CreatorConext) => string | boolean | string[] | Promise<string | string[]>;
