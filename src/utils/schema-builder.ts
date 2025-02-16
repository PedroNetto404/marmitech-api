import { Op, WhereOptions } from 'sequelize';
import { z } from 'zod';

export type Filter<T> = {
  field: keyof T;
  operators: (keyof typeof Op)[];
  builder: (params: {
    operator: keyof typeof Op;
    value: any;
  }) => WhereOptions<T>;
};

type QueryBuilder<T> = {
  sort: (fields: keyof T) => QueryBuilder<T>;
  filter: (fields: Filter<T>) => QueryBuilder<T>;
  paginate: (options?: {
    limit?: { min?: number; max?: number };
    offset?: { min?: number };
  }) => Omit<QueryBuilder<T>, 'paginate'>;
  build: () => z.ZodObject<{
    query: z.ZodObject<{
      sort: z.ZodEffects<
        z.ZodEffects<z.ZodString, string[][], string>,
        string[][],
        string
      >;
      filter: z.ZodEffects<
        z.ZodEffects<
          z.ZodEffects<
            z.ZodString,
            {
              name: any;
              operator: any;
              value: any;
            }[],
            string
          >,
          {
            name: any;
            operator: any;
            value: any;
          }[],
          string
        >,
        {},
        string
      >;
      limit: z.ZodEffects<
        z.ZodEffects<z.ZodString, number, string>,
        number,
        string
      >;
      offset: z.ZodEffects<
        z.ZodEffects<z.ZodString, number, string>,
        number,
        string
      >;
    }>;
  }>;
};

type Builder = {
  query: <T>() => QueryBuilder<T>;
  params: () => z.ZodObject<{ params: z.ZodObject<{ id: z.ZodString }> }>;
};

const schemaBuilder: Builder = {
  query: <T>() => {
    const sorting: (keyof T)[] = [];
    const filtering: Filter<T>[] = [];

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
              sorting.includes(name as keyof T) &&
              ['ASC', 'DESC'].includes(order),
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

    const builder: QueryBuilder<T> = {
      sort(field) {
        sorting.push(field);
        return this;
      },
      filter(filter) {
        filtering.push(filter);
        return this;
      },
      paginate({ limit, offset } = {}) {
        limit = limit || {};
        offset = offset || {};

        if (limit.min) pagination.limit.min = limit.min;
        if (limit.max) pagination.limit.max = limit.max;
        if (offset.min) pagination.offset.min = offset.min;

        return this;
      },
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
  params: () =>
    z.object({
      params: z.object({
        id: z.string().uuid(),
      }),
    }),
};

export default schemaBuilder;
