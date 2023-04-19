import React from 'react';
import Grid from '@mui/material/Grid';
import { Header } from '@todo-app/client/components';
import { useGetTodoItemsQuery } from '@todo-app/client/features/todoItems';
import { CreateNewTodoItem, TodoList } from '@todo-app/client/features/todoItems';

// Note: Preferably this value should be defined and used from the theme object.
const LIST_MAX_WIDTH = 800;

export function HomePage() {
  const { data } = useGetTodoItemsQuery();

  return (
    <Grid container>
      <Header />
      <Grid
        container
        flexDirection="column"
        flexWrap="nowrap"
        justifyContent="center"
        alignItems="center"
        rowSpacing={2}
        marginTop={3}
      >
        <Grid item maxWidth={LIST_MAX_WIDTH} width="100%">
          <CreateNewTodoItem />
        </Grid>
        <Grid item maxWidth={LIST_MAX_WIDTH} width="100%">
          <TodoList items={data ?? []} noItemsMessage="You don't have any tasks. Create some now!" />
        </Grid>
      </Grid>
    </Grid>
  );
}
