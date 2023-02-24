import { type logger } from './utils';

export interface CreatorConext {
  dirname: string;
  dirPtah: string;
  logger: typeof logger;
  [key: string]: any;
}

export interface TemplateConfig {
  name: string;
  description: string;
  type?: 'local' | 'git' | 'npm';
  path?: string;
  tips?: boolean | string[] | ((context: CreatorConext) => string[]);
  beforeTask?: (context: CreatorConext) => any;
  afterTask?: (context: CreatorConext) => any;
}

export default function defineTemplate(config: TemplateConfig): TemplateConfig {
  return {
    name: config.name,
    description: config.description || '',
    type: config.type ?? 'local',
    path: config.path,
    tips: config.tips,
    beforeTask: config.beforeTask,
    afterTask: config.afterTask,
  };
}
