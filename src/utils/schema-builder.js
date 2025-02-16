const { z } = require('zod');

const schemaBuilder = {
  /**
   * Método para construção de esquemas de validação para rotas de listagem.
   * @returns {typeof builder} Objeto com os métodos para construção de esquemas de validação.
   */
  query: () => {
    const sorting = [];
    const filtering = [];
    const pagination = {
      limit: {
        min: 1,
        max: 100,
      },
      offset: {
        min: 0,
      },
    };

    const buildSort = () =>
      z
        .string()
        .transform((value) =>
          value.split(',').map((field) => {
            const [name, order] = field.split(':');
            return [name, order.toUpperCase()];
          }),
        )
        .refine((value) =>
          value.every(
            ([name, order]) =>
              sorting.includes(name) && ['ASC', 'DESC'].includes(order),
          ),
        );

    const buildFilter = () =>
      z
        .string()
        .transform((values) =>
          values.split(',').map((v) => {
            const pattern = /(.+)\[(.+)\]:(.+)/;
            const [, name, operator, value] = v.match(pattern);

            return {
              name,
              operator,
              value,
            };
          }),
        )
        .refine((values) =>
          values.every(({ name, operator }) => {
            const field = filtering.find((f) => f.field === name);
            if (!field) return `O campo ${name} não é permitido.`;

            if (!field.operators.includes(operator)) {
              return `O operador ${operator} não é permitido para o campo ${name}.`;
            }

            return true;
          }),
        )
        .transform((values) =>
          values.reduce((acc, { name, operator, value }) => {
            const field = filtering.find((f) => f.field === name);
            return {
              ...acc,
              ...field.builder({ name, operator, value }),
            };
          }, {}),
        );

    const buildLimit = () =>
      z
        .string()
        .transform((value) => parseInt(value, 10))
        .refine(
          (value) =>
            value >= pagination.limit.min && value <= pagination.limit.max,
        );

    const buildOffset = () =>
      z
        .string()
        .transform((value) => parseInt(value, 10))
        .refine((value) => value >= pagination.offset.min);

    const builder = {
      /**
       * @param {string[]} fields
       * @returns {Omit<typeof builder, 'sort'>}
       */
      sort(fields) {
        sorting.push(...fields);
        return this;
      },
      /**
       *
       * @param {{
       *   name: string;
       *   operators: (keyof import('sequelize').Op)[];
       *   builder: (params: { operator: keyof import('sequelize').Op; value: string }) => import('sequelize').WhereOptions;
       * }[]} fields
       * @returns {Omit<typeof builder, 'sort'>}
       */
      filter(fields) {
        filtering.push(...fields);
        return this;
      },
      /**
       * @param {{ limit: { min?: number; max?: number }; offset: { min?: number } }} param
       * @returns {Omit<typeof builder, 'paginate'>}
       */
      paginate({ limit, offset } = { limit: {}, offset: {} }) {
        if (limit.min) pagination.limit.min = limit.min;
        if (limit.max) pagination.limit.max = limit.max;
        if (offset.min) pagination.offset.min = offset.min;

        return this;
      },
      /**
       * @returns {z.ZodObject}
       */
      build: () =>
        z.object({
          query: z.object({
            sort: buildSort(),
            filter: buildFilter(),
            limit: buildLimit(),
            offset: buildOffset(),
          }),
        }),
    };

    return builder;
  },
  /**
   * Método para construção de esquemas de validação para rotas de detalhamento.
   * @returns {z.ZodObject} Esquema de validação.
   */
  params: () => z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
  }),
};

module.exports = schemaBuilder;
