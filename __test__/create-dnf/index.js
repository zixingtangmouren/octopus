#!/usr/bin/env node

const path = require('path');
const { createOctopus } = require('@tangjs/octopus');
const templates = require('./config');

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
