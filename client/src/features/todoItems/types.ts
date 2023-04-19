export interface TodoItem {
  _id: string;
  createdAt: string | null;
  deletedAt: string | null;
  updatedAt: string | null;
  completedAt: string | null;
  description: string;
}