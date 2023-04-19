import React from 'react';
import { fireEvent, screen, within, waitFor } from '@testing-library/react';
import { appConfig } from '@todo-app/client/configs';
import { renderWithProvider } from '@todo-app/client/utils/tests';
import { server } from '@todo-app/client/mocks/server';
import type { TodoItem } from '@todo-app/client/features/todoItems';
import { rest } from 'msw';
import { HomePage } from './index';

describe('Home page', () => {
  it('should render the Home page correctly without any data', () => {
    // Render the Home page
    renderWithProvider(<HomePage />);

    // Check the Header component is displayed 
    const headerEl = screen.getByRole('navigation', { name: /header/i });
    expect(headerEl).toBeInTheDocument();
    expect(within(headerEl).getByRole('heading')).toBeInTheDocument();

    // The text field should be visible and empty
    const textFieldEl = screen.getByLabelText('task description');
    expect(textFieldEl).toBeInTheDocument();
    const inputEl = within(textFieldEl).getByRole('textbox');
    expect(inputEl.getAttribute('value')).toBe('');

    // The button should be visible and disabled
    const addTaskBtnEl = screen.getByLabelText('add task');
    expect(addTaskBtnEl).toBeInTheDocument();
    expect(addTaskBtnEl).toBeDisabled();

    // There should be no items in the list
    expect(screen.getByLabelText('no items')).toBeInTheDocument();
  });

  it('should be able to create a todo item', async () => {
    const mockTodoItems: Partial<TodoItem>[] = [];
    server.use(
      rest.get(
        `${appConfig.apiBaseUrl}/todo-items`,
        (req, res, ctx) => res(ctx.status(200), ctx.json(mockTodoItems))
      )
    );
    server.use(
      rest.post(`${appConfig.apiBaseUrl}/todo-items`, async (req, res, ctx) => {
        const requestBody = await req.json<TodoItem>();
        const _id = String(mockTodoItems.length + 1);
        mockTodoItems.push({
          ...requestBody,
          _id,
        });
        return res(ctx.status(200), ctx.json({ acknowledged: true, insertedId: _id }));
      }),
    );

    // Render the Home page
    renderWithProvider(<HomePage />);

    // Initially there should be no items in the list
    expect(screen.getByLabelText('no items')).toBeInTheDocument();

    // And the button should be disabled
    const addTaskBtnEl = screen.getByLabelText('add task');
    expect(addTaskBtnEl).toBeDisabled();

    // And the text field should be empty
    const inputEl = within(screen.getByLabelText('task description')).getByRole('textbox');
    expect(inputEl.getAttribute('value')).toBe('');

    // Update the text field value
    const description = 'this is a test description';
    fireEvent.change(inputEl, { target: { value: description }});
    expect(inputEl.getAttribute('value')).toBe(description);

    // The button should be enabled
    expect(addTaskBtnEl).not.toBeDisabled();
    fireEvent.click(addTaskBtnEl);

    // The todo item should be added to the list
    const listItemEl = await screen.findByLabelText('list item');
    expect(listItemEl).toBeInTheDocument();
    expect(within(listItemEl).getByLabelText('description').textContent).toBe(description);

    // The text field and button should be reset to the original state
    await waitFor(() => expect(inputEl.getAttribute('value')).toBe(''));
    expect(addTaskBtnEl).toBeDisabled();
  });

  it('should be able to delete an item from the todo list', async () => {
    const mockTodoItems: Partial<TodoItem>[] = [
      { _id: '1', description: 'mock item 1' },
      { _id: '2', description: 'mock item 2' },
      { _id: '3', description: 'mock item 3' },
    ];
    const initialTodoItemsLength = 3;
    server.use(
      rest.get(
        `${appConfig.apiBaseUrl}/todo-items`,
        (req, res, ctx) => res(ctx.status(200), ctx.json(mockTodoItems))
      )
    );
    server.use(
      rest.delete(
        `${appConfig.apiBaseUrl}/todo-items/:id`,
        async (req, res, ctx) => {
          const { id: requestParamId } = req.params;
          const indexOfItemToDelete = mockTodoItems.findIndex((item) => item._id === requestParamId);
          mockTodoItems.splice(indexOfItemToDelete, 1);
          return res(ctx.status(200), ctx.json({
            acknowledged: true,
            matchedCount: 1,
            modifiedCount: 1
          }));
        }),
    );

    // Render the Home page
    renderWithProvider(<HomePage />);

    // Initially there should be some items in the list
    const listItems = await screen.findAllByLabelText('list item');
    expect(listItems.length).toBe(initialTodoItemsLength);

    // Find the delete button of any list item and click it
    const deleteBtnEl = within(listItems[0]).getByRole('button', { name: 'delete' });
    fireEvent.click(deleteBtnEl);
    // Check the confirmation dialog is displayed and cancel the delete
    const confirmationDialogEl = await screen.findByLabelText('confirmation dialog');
    expect(confirmationDialogEl).toBeInTheDocument();
    const cancelBtnEl = within(confirmationDialogEl).getByRole('button', { name: 'cancel' });
    fireEvent.click(cancelBtnEl);
    await waitFor(() => expect(confirmationDialogEl).not.toBeInTheDocument());
    // Items should not have been deleted
    const listItemsAfterCancel = await screen.findAllByLabelText('list item');
    expect(listItemsAfterCancel.length).toBe(initialTodoItemsLength);

    // This time confirm the delete and count the new number of todo items
    fireEvent.click(deleteBtnEl);
    const confirmationDialog2El = await screen.findByLabelText('confirmation dialog');
    const confirmBtnEl = within(confirmationDialog2El).getByRole('button', { name: 'confirm' });
    fireEvent.click(confirmBtnEl);
    await waitFor(() => expect(confirmationDialog2El).not.toBeInTheDocument());
    const listItemsAfterDelete = await screen.findAllByLabelText('list item');
    expect(listItemsAfterDelete.length).toBeLessThan(initialTodoItemsLength);
  });

  it('should be able to update the description of an todo item', async () => {
    const mockTodoItems: Partial<TodoItem>[] = [
      { _id: '1', description: 'mock item 1' },
      { _id: '2', description: 'mock item 2' },
      { _id: '3', description: 'mock item 3' },
    ];
    const indexOfEditItem = 0;
    const initialDescription = mockTodoItems[indexOfEditItem].description;
    server.use(
      rest.get(
        `${appConfig.apiBaseUrl}/todo-items`,
        (req, res, ctx) => res(ctx.status(200), ctx.json(mockTodoItems))
      )
    );
    server.use(
      rest.patch(
        `${appConfig.apiBaseUrl}/todo-items/:id`,
        async (req, res, ctx) => {
          const requestBody = await req.json<TodoItem>();
          const { id: requestParamId } = req.params;
          const indexOfItemToUpdate = mockTodoItems.findIndex((item) => item._id === requestParamId);
          mockTodoItems[indexOfItemToUpdate] = {
            ...mockTodoItems[indexOfItemToUpdate],
            ...requestBody,
          };
          return res(ctx.status(200), ctx.json({
            acknowledged: true,
            matchedCount: 1,
            modifiedCount: 1
          }));
        }
      ),
    );

    // Render the Home page
    renderWithProvider(<HomePage />);

    // Tthere should be some items in the list
    const listItems = await screen.findAllByLabelText('list item');
    expect(listItems.length).toBe(mockTodoItems.length);

    // There should be no text field initially
    expect(within(listItems[indexOfEditItem]).queryByLabelText('list item field')).toBe(null);
    // Find the edit button of any list item and click it
    const editBtnEl = within(listItems[indexOfEditItem]).getByRole('button', { name: 'edit' });
    fireEvent.click(editBtnEl);
    // Text field should be visible now and value not changed
    const textFieldEl = await within(listItems[indexOfEditItem]).findByLabelText('list item field');
    const inputEl = within(textFieldEl).getByRole('textbox');
    expect(inputEl.getAttribute('value')).toBe(initialDescription);
    // Change the text field value
    const description = 'this is a new description';
    fireEvent.change(inputEl, { target: { value: description }});
    expect(inputEl.getAttribute('value')).toBe(description);
    // Cancel the update and check the value is not changed
    const cancelBtnEl = within(listItems[indexOfEditItem]).getByRole('button', { name: 'cancel' });
    fireEvent.click(cancelBtnEl);
    expect(within(listItems[indexOfEditItem]).queryByLabelText('list item field')).toBe(null);
    expect(within(listItems[indexOfEditItem]).getByLabelText('description').textContent).toBe(initialDescription);

    // This time confirm the update
    const editBtn2El = within(listItems[indexOfEditItem]).getByRole('button', { name: 'edit' });
    fireEvent.click(editBtn2El);
    const input2El = within(
      await within(listItems[indexOfEditItem]).findByLabelText('list item field')
    ).getByRole('textbox');
    expect(input2El.getAttribute('value')).toBe(initialDescription);
    fireEvent.change(input2El, { target: { value: description }});
    expect(input2El.getAttribute('value')).toBe(description);
    const saveBtnEl = within(listItems[indexOfEditItem]).getByRole('button', { name: 'save' });
    fireEvent.click(saveBtnEl);
    await waitFor(() => expect(within(listItems[indexOfEditItem]).queryByLabelText('list item field')).toBe(null));
    expect(within(listItems[indexOfEditItem]).getByLabelText('description').innerHTML).toBe(description);
  });
});
