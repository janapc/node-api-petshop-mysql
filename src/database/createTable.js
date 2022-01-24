/* eslint-disable */
const models = [
  require('../routes/providers/Model'),
  require('../routes/providers/products/Model'),
];

async function createTable() {
  for (const model of models) {
    await model.sync();
  }
}

createTable();
