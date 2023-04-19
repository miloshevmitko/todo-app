import React, { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmationDialog } from '@todo-app/client/components';
import { useDeleteTodoItemMutation, usePatchTodoItemMutation } from '../api';

interface Props {
  id: string;
  description: string;
}

const DESCRIPTION_FIELD_WIDTH = 208;

export function TodoListItem({ id, description }: Props) {
  const [isDeleteActive, setIsDeleteActive] = useState(false);
  const [isEditActive, setIsEditActive] = useState(false);

  const [fieldValue, setFieldValue] = useState<string>(description);
  const [fieldHelperText, setFieldHelperText] = useState<string>('');
  const [isFieldError, setIsFieldError] = useState<boolean>(false);
  const [isFieldDisabled, setIsFieldDisabled] = useState<boolean>(false);

  /** Delete scenario handlers */
  const [deleteTodoItem] = useDeleteTodoItemMutation();

  const onClickDelete = () => {
    setIsDeleteActive(true);
  }

  const onCancelDelete = () => {
    setIsDeleteActive(false);
  }

  const onConfirmDelete = useCallback(async () => {
    try {
      await deleteTodoItem(id);
      setIsDeleteActive(false);
    } catch (error) {
      console.error(error);
    }
  }, [deleteTodoItem, id]);

  /** Edit scenario handlers */
  const [patchTodoItem, patchTodoItemResult] = usePatchTodoItemMutation();

  const resetFieldState = useCallback(() => {
    setFieldValue(description);
    setFieldHelperText('');
    setIsFieldError(false);
    setIsFieldDisabled(false);
  }, [description]);

  const onClickEdit = () => {
    resetFieldState();
    setIsEditActive(true);
  }

  const onCancelEdit = () => {
    setIsEditActive(false);
    resetFieldState();
  }

  const onChangeField = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isFieldError) {
      setIsFieldError(false);
      setFieldHelperText('');
    }
    
    setFieldValue(event.target.value);
  }

  const onConfirmEdit = useCallback(async () => {
    if (fieldValue.length === 0) {
      setIsFieldError(true);
      setFieldHelperText('Required value');
      return;
    }

    try {
      await patchTodoItem({ itemId: id, itemUpdate: { description: fieldValue} });
    } catch (error) {
      console.error(error);
    }
  }, [fieldValue, id, patchTodoItem]);

  useEffect(() => {
    if (patchTodoItemResult.isUninitialized) return;

    if (patchTodoItemResult.isLoading) {
      setIsFieldDisabled(true);
      return;
    }

    if (patchTodoItemResult.isSuccess) {
      setIsEditActive(false);
      setFieldValue(description);
      setIsFieldDisabled(false);
      patchTodoItemResult.reset();
    }
  }, [description, patchTodoItemResult]);

  return (
    <Box aria-label='list item' sx={{ width: '100%' }}>
      <Paper>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          padding={1}
        >
          <Grid item width={`calc(100% - ${DESCRIPTION_FIELD_WIDTH}px)`}>
            {!isEditActive
              ? (<Typography aria-label="description">{description}</Typography>)
              : (
                <TextField
                  aria-label="list item field"
                  required
                  fullWidth
                  /**
                   * TODO: Cannot use textarea/multilne because of an issue with the unit test
                   * The following line won't work on textarea/multilne
                   * fireEvent.change(element, { target: { value: 'value' }});
                   */
                  // multiline
                  size="small"
                  placeholder="Write your description"
                  value={fieldValue}
                  helperText={fieldHelperText}
                  error={isFieldError}
                  disabled={isFieldDisabled}
                  onChange={onChangeField}
                />
              )
            }
          </Grid>
          <Grid item>
            <Grid container justifyContent="flex-end" columnSpacing={2}>
              {!isEditActive
                ? (
                  <Grid item>
                    <Tooltip title='Edit item description'>
                      <IconButton aria-label='edit' onClick={onClickEdit}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Delete item'>
                      <IconButton aria-label='delete' onClick={onClickDelete}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )
                : (
                  <>
                    <Grid item>
                      <Button
                        aria-label="save"
                        variant="contained"
                        fullWidth
                        onClick={onConfirmEdit}
                        disabled={description.length === 0}
                      >Save</Button>
                    </Grid>
                    <Grid item>
                      <Button
                        aria-label="cancel"
                        variant="outlined"
                        fullWidth
                        onClick={onCancelEdit}
                        disabled={description.length === 0}
                      >Cancel</Button>
                    </Grid>
                  </>
                )
              }
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <ConfirmationDialog 
        title='Confirm Item Delete'
        description='Are you sure you want to delete this item?'
        confirmBtnLabel='Delete'
        cancelBtnLabel='Cancel'
        isOpen={isDeleteActive}
        onCancel={onCancelDelete}
        onConfirm={onConfirmDelete}
      />
    </Box>
  );
}