import path from 'path';
import { createOctopus } from '../../lib/index.js';
import templates from './config.js';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

createOctopus({
  name: 'dnf', // 工具的名字
  banner: {
    type: 'text',
    value: 'DNF.js - This is a front-end framework called dnf~',
  },
  description: '这是一个叫做 DNF 的模板创建工具',
  version: '1.0.0',
  templatesDir: path.resolve(__dirname, './local'), // 模板目录
  templates,
});
