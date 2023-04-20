import type { BaseEntity } from "./base.entity";

export type OmitId<T> = Omit<T, '_id'>;

/**
 * Type defining the parameters of a model constructor which implements an entity.
 */
export type ModelConstructorParams<T extends BaseEntity> = Omit<T, keyof BaseEntity> & Partial<BaseEntity>;