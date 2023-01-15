import { styled } from '../../../Styles/stitches.config';

export const PageContent = styled('div', {
  width: '60%',
  height: '100%',
  position: 'absolute',
  background: '$background',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  right: '0',
  borderLeft: '2px solid $defaultGrayPallete',
});

export const Form = styled('form', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

export const PageButton = styled('button', {
  outline: 'none',
  border: 'none',
  background: 'transparent',
  textDecoration: 'underline',
  color: 'blue',
  fontSize: 'inherit',
  cursor: 'pointer',
  transition: 'all 0.5s ease-in-out',

  '&:hover': {
    color: 'inherit',
  },
});
