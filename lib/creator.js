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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const utils_1 = require("./utils");
const constant_1 = require("./constant");
class Creator {
    dirname;
    templateName;
    templates;
    dirPtah;
    templateConfig;
    templatesDir;
    context;
    constructor(options) {
        this.dirname = options.dirname;
        this.dirPtah = path.resolve(process.cwd(), this.dirname);
        this.templateName = options.templateName;
        this.templates = options.templates;
        this.templatesDir = options.templatesDir;
    }
    async run() {
        await this.selectTemplate();
        await this.checkTargetDir();
        this.createContext();
        await this.callBeforeTask();
        await this.generateProject();
        await this.callAfterTask();
        this.endPrompt();
    }
    async selectTemplate() {
        const defaultTemplate = this.templates[0];
        if (!this.templateName) {
            const answer = await inquirer_1.default.prompt({
                type: 'list',
                name: 'template',
                loop: false,
                message: 'Please select a template',
                default: defaultTemplate.name,
                choices: this.templates.map((item) => {
                    return {
                        name: item.description,
                        value: item.name,
                    };
                }),
            });
            this.templateName = answer.template;
        }
        const templateConfig = this.templates.find(({ name }) => name === this.templateName);
        if (!templateConfig) {
            utils_1.logger.error('Template selection exception');
            process.exit(constant_1.ERROR_CODE.TEMPLATE_DOES_NOT_EXIST);
        }
        this.templateConfig = templateConfig;
    }
    async checkTargetDir() {
        const isExist = await fs.exists(this.dirPtah);
        if (isExist) {
            const files = await fs.readdir(this.dirPtah);
            if (files.length > 0) {
                const { go } = await inquirer_1.default.prompt({
                    type: 'confirm',
                    name: 'go',
                    message: 'The existing file in the current directory. Are you sure to continue?',
                    default: false,
                });
                if (!go)
                    process.exit(1);
            }
        }
    }
    async generateProject() {
        utils_1.logger.info('Project is being created...');
        const { type } = this.templateConfig;
        switch (type) {
            case 'local':
                await this.installLocalTemplate();
                break;
            case 'git':
                await this.downloadTemplateFromGit();
                break;
            case 'npm':
                await this.downloadTemplateFromNpm();
        }
        console.log(' ');
        utils_1.logger.success('Project initialization completed');
    }
    createContext() {
        this.context = {
            dirname: this.dirname,
            dirPtah: this.dirPtah,
            templateName: this.templateName,
            logger: utils_1.logger,
        };
    }
    async callBeforeTask() {
        const { beforeTask } = this.templateConfig;
        if (beforeTask) {
            await beforeTask(this.context);
        }
    }
    async callAfterTask() {
        const { afterTask } = this.templateConfig;
        if (afterTask) {
            await afterTask(this.context);
        }
    }
    endPrompt() {
        console.log(' ');
        let tipsList = [`cd ${this.dirname}`, 'npm install', 'npm run start'];
        const { tips } = this.templateConfig;
        if (tips !== false) {
            if (typeof tips === 'function') {
                tipsList = tips(this.context);
            }
            else if (Array.isArray(tips)) {
                tipsList = tips;
            }
            tipsList.forEach((tips) => {
                utils_1.logger.success(`  ${tips}`);
            });
            console.log(' ');
        }
    }
    /**
     * 本地模板
     */
    async installLocalTemplate() {
        if (this.templatesDir) {
            const { name } = this.templateConfig;
            const templateDir = path.resolve(this.templatesDir, name);
            await fs.copy(templateDir, this.dirPtah);
        }
        else {
            utils_1.logger.error('Local template path exception');
        }
    }
    async downloadTemplateFromGit() {
        // TODO: 待实现
    }
    /**
     * npm 形式下载模板
     */
    async downloadTemplateFromNpm() {
        const { path: npmPath } = this.templateConfig;
        if (!npmPath) {
            utils_1.logger.error('The path parameter must be configured for downloading in the form of npm');
            process.exit(-1);
        }
        const [npmName, version] = npmPath.split('#');
        try {
            await (0, utils_1.downloadFromNpm)(npmName, version, this.dirPtah);
        }
        catch (error) {
            utils_1.logger.error('Failed to download via npm');
            process.exit(-1);
        }
    }
}
exports.default = Creator;
//# sourceMappingURL=creator.js.map