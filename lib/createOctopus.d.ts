import { type TemplateConfig } from './defineTmeplate';
interface CreateOctopusOptions {
    name: string;
    version: string;
    description: string;
    templatesDir: string;
    templates: TemplateConfig[];
}
export default function createOctopus(options: CreateOctopusOptions): Promise<void>;
export {};
