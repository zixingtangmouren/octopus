const path = require('path');
const { createOctopus } = require('../lib');

createOctopus({
  name: 'Xxxx',
  description: 'xxxx',
  version: '1.10.0',
  templatesDir: path.resolve(__dirname, './templates'),
  templates: [
    {
      name: 'app-demo',
      description: 'app demo template',
      type: 'local',
    },
  ],
});
