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
const utils_1 = require("./utils");
const commander_1 = require("commander");
const creator_1 = __importDefault(require("./creator"));
function createOctopus(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, version, description, templates, templatesDir } = options;
        yield (0, utils_1.printBanner)(name);
        const program = new commander_1.Command();
        program.name(name).version(version).description(description).usage('<command> [options]');
        // 模板选择参数
        program.option('-t, --template <templateName>', 'select the template you need');
        program.on('--help', () => {
            console.log('');
            console.log('Examples:');
            console.log(`  $ npm init ${name}`);
            templates.forEach(({ name: templateName }) => {
                console.log(`  $ npm init ${name} --template ${templateName}`);
            });
            console.log('');
            console.log(`  $ npm init ${name} your-project-name`);
            templates.forEach(({ name: templateName }) => {
                console.log(`  $ npm init ${name} your-project-name --template ${templateName}`);
            });
            process.exit(0);
        });
        program.parse(process.argv);
        const dirname = program.args[0] ? program.args[0] : '.';
        const opts = program.opts();
        const templateName = opts.template ? opts.template : program.args[1];
        console.log(`create-${name} version:`, version);
        console.log(`create-${name} args`, dirname, templateName);
        new creator_1.default({
            dirname,
            templateName,
            templates,
            templatesDir,
        }).run();
    });
}
exports.default = createOctopus;
//# sourceMappingURL=createOctopus.js.map