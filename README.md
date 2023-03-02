# Octopus

## 一、简介 🐙

Octopus 是一个能够帮你快速实现模板创建工具的库，你只需要简单配置就可以完成一个 create-xxx 的 npm 包。

## 二、快速上手 🚀

Octopus 提供了几个核心 API，通过它们来完成你的 initializer。举一个例子，现在要实现一个创建 react 的 initializer 叫做 `create-dnf`，并让开发者只需使用 init 指令 `npm init dnf` 就可以创建想要的模板。

使用 Octopus，你可以这样做。

### 2.1 创建项目

这里先创建一个项目工程，并把你的模板 copy 到 local 目录，项目结构如下。

```
├── local                                     # 存放本地模板的目录
│   ├── react-template                        # react 模板
├── src
│   ├── index.js                              # 工程入口
├── package.json                              # package文件
```

下载 Octopus

```bash
npm i @tangjs/octopus -S
```

### 2.2 创建 Octopus

你需要在 index 创建 Octopus（注意是 ESM 语法规范）

```js
#!/usr/bin/env node

import path from 'path';
import { createOctopus } from '@tangjs/octopus';

createOctopus({
  name: 'dnf', // 工具的名字
  banner: {
    type: 'text',
    value: 'DNF.js - This is a front-end framework called dnf~',
  },
  description: '这是一个叫做 DNF 的模板创建工具',
  version: '1.0.0',
  templatesDir: path.resolve(__dirname, './local'), // 模板目录
  templates: [
    // 模板配置
    {
      name: 'react-template', // 如果是本地模板，必须跟 local 下模板目录同名
      description: 'app demo template',
      type: 'local', // 模板类型
    },
  ],
});
```

### 2.3 测试

将 package.json 中的 bin 字段进行修改

```json
  "bin": {
    "create-dnf": "bin/index.js"
  }
```

link 到全局

```bash
npm link
```

本地测试

```bash
npm init dnf app-demo
```

### 2.4 发布

想让所有人都能使用 `npm init dnf`，还有两个步骤需要完成。

#### I. 检测包名

必须检查包名是否被占用

#### II. 发布

在检测你的包名未被占用后，就可以使用 publish 命令发布

```bash
npm publish
```

## 三、API 📚

### 2.1 createOctopus(options)

用于创建 Octopus

#### options

- name \<string\>: initializer 的名字
- version \<string\>: 版本号
- banner \<BannerConfig\>: banner 配置 【可选】
  - type \<string\>: text | block 【可选】
  - color \<string\>: 色值 【可选】
  - value \<string\>: banner 文字
- description \<string\>: 描述信息
- templatesDir \<string\>: 本地模板的绝对路径
- templates \<TemplateConfig\>: 模板配置列表

### 2.2 defineTemplate(config)

用力定义模板配置信息，返回一个 \<TemplateConfig\> 对象

#### config

- name \<string\>: 模板名字
- description \<string\>: 模板描述，展示在模板选项中
- type \<string\>: 'local' | 'git' | 'npm' 模板加载类型
- path\<string\>: 当 type 配置为 git 或 npm 时，该参数必填，定义 Octopus 从哪个源地址下载模板
- tips\<Tips\>: 相关阶段提示信息
  - startCreate\<string\>
  - creationCompleted\<string\>
  - finish\<string[]\>
- gitOptions \<Record\<any, any\>\>: 当 type 为 git 时，配置的 git 参数，同 download-git-repo
- onContextCreated \<(context: CreatorConext) => any\>: context 上下文创建时触发的钩子函数 【可选】
- onBeforeEmit\<(context: CreatorConext) => any\>: 模板在输出到目标目录之前触发的钩子，可用于做一些前置操作【可选】
- onAfterEmit?\<(context: CreatorConext) => any\>: 模板在输出到目标目录之后触发的钩子，可以对创建好的模板做一些操作【可选】

#### 使用

除了可以将模板内置在 initializer 包里面，你还可以将模板发布到 npm 上，这样大家都可以通过 npm 下载你模板

```js
import { defineTmeplate } from '@tangjs/octopus';

export default defineTmeplate({
  name: 'octopus',
  description: '下载 octopus npm 包',
  type: 'npm',
  path: '@tangjs/octopus', // 也可以指定某个版本，如 @tangjs/octopus@2.2.1
});
```

你也可以将你的模板维护在 github （gitlab 或其他 git 仓库）上，当然有时候会存在一些权限问题

```js
import { defineTmeplate } from '@tangjs/octopus';
import inquirer from 'inquirer';
import path from 'path';

export default defineTmeplate({
  name: 'react-template',
  description: 'react-template',
  path: 'zixingtangmouren/react-template',
  type: 'git',
  onBeforeEmit: async (ctx) => {
    // 在项目输出到本地之前，询问项目的名称
    const { name } = await inquirer.prompt({
      type: 'input',
      name: 'name',
      message: '输入项目的名字',
    });

    // 将用户输入的名称，存入上下文中
    ctx.name = name;
  },
  onAfterEmit: async (ctx) => {
    const { name, dirPath, modifyFileContent } = ctx;

    // 根据用户输入，修改文件内容
    return await modifyFileContent(path.resolve(dirPath, 'package.json'), (content) => {
      return content.replace('react-template', name);
    });
  },
});
```
