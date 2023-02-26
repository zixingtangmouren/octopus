"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTip = exports.downloadFromGit = exports.downloadFromNpm = exports.logger = exports.printBanner = void 0;
const figlet_1 = __importDefault(require("figlet"));
const ice_npm_utils_1 = require("ice-npm-utils");
const gradient_string_1 = __importDefault(require("gradient-string"));
/**
 * 输出 value
 * @param banner
 * @param color
 */
async function printBanner(bannerConf) {
    console.clear();
    const { type, color, value } = bannerConf;
    const colors = color.split('-');
    let data;
    switch (type) {
        case 'block':
            data = await new Promise((resolve, reject) => {
                (0, figlet_1.default)(value, (err, data) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(data);
                });
            });
            break;
        case 'text':
            data = value;
            break;
    }
    console.log(' ');
    console.log((0, gradient_string_1.default)(colors.length > 1 ? colors : [colors[0], colors[0]])(data));
    console.log(' ');
}
exports.printBanner = printBanner;
exports.logger = {
    error(...msg) {
        console.log((0, gradient_string_1.default)('red', 'red')(...msg));
    },
    wran(...msg) {
        console.log((0, gradient_string_1.default)('red', 'red')(...msg));
    },
    success(...msg) {
        console.log((0, gradient_string_1.default)('#58bc58', '#58bc58')(...msg));
    },
    info(...msg) {
        console.log((0, gradient_string_1.default)('cyan', 'cyan')(...msg));
    },
};
/**
 * 通过 npm 下载模板
 * @param npmName
 * @param npmVerison
 * @param dir
 */
const downloadFromNpm = async (npmName, npmVerison = 'latest', dir) => {
    let version = npmVerison;
    if (npmVerison === 'latest') {
        version = await (0, ice_npm_utils_1.getLatestVersion)(npmName);
    }
    const tarball = await (0, ice_npm_utils_1.getNpmTarball)(npmName, version);
    await (0, ice_npm_utils_1.getAndExtractTarball)(dir, tarball);
};
exports.downloadFromNpm = downloadFromNpm;
/**
 * 通过 git 下载
 */
const downloadFromGit = async () => {
    //
};
exports.downloadFromGit = downloadFromGit;
const processTip = (tip, context) => {
    if (typeof tip === 'function') {
        return tip(context);
    }
    return tip;
};
exports.processTip = processTip;
//# sourceMappingURL=utils.js.map