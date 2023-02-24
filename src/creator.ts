import * as fs from 'fs-extra';
import { type TemplateConfig, type CreatorConext } from './defineTmeplate';
import * as path from 'path';
import inquirer from 'inquirer';
import { downloadFromNpm, logger } from './utils';
import { ERROR_CODE } from './constant';

interface CreatorOptions {
  // 创建目录
  dirname: string;
  // 选择的模板
  templateName?: string;
  // 模板配置表
  templates: TemplateConfig[];
  // 本地模板的绝对路径
  templatesDir?: string;
}

export default class Creator {
  private readonly dirname: string;
  private templateName?: string;
  private readonly templates: TemplateConfig[];
  private readonly dirPtah: string;
  private templateConfig!: TemplateConfig;
  private readonly templatesDir?: string;

  private context!: CreatorConext;

  constructor(options: CreatorOptions) {
    this.dirname = options.dirname;
    this.dirPtah = path.resolve(process.cwd(), this.dirname);
    this.templateName = options.templateName;
    this.templates = options.templates;
    this.templatesDir = options.templatesDir;
  }

  public async run() {
    await this.selectTemplate();
    await this.checkTargetDir();
    this.createContext();
    await this.callBeforeTask();
    await this.generateProject();
    await this.callAfterTask();

    this.endPrompt();
  }

  private async selectTemplate() {
    const defaultTemplate = this.templates[0];

    if (!this.templateName) {
      const answer = await inquirer.prompt({
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

      this.templateName = answer.template as string;
    }

    const templateConfig = this.templates.find(({ name }) => name === this.templateName);

    if (!templateConfig) {
      logger.error('Template selection exception');
      process.exit(ERROR_CODE.TEMPLATE_DOES_NOT_EXIST);
    }

    this.templateConfig = templateConfig;
  }

  private async checkTargetDir() {
    const isExist = await fs.exists(this.dirPtah);

    if (isExist) {
      const files = await fs.readdir(this.dirPtah);

      if (files.length > 0) {
        const { go } = await inquirer.prompt({
          type: 'confirm',
          name: 'go',
          message: 'The existing file in the current directory. Are you sure to continue?',
          default: false,
        });
        if (!go) process.exit(1);
      }
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
        await this.downloadTemplateFromGit();
        break;
      case 'npm':
        await this.downloadTemplateFromNpm();
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

  private endPrompt() {
    console.log(' ');
    let tipsList: string[] = [`cd ${this.dirname}`, 'npm install', 'npm run start'];
    const { tips } = this.templateConfig;
    if (tips !== false) {
      if (typeof tips === 'function') {
        tipsList = tips(this.context);
      } else if (Array.isArray(tips)) {
        tipsList = tips;
      }
      tipsList.forEach((tips) => {
        logger.success(`  ${tips}`);
      });

      console.log(' ');
    }
  }

  /**
   * 本地模板
   */
  private async installLocalTemplate() {
    if (this.templatesDir) {
      const { name } = this.templateConfig;
      const templateDir = path.resolve(this.templatesDir, name);
      await fs.copy(templateDir, this.dirPtah);
    } else {
      logger.error('Local template path exception');
    }
  }

  private async downloadTemplateFromGit() {
    // TODO: 待实现
  }

  /**
   * npm 形式下载模板
   */
  private async downloadTemplateFromNpm() {
    const { path: npmPath } = this.templateConfig;

    if (!npmPath) {
      logger.error('The path parameter must be configured for downloading in the form of npm');
      process.exit(-1);
    }

    const [npmName, version] = npmPath.split('#');

    try {
      await downloadFromNpm(npmName, version, this.dirPtah);
    } catch (error) {
      logger.error('Failed to download via npm');
      process.exit(-1);
    }
  }
}
