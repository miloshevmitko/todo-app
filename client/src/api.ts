import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { appConfig } from '@todo-app/client/configs';

const reducerPath = 'todoAppApi';

export const api = createApi({
  reducerPath,
  baseQuery: fetchBaseQuery({ baseUrl: appConfig.apiBaseUrl }),
  tagTypes: ['TodoItems'],
  endpoints: () => ({})
});
