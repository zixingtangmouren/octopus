"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function defineTemplate(config) {
    var _a;
    return {
        name: config.name,
        description: config.description || '',
        type: (_a = config.type) !== null && _a !== void 0 ? _a : 'git',
        beforeTask: config.beforeTask,
        afterTask: config.afterTask,
    };
}
exports.default = defineTemplate;
//# sourceMappingURL=defineTmeplate.js.map