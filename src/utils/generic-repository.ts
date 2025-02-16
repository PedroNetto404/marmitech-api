import {
  Attributes,
  CreationAttributes,
  Model,
  ModelStatic,
  Transaction,
  WhereOptions,
} from 'sequelize';
import ApiError from '../errors/api-error';

export type FindAllParams<T extends { id: string }, K extends Model<T>> = {
  limit?: number;
  offset?: number;
  sort?: { field: keyof T; order: 'ASC' | 'DESC' }[];
  where?: WhereOptions<Attributes<K>>;
};

export type FindAllResult<T> = {
  meta: {
    count: number;
    length: number;
    limit: number;
    offset: number;
    page: number;
    pages: number;
  };
  records: T[];
};

export class GenericRepository<T extends { id: string }, K extends Model<T>> {
  private readonly model: ModelStatic<K>;

  constructor(model: ModelStatic<K>) {
    this.model = model;
  }

  async create({
    payload,
    transaction,
  }: {
    payload: T;
    transaction?: Transaction;
  }): Promise<void> {
    await this.model.create(payload as CreationAttributes<K>, {
      ...(transaction ? { transaction } : {}),
    });
  }

  async update({ id, payload, transaction }: { id: string; payload: T, transaction?: Transaction }): Promise<void> {
    const [affectedRows] = await this.model.update(payload, {
      where: {
        id,
      } as WhereOptions<Attributes<K>>,
      ...(transaction ? { transaction } : {}),
    });
    if (affectedRows === 0) {
      throw ApiError.internal('Error updating record');
    }
  }

  async delete(
    { id, transaction }: { id: string; transaction?: Transaction },
  ): Promise<void> {
    await this.model.destroy({
      where: {
        id,
      } as WhereOptions<Attributes<K>>,
      ...(transaction ? { transaction } : {}),
    });
  }

  async findById(id: string): Promise<T | null> {
    const record = await this.model.findByPk(id);
    return record ? (record.toJSON() as T) : null;
  }

  async findAll({
    limit,
    offset,
    sort,
    where,
  }: FindAllParams<T, K> = {}): Promise<FindAllResult<T>> {
    limit = limit ?? 10;
    offset = offset ?? 0;
    sort = sort ?? [{ field: 'id', order: 'ASC' }];
    where = where ?? {};

    const records = await this.model.findAll({
      where,
      limit,
      offset,
      order: sort.map(({ field, order }) => [field as string, order]),
    });

    const count = await this.model.count({ where });

    return {
      meta: {
        count,
        length: records.length,
        limit,
        offset,
        page: Math.floor(offset / limit) + 1,
        pages: Math.ceil(count / limit),
      },
      records: records.map((record) => record.toJSON() as T),
    };
  }

  async findOne(where: WhereOptions<Attributes<K>>): Promise<T | null> {
    const record = await this.model.findOne({ where });
    return record ? (record.toJSON() as T) : null;
  }

  async exists(where: WhereOptions<Attributes<K>>): Promise<boolean> {
    const count = await this.model.count({ where });
    return count > 0;
  }
}
