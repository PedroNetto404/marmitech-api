const sequelize = require('sequelize');
const env = require('./env');
const { database } = env;

const db = new sequelize(
  database.database,
  database.username,
  database.password,
  {
    host: database.host,
    dialect: database.dialect,
    port: database.port,
    underscored: true,
  },
);

db.initialize = async () => {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');

    if (database.sync.enabled) {
      const models = require('./models');

      await db.sync({ force: database.sync.force, alter: database.sync.alter });
      console.log('Database synchronized');

      for (const model of models) {
        db[model.name] = model;
      }
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = db;
