"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function defineTemplate(config) {
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
exports.default = defineTemplate;
//# sourceMappingURL=defineTmeplate.js.map