const path = require('path');
const fs = require('fs');

const modelRootPath = path.resolve(__dirname, '../src/resources');

const dirs = fs.readdirSync(modelRootPath);

const models = [];
for (const dir of dirs) {
  const modelPath = path.resolve(modelRootPath, dir);
  const stat = fs.statSync(modelPath);

  if (!stat.isDirectory()) continue;

  const modelFile = fs
    .readdirSync(modelPath)
    .find((file) => file.indexOf('-model') > -1);
  if (!modelFile) continue;

  const model = require(`${modelPath}/${modelFile}`);
  models.push(model);
}

module.exports = models;
