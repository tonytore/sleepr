import * as crypto from 'node:crypto';

import { Injectable, Logger } from '@nestjs/common';
import stringify from 'fast-json-stable-stringify';

@Injectable()
export class HashProvider {
  private readonly logger = new Logger(HashProvider.name);

  /**
   * Generates a stable SHA-256 hash from JSON data.
   * If the data appears to be a Lexical state, it normalizes it first by stripping
   * out volatile IDs and keys that don't affect the visual content.
   */
  generateHash(data: unknown): string {
    if (!data) return '';

    try {
      // Clone data to avoid mutating the original
      const dataToHash = structuredClone(data) as unknown;

      // Normalize Lexical state if present
      const normalizedData = this.normalizeLexicalState(dataToHash);

      // Stringify deterministically
      const stableString = stringify(normalizedData as any);

      // Hash using SHA-256
      return crypto.createHash('sha256').update(stableString).digest('hex');
    } catch (error) {
      this.logger.error('Failed to generate hash', error);
      throw new Error('Failed to generate secure hash for content');
    }
  }

  /**
   * Recursively normalizes Lexical state by removing keys that change frequently
   * without affecting the actual content (like internal node keys, IDs, etc.)
   */
  private normalizeLexicalState(node: unknown): unknown {
    if (Array.isArray(node)) {
      return node.map((item) => this.normalizeLexicalState(item));
    }

    if (node !== null && typeof node === 'object') {
      const normalizedNode: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(
        node as Record<string, unknown>,
      )) {
        // Skip keys that are volatile in Lexical or general internal use
        if (key === 'key' || key === 'id' || key === '__key') {
          continue;
        }

        normalizedNode[key] = this.normalizeLexicalState(value);
      }
      return normalizedNode;
    }

    return node;
  }
}
