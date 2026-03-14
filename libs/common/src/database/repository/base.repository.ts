/* eslint-disable @typescript-eslint/no-unsafe-return */
import { PrismaService } from 'nestjs-prisma';

type PrismaDelegate<TArgs extends any[], TReturn> = {
  findMany: (...args: TArgs) => TReturn;
  findUnique: (...args: TArgs) => TReturn;
  create: (...args: TArgs) => TReturn;
  update: (...args: TArgs) => TReturn;
  delete: (...args: TArgs) => TReturn;
  count: (...args: TArgs) => TReturn;
};

export abstract class BaseRepository<T extends PrismaDelegate<any[], any>> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly model: T,
  ) {}

  findMany(...args: Parameters<T['findMany']>): ReturnType<T['findMany']> {
    return this.model.findMany(...args);
  }

  findUnique(
    ...args: Parameters<T['findUnique']>
  ): ReturnType<T['findUnique']> {
    return this.model.findUnique(...args);
  }

  create(...args: Parameters<T['create']>): ReturnType<T['create']> {
    return this.model.create(...args);
  }

  update(...args: Parameters<T['update']>): ReturnType<T['update']> {
    return this.model.update(...args);
  }

  delete(...args: Parameters<T['delete']>): ReturnType<T['delete']> {
    return this.model.delete(...args);
  }

  count(...args: Parameters<T['count']>): ReturnType<T['count']> {
    return this.model.count(...args);
  }
}
