import type { ObjectId } from 'mongodb';

/**
 * Contract which must be implemented by all entities.
 * An Entity is a direct representation of a storage structure.
 */
export interface BaseEntity {
  /**
   * Unique identification for the entity.
   */
  _id: ObjectId;

  /**
   * Indicates the date time when the entity was created.
   */
  createdAt: Date;

  /**
   * Indicates the date time when the entity was last updated.
   */
  updatedAt: Date | null;

  /**
   * Indicates the date time when the entity was (soft) deleted.
   */
  deletedAt: Date | null;
}
