import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled as muiStyled } from '@mui/material/styles';

const Container = muiStyled(Paper)(({ theme }) => ({
  width: '100%',
  padding: 16,
  boxSizing: 'border-box',
  borderRadius: 0,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.getContrastText(theme.palette.primary.main),
}));

export function Header() {
  return (
    <Box aria-label="header" component="nav" sx={{ width: '100%' }}>
      <Container>
        <Typography variant="h4" component="h4">
          Todo App
        </Typography>
      </Container>
    </Box>
  );
}