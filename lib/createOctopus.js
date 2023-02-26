"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const commander_1 = require("commander");
const creator_1 = __importDefault(require("./creator"));
async function createOctopus(options) {
    const { name, version, description, templates, templatesDir, banner: bannerConf } = options;
    await (0, utils_1.printBanner)({ type: 'block', color: '#58bc58-#00FFFF', value: name, ...bannerConf });
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
        args: process.argv.slice(2),
    }).run();
}
exports.default = createOctopus;
//# sourceMappingURL=createOctopus.js.map