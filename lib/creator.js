"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const utils_1 = require("./utils");
class Creator {
    constructor(options) {
        this.dirname = options.dirname;
        this.dirPtah = path.resolve(process.cwd(), this.dirname);
        this.templateName = options.templateName;
        this.templates = options.templates;
        this.templatesDir = options.templatesDir;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.templateName) {
                yield this.selectTemplate();
            }
            yield fs.ensureDir(this.dirPtah);
            const isExist = yield fs.exists(this.dirPtah);
            if (isExist) {
                const { go } = yield inquirer_1.default.prompt({
                    type: 'confirm',
                    name: 'go',
                    message: 'The existing file in the current directory. Are you sure to continue?',
                    default: false,
                });
                if (!go)
                    process.exit(1);
            }
            this.createContext();
            yield this.callBeforeTask();
            yield this.generateProject();
            yield this.callAfterTask();
        });
    }
    selectTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultTemplate = this.templates[0];
            const answer = yield inquirer_1.default.prompt({
                type: 'list',
                name: 'template',
                loop: false,
                message: 'Please select a template',
                default: defaultTemplate,
                choices: this.templates.map((item) => {
                    return {
                        name: item.description,
                        value: item.name,
                    };
                }),
            });
            this.templateName = answer.template;
            const templateConfig = this.templates.find(({ name }) => name === this.templateName);
            if (!templateConfig) {
                utils_1.logger.error('Template selection exception');
                process.exit(-1);
            }
            this.templateConfig = templateConfig;
        });
    }
    generateProject() {
        return __awaiter(this, void 0, void 0, function* () {
            utils_1.logger.info('Project is being created...');
            const { type } = this.templateConfig;
            switch (type) {
                case 'local':
                    yield this.installLocalTemplate();
                    break;
                case 'git':
                    yield this.downloadTemplate();
                    break;
            }
            console.log(' ');
            utils_1.logger.success('Project initialization completed');
        });
    }
    createContext() {
        this.context = {
            dirname: this.dirname,
            dirPtah: this.dirPtah,
            logger: utils_1.logger,
        };
    }
    callBeforeTask() {
        return __awaiter(this, void 0, void 0, function* () {
            const { beforeTask } = this.templateConfig;
            if (beforeTask) {
                yield beforeTask(this.context);
            }
        });
    }
    callAfterTask() {
        return __awaiter(this, void 0, void 0, function* () {
            const { afterTask } = this.templateConfig;
            if (afterTask) {
                yield afterTask(this.context);
            }
        });
    }
    installLocalTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = this.templateConfig;
            const templateDir = path.resolve(this.templatesDir, name);
            console.log(templateDir);
            console.log(this.dirPtah);
            yield fs.copy(templateDir, this.dirPtah);
        });
    }
    downloadTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: 待实现
        });
    }
}
exports.default = Creator;
//# sourceMappingURL=creator.js.map