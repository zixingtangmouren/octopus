import { type TemplateConfig } from './defineTmeplate';
import { type BannerConfig } from './utils';
interface CreateOctopusOptions {
    name: string;
    version: string;
    banner?: BannerConfig;
    description: string;
    templatesDir?: string;
    templates: TemplateConfig[];
}
export default function createOctopus(options: CreateOctopusOptions): Promise<void>;
export {};
