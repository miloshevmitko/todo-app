import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import type { TodoItem } from '@todo-app/client/features/todoItems';
import { TodoListItem } from './TodoListItem';

interface Props {
  items: TodoItem[];
  noItemsMessage: string;
}

export function TodoList({ items, noItemsMessage }: Props) {
  return (
    <Grid container justifyContent="center" direction="column" rowSpacing={2}>
      {items.length === 0 && (
        <Grid item>
          <Typography aria-label="no items">
            {noItemsMessage}
          </Typography>
        </Grid>
      )}
      {
        items.map((item) => (
          <Grid key={item._id} item>
            <TodoListItem id={item._id} description={item.description} />
          </Grid>
        ))
      }
    </Grid>
  )
}