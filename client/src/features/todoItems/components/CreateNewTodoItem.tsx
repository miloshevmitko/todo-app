import React, { useCallback, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { usePostTodoItemMutation } from '../api';

export function CreateNewTodoItem() {
  const [fieldValue, setFieldValue] = useState<string>('');
  const [fieldHelperText, setFieldHelperText] = useState<string>('');
  const [isFieldError, setIsFieldError] = useState<boolean>(false);
  const [isFieldDisabled, setIsFieldDisabled] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [postTodoItem, postTodoItemResult] = usePostTodoItemMutation();

  const onChangeField = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isFieldError) {
      setIsFieldError(false);
      setFieldHelperText('');
    }
    
    setFieldValue(event.target.value);
  }

  useEffect(() => {
    setIsButtonDisabled(fieldValue.length === 0);
  }, [fieldValue]);

  const onClickAddTask = useCallback(async () => {
    if (fieldValue.length === 0) {
      setIsFieldError(true);
      setFieldHelperText('Required value');
      return;
    }

    try {
      await postTodoItem({ description: fieldValue });
    } catch (error) {
      console.error(error);
    }
  }, [fieldValue, postTodoItem]);

  useEffect(() => {
    if (postTodoItemResult.isUninitialized) return;

    if (postTodoItemResult.isLoading) {
      setIsFieldDisabled(true);
      setIsButtonDisabled(true);
      return;
    }

    if (postTodoItemResult.isSuccess) {
      setFieldValue('');
      setIsFieldDisabled(false);
      postTodoItemResult.reset();
    }
  }, [postTodoItemResult]);

  return (
    <Grid container spacing={2}>
      <Grid item flexGrow={1}>
        <TextField
          aria-label='task description'
          required
          fullWidth
          size="small"
          placeholder="Write your description"
          helperText={fieldHelperText}
          error={isFieldError}
          disabled={isFieldDisabled}
          value={fieldValue}
          onChange={onChangeField}
        />
      </Grid>
      <Grid item>
        <Button
          aria-label='add task'
          variant="contained"
          disabled={isButtonDisabled}
          onClick={onClickAddTask}
          sx={{ width: '200px' }}
        >Add Task</Button>
      </Grid>
    </Grid>
  );
}