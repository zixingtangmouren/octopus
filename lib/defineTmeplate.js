"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function defineTemplate(config) {
    return {
        name: config.name,
        description: config.description || '',
        type: config.type ?? 'local',
        path: config.path,
        tips: config.tips ?? {
            startCreate: 'Project is being created...',
            creationCompleted: 'Project initialization completed',
            finish: ({ dirname }) => [`cd ${dirname}`, 'npm install', 'npm run start'],
        },
        onContextCreated: config.onContextCreated,
        onBeforeEmit: config.onBeforeEmit,
        onAfterEmit: config.onAfterEmit,
    };
}
exports.default = defineTemplate;
//# sourceMappingURL=defineTmeplate.js.map