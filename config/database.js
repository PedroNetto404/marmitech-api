const sequelize = require('sequelize');
const env = require('./env');
const { database } = env;

/**
 * @type {{
 *  sequelize: import('sequelize').Sequelize,
 *  initialize: () => Promise<void>,
 *  models: {
 *    [key: string]: import('sequelize').ModelStatic<import('sequelize').Model>
 *   }
 * }
 * }
 */
const db = {
  sequelize: new sequelize.Sequelize(
    database.database,
    database.username,
    database.password,
    {
      host: database.host,
      dialect: 'postgres',
      port: database.port,
      logging: true,
    },
  ),
  models: {},
  async initialize() {
    try {
      await db.sequelize.authenticate();
      console.log('Connection has been established successfully.');

      if (database.sync.enabled) {
        const models = require('./models');

        await db.sequelize.sync({ force: database.sync.force, alter: database.sync.alter });
        console.log('Database synchronized');

        for (const model of models) {
          db.models[model.name] = model;
        }

        for (const model of models) {
          // @ts-ignore
          if (model.setup) {
            // @ts-ignore
            model.setup(db.models);
          }
        }
      }
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
};

module.exports = db;
