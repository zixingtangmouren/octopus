# Octopus

## 一、简介 🐙

Octopus 是一个能够帮你快速实现模板创建工具的库，你只需要简单配置就可以完成一个 create-xxx 的 npm 包，并能使用 `npm init xxx` 命令所需的模板。

## 二、快速上手 🚀

Octopus 提供了几个核心 API，通过它们来完成你的模板创建工具。举一个例子，现在要实现一个创建 react 模板的工具叫做 `create-dnf`，让开发者只需使用 init 指令 `npm init dnf` 就可以创建想要的模板。使用 Octopus，你可以这样做。

### 2.1 创建项目

这里先创建一个项目工程，目录如下

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

接着，你只需要先把相应的模板复制到 local 目录，然后创建一个入口文件 index 即可。

### 2.2 创建 Octopus

你需要在 index 创建 Octopus

```js
#!/usr/bin/env node

const path = require('path');
const { createOctopus } = require('@tangjs/octopus');

createOctopus({
  name: 'dnf', // 工具的名字
  description: '这是一个叫做 DNF 的模板创建工具',
  version: '1.0.0',
  templatesDir: path.resolve(__dirname, './local'), // 模板目录
  templates: [
    // 模板配置
    {
      name: 'react-template', // 如果是本地模板，必须跟 local 下的目录同名
      description: 'app demo template',
      type: 'local', // 模板类型
    },
  ],
});
```

### 2.3 发布

想让所有人都能使用 `npm init dnf`，还有两个步骤需要完成。

#### I. 修改 package.json

```json
{
  "name": "create-dnf",
  "version": "1.0.0",
  // 增加一个 bin 配置
  "bin": {
    "create-dnf": "index.js"
  }
}
```

#### II. 本地调试

在发布前，需要现在本地验证一下。可以使用 link 命令

```bash
npm link
```

然后另起一个终端，执行 init 命令

```bash
npm init dnf
```

#### III. 发布

在检测你的包名未被占用后，就可以使用 publish 命令发布

```bash
npm publish
```

## 三、API 📚

### 2.1 createOctopus

### 2.2 defineTemplate
