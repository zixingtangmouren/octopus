import * as fs from 'fs-extra';
import { type TemplateConfig, type CreatorConext } from './defineTmeplate';
import * as path from 'path';
import inquirer from 'inquirer';
import { logger } from './utils';

interface CreatorOptions {
  dirname: string;
  templateName?: string;
  templates: TemplateConfig[];
  templatesDir: string;
}

export default class Creator {
  private readonly dirname: string;
  private templateName?: string;
  private readonly templates: TemplateConfig[];
  private readonly dirPtah: string;
  private templateConfig!: TemplateConfig;
  private readonly templatesDir: string;

  private context!: CreatorConext;

  constructor(options: CreatorOptions) {
    this.dirname = options.dirname;
    this.dirPtah = path.resolve(process.cwd(), this.dirname);
    this.templateName = options.templateName;
    this.templates = options.templates;
    this.templatesDir = options.templatesDir;
  }

  public async run() {
    if (!this.templateName) {
      await this.selectTemplate();
    }

    await this.checkTargetDir();

    this.createContext();
    await this.callBeforeTask();
    await this.generateProject();
    await this.callAfterTask();
  }

  private checkDir() {
    // 检测是否为空目录，创建目录
  }

  private async selectTemplate() {
    const defaultTemplate = this.templates[0];

    const answer = await inquirer.prompt({
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

    this.templateName = answer.template as string;
    const templateConfig = this.templates.find(({ name }) => name === this.templateName);

    if (!templateConfig) {
      logger.error('Template selection exception');
      process.exit(-1);
    }

    this.templateConfig = templateConfig;
  }

  private async checkTargetDir() {
    const isExist = await fs.exists(this.dirPtah);
    const files = await fs.readdir(this.dirPtah);

    if (isExist && files.length > 0) {
      const { go } = await inquirer.prompt({
        type: 'confirm',
        name: 'go',
        message: 'The existing file in the current directory. Are you sure to continue?',
        default: false,
      });
      if (!go) process.exit(1);
    }
  }

  private async generateProject() {
    logger.info('Project is being created...');

    const { type } = this.templateConfig;

    switch (type) {
      case 'local':
        await this.installLocalTemplate();
        break;
      case 'git':
        await this.downloadTemplate();
        break;
    }

    console.log(' ');
    logger.success('Project initialization completed');
  }

  private createContext() {
    this.context = {
      dirname: this.dirname,
      dirPtah: this.dirPtah,
      templateName: this.templateName,
      logger,
    };
  }

  private async callBeforeTask() {
    const { beforeTask } = this.templateConfig;

    if (beforeTask) {
      await beforeTask(this.context);
    }
  }

  private async callAfterTask() {
    const { afterTask } = this.templateConfig;

    if (afterTask) {
      await afterTask(this.context);
    }
  }

  private async installLocalTemplate() {
    const { name } = this.templateConfig;
    const templateDir = path.resolve(this.templatesDir, name);
    await fs.copy(templateDir, this.dirPtah);
  }

  private async downloadTemplate() {
    // TODO: 待实现
  }
}
