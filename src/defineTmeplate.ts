import { type CreatorConext } from './creator.js';

export type TipsValue<T> = boolean | T | ((context: CreatorConext) => Promise<T> | T);
interface Tips {
  startCreate: TipsValue<string>;
  creationCompleted: TipsValue<string>;
  finish: TipsValue<string[]>;
}

export interface TemplateConfig {
  name: string;
  description: string;
  type?: 'local' | 'git' | 'npm';
  path?: string;
  tips?: Partial<Tips>;
  gitOptions?: Record<any, any>;
  onContextCreated?: (context: CreatorConext) => any;
  onBeforeEmit?: (context: CreatorConext) => any;
  onAfterEmit?: (context: CreatorConext) => any;
}

const defaultTips: Tips = {
  startCreate: 'Project is being created...',
  creationCompleted: 'Project initialization completed',
  finish: ({ dirname }) => [`cd ${dirname}`, 'npm install', 'npm run start'],
};

export default function defineTemplate(config: TemplateConfig): TemplateConfig {
  return {
    name: config.name,
    description: config.description || config.name,
    type: config.type ?? 'local',
    path: config.path,
    gitOptions: config.gitOptions,
    tips: config.tips
      ? {
          ...defaultTips,
          ...config.tips,
        }
      : defaultTips,
    onContextCreated: config.onContextCreated,
    onBeforeEmit: config.onBeforeEmit,
    onAfterEmit: config.onAfterEmit,
  };
}
