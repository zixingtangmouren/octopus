"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.printBanner = void 0;
const figlet_1 = __importDefault(require("figlet"));
const chalk_1 = __importDefault(require("chalk"));
/**
 * 输出 banner
 * @param banner
 * @param color
 */
function printBanner(banner, color = '#58bc58') {
    return __awaiter(this, void 0, void 0, function* () {
        console.clear();
        const data = yield new Promise((resolve, reject) => {
            (0, figlet_1.default)(banner, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
        console.log(chalk_1.default.hex(color)(data));
    });
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
//# sourceMappingURL=utils.js.map