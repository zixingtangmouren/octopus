import { defineTemplate } from '../../lib/index.js';

const templateA = defineTemplate({
  name: 'template-a',
  description: '模板 A',
  type: 'local',
});

const reactTemplate = defineTemplate({
  name: 'react-template', // 如果是本地模板，必须跟 local 下的目录同名
  description: 'app demo template',
  type: 'local', // 模板类型
  tips: {
    startCreate: false,
  },
  // onBeforeEmit: (ctx) => {
  //   console.log('onBeforeEmit', ctx);
  // },
  // onAfterEmit: (ctx) => {
  //   console.log('onBeforeEmit', ctx);
  // },
  // onContextCreated: (ctx) => {
  //   ctx.xx = 100;
  // },
});

export default [templateA, reactTemplate];
