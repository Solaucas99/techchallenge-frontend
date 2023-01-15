import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function PopupDialog({
  message,
  title,
  callback,
}: {
  message: string;
  title: string;
  callback: (value: boolean) => void;
}) {
  return (
    <Dialog
      open
      // onClose={() => callback(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => callback(false)}>Não concordo</Button>
        <Button onClick={() => callback(true)} autoFocus>
          Concordo
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PopupDialog;
