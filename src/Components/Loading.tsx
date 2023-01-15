import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import { styled } from '../Styles/stitches.config';

const LoadingContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#121212F3',
  position: 'fixed',
  zIndex: 1000,
  width: '100%',
  height: '100vh',
});

function Loading() {
  return (
    <LoadingContainer>
      <h1>Carregando...</h1>
      <br />
      <CircularProgress color="secondary" />
    </LoadingContainer>
  );
}

export default Loading;
