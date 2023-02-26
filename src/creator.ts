import * as fs from 'fs-extra';
import { type TemplateConfig } from './defineTmeplate';
import * as path from 'path';
import inquirer from 'inquirer';
import { downloadFromNpm, logger, processTip, downloadFromGit } from './utils';
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
  args: string[];
}

type ModifyFileContent = (filepath: string, callback: (content: string) => string | Promise<string>) => Promise<void>;

export interface CreatorConext {
  dirname: string;
  dirPtah: string;
  logger: typeof logger;
  [key: string]: any;
  templateConfig: TemplateConfig;
  modifyFileContent: ModifyFileContent;
}

export default class Creator {
  private readonly dirname: string;
  private templateName?: string;
  private readonly templates: TemplateConfig[];
  private readonly dirPtah: string;
  private templateConfig!: TemplateConfig;
  private readonly templatesDir?: string;
  private readonly args?: string[];

  private context!: CreatorConext;

  constructor(options: CreatorOptions) {
    this.dirname = options.dirname;
    this.dirPtah = path.resolve(process.cwd(), this.dirname);
    this.templateName = options.templateName;
    this.templates = options.templates;
    this.templatesDir = options.templatesDir;
    this.args = options.args;
  }

  public async run() {
    await this.selectTemplate();
    await this.createContext();
    await this.checkTargetDir();
    await this.generateProject();
    this.endPrompt();
  }

  private async selectTemplate() {
    const defaultTemplate = this.templates[0];

    if (!this.templateName || this.templates.length > 1) {
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
    const { type, tips } = this.templateConfig;

    await this.applyBeforeEmitHook();
    logger.info(processTip(tips.startCreate, this.context) as string);

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
    await this.applyAfterEmitHook();
    logger.success(processTip(tips.creationCompleted, this.context) as string);
  }

  private async createContext() {
    // 修改文件内容
    const modifyFileContent = async (filepath: string, callback: (content: string) => string | Promise<string>) => {
      const content = await fs.readFile(filepath, 'utf-8');
      const newContent = await callback(content);
      await fs.writeFile(filepath, newContent, 'utf-8');
    };

    this.context = {
      dirname: this.dirname,
      dirPtah: this.dirPtah,
      templateName: this.templateName,
      templateConfig: this.templateConfig,
      logger,
      args: this.args,
      modifyFileContent,
    };

    await this.applyContextCreatedHook();
  }

  private async applyContextCreatedHook() {
    const { onContextCreated } = this.templateConfig;

    if (onContextCreated) {
      await onContextCreated(this.context);
    }
  }

  private async applyBeforeEmitHook() {
    const { onBeforeEmit } = this.templateConfig;

    if (onBeforeEmit) {
      await onBeforeEmit(this.context);
    }
  }

  private async applyAfterEmitHook() {
    const { onAfterEmit } = this.templateConfig;

    if (onAfterEmit) {
      await onAfterEmit(this.context);
    }
  }

  private async endPrompt() {
    console.log(' ');
    let tipsList: string[] = [];

    const { tips } = this.templateConfig;
    const finish = tips.finish;

    if (finish !== false) {
      if (typeof finish === 'function') {
        tipsList = await finish(this.context);
      } else if (Array.isArray(finish)) {
        tipsList = finish;
      }

      tipsList.forEach((tip) => {
        logger.success(`  ${tip}`);
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
    // TODO: 待完善
    await downloadFromGit();
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
