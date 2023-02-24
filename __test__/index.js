#!/usr/bin/env node

const path = require('path');
const { createOctopus } = require('../lib');

createOctopus({
  name: 'dnf', // 工具的名字
  description: '这是一个叫做 DNF 的模板创建工具',
  version: '1.0.0',
  templatesDir: path.resolve(__dirname, './local'), // 模板目录
  templates: [
    {
      name: 'react-template', // 如果是本地模板，必须跟 local 下的目录同名
      description: 'app demo template',
      type: 'local', // 模板类型
    },
  ],
});
