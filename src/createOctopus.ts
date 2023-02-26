import { type TemplateConfig } from './defineTmeplate';
import { type BannerConfig, printBanner } from './utils';
import { Command } from 'commander';
import Creator from './creator';

interface CreateOctopusOptions {
  name: string;
  version: string;
  banner?: BannerConfig;
  description: string;
  templatesDir?: string;
  templates: TemplateConfig[];
}

export default async function createOctopus(options: CreateOctopusOptions) {
  const { name, version, description, templates, templatesDir, banner: bannerConf } = options;

  await printBanner({ type: 'block', color: '#58bc58-#00FFFF', value: name, ...bannerConf });

  const program = new Command();

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

  const dirname: string = program.args[0] ? program.args[0] : '.';
  const opts = program.opts();

  const templateName: string = opts.template ? opts.template : program.args[1];

  console.log(`create-${name} version:`, version);
  console.log(`create-${name} args`, dirname, templateName);

  new Creator({
    dirname,
    templateName,
    templates,
    templatesDir,
    args: process.argv.slice(2),
  }).run();
}
