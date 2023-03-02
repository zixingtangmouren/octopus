import { defineTemplate } from '../../lib/index.js';

const templateA = defineTemplate({
  name: 'template-a',
  description: '模板 A',
  type: 'local',
  tips: {
    finish: false,
  },
});

const reactTemplate = defineTemplate({
  name: 'react-template', // 如果是本地模板，必须跟 local 下的目录同名
  description: 'app demo template',
  type: 'local', // 模板类型
  tips: {
    startCreate: false,
  },
  onBeforeEmit: (ctx) => {
    console.log('onBeforeEmit', ctx);
  },
  onAfterEmit: (ctx) => {
    console.log('onBeforeEmit', ctx);
  },
  onContextCreated: (ctx) => {
    ctx.xx = 100;
  },
});

const onlineReactTemplate = defineTemplate({
  name: 'online-react-template', // 如果是本地模板，必须跟 local 下的目录同名
  description: 'online react template',
  path: 'zixingtangmouren/react-template',
  type: 'git',
});

export default [templateA, reactTemplate, onlineReactTemplate];
