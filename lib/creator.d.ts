import { type TemplateConfig } from './defineTmeplate';
interface CreatorOptions {
    dirname: string;
    templateName?: string;
    templates: TemplateConfig[];
    templatesDir?: string;
}
export default class Creator {
    private readonly dirname;
    private templateName?;
    private readonly templates;
    private readonly dirPtah;
    private templateConfig;
    private readonly templatesDir?;
    private context;
    constructor(options: CreatorOptions);
    run(): Promise<void>;
    private selectTemplate;
    private checkTargetDir;
    private generateProject;
    private createContext;
    private callBeforeTask;
    private callAfterTask;
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
