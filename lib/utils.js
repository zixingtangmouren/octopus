"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFromNpm = exports.logger = exports.printBanner = void 0;
const figlet_1 = __importDefault(require("figlet"));
const chalk_1 = __importDefault(require("chalk"));
const ice_npm_utils_1 = require("ice-npm-utils");
/**
 * 输出 banner
 * @param banner
 * @param color
 */
async function printBanner(banner, color = '#58bc58') {
    console.clear();
    const data = await new Promise((resolve, reject) => {
        (0, figlet_1.default)(banner, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
    console.log(chalk_1.default.hex(color)(data));
}
exports.printBanner = printBanner;
exports.logger = {
    error(...msg) {
        console.log(chalk_1.default.redBright(...msg));
    },
    wran(...msg) {
        console.log(chalk_1.default.redBright(...msg));
    },
    success(...msg) {
        console.log(chalk_1.default.greenBright(...msg));
    },
    info(...msg) {
        console.log(chalk_1.default.cyanBright(...msg));
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
//# sourceMappingURL=utils.js.map