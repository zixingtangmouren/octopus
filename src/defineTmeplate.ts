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
  type?: 'local' | 'git';
  beforeTask?: (context: CreatorConext) => any;
  afterTask?: (context: CreatorConext) => any;
}

export default function defineTemplate(config: TemplateConfig): TemplateConfig {
  return {
    name: config.name,
    description: config.description || '',
    type: config.type ?? 'git',
    beforeTask: config.beforeTask,
    afterTask: config.afterTask,
  };
}
