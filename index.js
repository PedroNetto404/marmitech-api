'strict';
const db = require('./config/database');

const init = async () => {
  await db.initialize();
  require('./src/server');
};

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
