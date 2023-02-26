import { type TemplateConfig } from './defineTmeplate';
import { logger } from './utils';
interface CreatorOptions {
    dirname: string;
    templateName?: string;
    templates: TemplateConfig[];
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
    private readonly dirname;
    private templateName?;
    private readonly templates;
    private readonly dirPtah;
    private templateConfig;
    private readonly templatesDir?;
    private readonly args?;
    private context;
    constructor(options: CreatorOptions);
    run(): Promise<void>;
    private selectTemplate;
    private checkTargetDir;
    private generateProject;
    private createContext;
    private applyContextCreatedHook;
    private applyBeforeEmitHook;
    private applyAfterEmitHook;
    private endPrompt;
    /**
     * 本地模板
     */
    private installLocalTemplate;
    private downloadTemplateFromGit;
    /**
     * npm 形式下载模板
     */
    private downloadTemplateFromNpm;
}
export {};
