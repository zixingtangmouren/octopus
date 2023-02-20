/**
 * 输出 banner
 * @param banner
 * @param color
 */
export declare function printBanner(banner: string, color?: string): Promise<void>;
export declare const logger: {
    error(...msg: string[]): void;
    wran(...msg: string[]): void;
    success(...msg: string[]): void;
    info(...msg: string[]): void;
};
