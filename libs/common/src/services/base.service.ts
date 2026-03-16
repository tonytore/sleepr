import { NotFoundException } from '@nestjs/common';
import { type Prisma } from '@prisma/client';
import { type PrismaService } from 'nestjs-prisma';

import { type IdDto, type IdsDto } from '../dto/id.dto';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';
import { type PaginationDto } from '../dto/pagination.dto';

/**
 * Define names of models available in DatabaseService that support CRUD.
 */
type PrismaModel = keyof {
  [K in keyof PrismaService as PrismaService[K] extends { create: unknown }
    ? K
    : never]: unknown;
};

/**
 * Define the interface for the Prisma delegate methods.
 * This allows us to call these methods in a type-safe way within BaseService.
 */
export interface ModelMethods<TModel extends PrismaModel, Entity> {
  findMany: <A extends Prisma.Args<PrismaService[TModel], 'findMany'>>(
    args: A,
  ) => Promise<Entity[]>;
  findUnique: <A extends Prisma.Args<PrismaService[TModel], 'findUnique'>>(
    args: A,
  ) => Promise<Entity | null>;
  create: <A extends Prisma.Args<PrismaService[TModel], 'create'>>(
    args: A,
  ) => Promise<Entity>;
  update: <A extends Prisma.Args<PrismaService[TModel], 'update'>>(
    args: A,
  ) => Promise<Entity>;
  delete: <A extends Prisma.Args<PrismaService[TModel], 'delete'>>(
    args: A,
  ) => Promise<Entity>;
  count: <A extends Prisma.Args<PrismaService[TModel], 'count'>>(
    args: A,
  ) => Promise<number>;
  deleteMany: <A extends Prisma.Args<PrismaService[TModel], 'deleteMany'>>(
    args: A,
  ) => Promise<{ count: number }>;
  updateMany: <A extends Prisma.Args<PrismaService[TModel], 'updateMany'>>(
    args: A,
  ) => Promise<{ count: number }>;
}

/**
 * Generic BaseService to handle standard CRUD operations.
 * Follows the model-based pattern for strong typing and lint compatibility.
 */
export abstract class BaseService<TModel extends PrismaModel, Entity> {
  protected readonly model: ModelMethods<TModel, Entity>;
  protected searchableFields: string[] = [];

  constructor(
    protected readonly db: PrismaService,
    protected readonly modelName: TModel,
    protected readonly displayName: string,
  ) {
    this.model = this.db[this.modelName] as unknown as ModelMethods<
      TModel,
      Entity
    >;
  }

  /**
   * Retrieves all items with pagination.
   */
  async findAll(
    paginationDto: PaginationDto,
    args?: Prisma.Args<PrismaService[TModel], 'findMany'>,
  ): Promise<PaginatedResponseDto<Entity>> {
    let searchCondition = {};
    if (paginationDto.search && this.searchableFields.length > 0) {
      searchCondition = {
        OR: this.searchableFields.map((field) => ({
          [field]: { contains: paginationDto.search, mode: 'insensitive' },
        })),
      };
    }

    const where = {
      deletedAt: null,
      ...searchCondition,
      ...args?.where,
    };

    const findArgs = {
      orderBy: {
        createdAt: 'desc',
      },
      ...args,
      where,
      take: paginationDto.limit,
      skip: paginationDto.skip,
    } as Prisma.Args<PrismaService[TModel], 'findMany'>;

    const [items, totalItems] = await Promise.all([
      this.model.findMany(findArgs),
      this.model.count({
        where,
      } as Prisma.Args<PrismaService[TModel], 'count'>),
    ]);

    return new PaginatedResponseDto(items, totalItems, paginationDto);
  }

  /**
   * Retrieves a single item by its ID.
   */
  async findOne(
    id: string | IdDto,
    args?: Omit<Prisma.Args<PrismaService[TModel], 'findUnique'>, 'where'>,
  ): Promise<Entity> {
    const findUniqueArgs = {
      ...args,
      where: { id: typeof id === 'string' ? id : id.id },
    } as Prisma.Args<PrismaService[TModel], 'findUnique'>;

    const item = await this.model.findUnique(findUniqueArgs);

    if (!item) {
      throw new NotFoundException(`${this.displayName} not found`);
    }

    return item;
  }

  /**
   * Creates a new item.
   */
  async create(
    data: Prisma.Args<PrismaService[TModel], 'create'>['data'],
    args?: Omit<Prisma.Args<PrismaService[TModel], 'create'>, 'data'>,
  ): Promise<Entity> {
    const createArgs = {
      ...args,
      data,
    } as Prisma.Args<PrismaService[TModel], 'create'>;

    return await this.model.create(createArgs);
  }

  /**
   * Updates an existing item.
   */
  async update(
    id: string | IdDto,
    data: Prisma.Args<PrismaService[TModel], 'update'>['data'],
    args?: Omit<Prisma.Args<PrismaService[TModel], 'update'>, 'where' | 'data'>,
  ): Promise<Entity> {
    // Verify existence
    await this.findOne(id);

    const updateArgs = {
      ...args,
      where: { id: typeof id === 'string' ? id : id.id },
      data,
    } as Prisma.Args<PrismaService[TModel], 'update'>;

    return await this.model.update(updateArgs);
  }

  /**
   * Removes an item by its ID.
   */
  async remove(id: string | IdDto): Promise<Entity> {
    // Verify existence
    await this.findOne(id);

    return await this.model.update({
      where: { id: typeof id === 'string' ? id : id.id },
      data: { deletedAt: new Date() },
    } as Prisma.Args<PrismaService[TModel], 'update'>);
  }

  async removePermanently(id: string | IdDto): Promise<Entity> {
    // Verify existence
    await this.findOne(id);

    return await this.model.delete({
      where: { id: typeof id === 'string' ? id : id.id },
    } as Prisma.Args<PrismaService[TModel], 'delete'>);
  }

  async removeMany(idsDto: IdsDto): Promise<{ _count: number }> {
    // Verify existence
    const items = await this.model.findMany({
      where: {
        id: { in: idsDto.ids },
      },
    } as Prisma.Args<PrismaService[TModel], 'findMany'>);

    if (items.length !== idsDto.ids.length) {
      const foundIds = new Set(
        items.map((item) => String((item as unknown as { id: string }).id)),
      );
      const missingIds = idsDto.ids.filter((id) => !foundIds.has(id));
      throw new NotFoundException(
        `${this.displayName} with IDs ${missingIds.join(', ')} not found`,
      );
    }

    await this.model.updateMany({
      where: {
        id: { in: idsDto.ids },
      },
      data: { deletedAt: new Date() },
    } as Prisma.Args<PrismaService[TModel], 'updateMany'>);

    return { _count: items.length };
  }
}
