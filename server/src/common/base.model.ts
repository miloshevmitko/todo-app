import { ObjectId } from 'mongodb';

interface Params {
  _id?: ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

/**
 * Contract which must be implemented by all models.
 */
export class BaseModel {
  /**
   * Unique identification for the document.
   * The model id will be null if the entity is not persisted to storage.
   */
  public readonly _id: ObjectId;

  /**
   * Indicates the date time when the entity was created.
   */
  public readonly createdAt: Date;

  /**
   * Indicates the date time when the entity was last updated.
   */
  public readonly updatedAt: Date | null;

  /**
   * Indicates the date time when the entity was (soft) deleted.
   */
  public readonly deletedAt: Date | null;

  constructor(params: Params) {
    this._id = params._id ?? new ObjectId();
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? null;
    this.deletedAt = params.deletedAt ?? null;
  }
}
