const ApiError = require('../errors/api-error');

/**
 * Criar um repositório genérico
 * @type {{
 *  model: import('sequelize').ModelStatic<import('sequelize').Model<any, any>> | null,
 *   withModel: (model: import('sequelize').ModelStatic<import('sequelize').Model<any, any>>) => typeof genericRepositoryFactory,
 *   build: () => {
 *     create: (data: any, options?: import('sequelize').CreateOptions) => Promise<void>,
 *     update: (id: string, data: any, options?: import('sequelize').UpdateOptions) => Promise<void>,
 *     delete: (id: string, options?: import('sequelize').DestroyOptions) => Promise<void>,
 *     findById: (id: string, options?: import('sequelize').FindOptions) => Promise<any | null>,
 *     findAll: (params?: {
 *       limit?: number,
 *       offset?: number,
 *       sort?: { field?: string, order?: 'ASC' | 'DESC' }[],
 *       where?: import('sequelize').WhereOptions,
 *     }, options?: import('sequelize').FindOptions) => Promise<{
 *       meta: {
 *         count: number,
 *         limit: number,
 *         offset: number,
 *         page: number,
 *         pages: number,
 *       },
 *       records: any[],
 *     }>,
 *     findOne: (where: import('sequelize').WhereOptions, options?: import('sequelize').FindOptions) => Promise<any | null>,
 *     exists: (where: import('sequelize').WhereOptions, options?: import('sequelize').FindOptions) => Promise<boolean>,
 *   }
 * }}
 */
const genericRepositoryFactory = {
  model: null,

  withModel(model) {
    this.model = model;
    return this;
  },

  build() {
    if (!this.model) {
      throw new Error('Modelo não definido');
    }

    const model = this.model;

    return {
      async create(data, options = {}) {
        await model.create(data, options);
      },

      async update(id, data, options = { where: {} }) {
        const [affectedRows] = await model.update(data, {
          where: { id, ...options.where },
        });
        if (affectedRows === 0) {
          throw ApiError.internal('Erro ao atualizar registro');
        }
      },

      async delete(id, options = {}) {
        const record = await model.findByPk(id, options);
        if (!record) {
          throw ApiError.notFound('Registro não encontrado');
        }
        await record.destroy(options);
      },

      async findById(id, options = {}) {
        const record = await model.findByPk(id, options);
        return record ? record.toJSON() : null;
      },

      async findAll(
        {
          limit = 10,
          offset = 0,
          sort = [{ field: 'id', order: 'ASC' }],
          where = {},
        } = {},
        options = {}
      ) {
        const records = await model.findAll({
          where,
          limit,
          offset,
          order: sort.map(({ field, order }) => [field, order]),
          ...options,
        });

        const count = await model.count({ where, ...options });

        return {
          meta: {
            count,
            limit,
            offset,
            page: Math.floor(offset / limit) + 1,
            pages: Math.ceil(count / limit),
          },
          records: records.map((record) => record.toJSON()),
        };
      },

      async findOne(where, options = {}) {
        const record = await model.findOne({ where, ...options });
        return record ? record.toJSON() : null;
      },

      async exists(where, options = {}) {
        const count = await model.count({ where, ...options });
        return count > 0;
      },
    };
  },
};

module.exports = genericRepositoryFactory;
