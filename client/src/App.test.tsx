import React from 'react';
import { screen, within, render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it.only('should render the App correctly without any data', () => {
    render(<App />);

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
});
