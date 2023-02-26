import { type CreatorConext } from './creator';
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
    tips: Tips;
    onContextCreated?: (context: CreatorConext) => any;
    onBeforeEmit?: (context: CreatorConext) => any;
    onAfterEmit?: (context: CreatorConext) => any;
}
export default function defineTemplate(config: TemplateConfig): TemplateConfig;
export {};
