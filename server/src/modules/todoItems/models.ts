import type { BaseEntity, OmitId, ModelConstructorParams } from '@todo-app/server/common';
import { BaseModel } from '@todo-app/server/common';

export interface TodoItemEntity extends BaseEntity {
  completedAt: Date | null;
  description: string;
}

type ConstructorParams = ModelConstructorParams<Omit<TodoItemEntity, 'completedAt' | 'description'>> & {
  completedAt?: TodoItemEntity['completedAt'];
  description: TodoItemEntity['description'];
};

export class TodoItem extends BaseModel implements OmitId<TodoItemEntity> {

  completedAt: Date | null;

  description: string;
  
  constructor(params: ConstructorParams) {
    super(params);

    this.completedAt = params.completedAt ?? null;
    this.description = params.description;
  }
}