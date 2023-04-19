import React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';

interface Props {
  title: string;
  description: string;
  confirmBtnLabel: string;
  cancelBtnLabel: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmationDialog({
  title,
  description,
  confirmBtnLabel,
  cancelBtnLabel,
  isOpen,
  onCancel,
  onConfirm,
}: Props) {

  const onClickCancel = () => {
    onCancel();
  }

  const onClickConfirm = () => {
    onConfirm();
  }

  return (
    <Dialog aria-label="confirmation dialog" open={isOpen}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent aria-label="" dividers>
        <Typography>
          {description}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button aria-label="cancel" autoFocus onClick={onClickCancel}>
          {cancelBtnLabel}
        </Button>
        <Button aria-label="confirm" onClick={onClickConfirm}>
          {confirmBtnLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}