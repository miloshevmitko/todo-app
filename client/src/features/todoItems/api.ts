import { api } from '@todo-app/client/api';
import type { TodoItem } from "./types";

const TodoItemsTag = 'TodoItems';

type GetTodoItemsResponse = TodoItem[];

interface PostTodoItemQueryArgs {
  description: string;
}

interface PatchTodoItemQueryArgs {
  itemId: string;
  itemUpdate: { description: string; };
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTodoItems: build.query<GetTodoItemsResponse, void>({
      providesTags: [TodoItemsTag],
      query: () => ({
        url: '/todo-items',
        method: 'GET'
      })
    }),
    postTodoItem: build.mutation<void, PostTodoItemQueryArgs>({
      query: (args) => ({
        url: '/todo-items',
        method: 'POST',
        body: args
      }),
      invalidatesTags: [TodoItemsTag]
    }),
    patchTodoItem: build.mutation<void, PatchTodoItemQueryArgs>({
      query: ({ itemId, itemUpdate }) => ({
        url: `/todo-items/${itemId}`,
        method: 'PATCH',
        body: itemUpdate
      }),
      invalidatesTags: [TodoItemsTag]
    }),
    deleteTodoItem: build.mutation<void, string>({
      query: (id) => ({
        url: `/todo-items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [TodoItemsTag]
    }),
  })
})

export const {
  useGetTodoItemsQuery,
  usePostTodoItemMutation,
  usePatchTodoItemMutation,
  useDeleteTodoItemMutation,
} = extendedApi;

