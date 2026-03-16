/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { parseAsync } from 'json2csv';

/**
 * A generic, injectable service for generating CSV output from typed data arrays.
 * Wraps `json2csv` in a NestJS-friendly interface with consistent error handling.
 */
@Injectable()
export class CsvService {
  /**
   * Generates a CSV string from an array of typed objects.
   *
   * @param data - The array of objects to serialize.
   * @param fields - The field names (keys of `T`) to include as columns, in order.
   * @returns A promise resolving to the generated CSV string.
   * @throws {InternalServerErrorException} If CSV generation fails.
   *
   * @example
   * const csv = await this.csvService.generate(users, [
   *   'id', 'email', 'firstName', 'lastName',
   * ]);
   */
  async generate<T extends object>(
    data: T[],
    fields: (keyof T & string)[],
  ): Promise<string> {
    try {
      return await parseAsync(data, { fields });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to generate CSV export',
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
