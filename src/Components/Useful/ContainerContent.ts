import { styled } from '../../Styles/stitches.config';

export const ContainerContent = styled('div', {
  width: '100%',
  marginTop: '80px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
  background: '#1C1C1C',
  gap: '10px',
  padding: '20px',
  borderRadius: '5px',
  position: 'relative',
  boxShadow: '4px 3px 15px 0px rgba(0,0,0,0.25)',
  border: '5px solid #303133',

  '&:before': {
    content: '',
    borderLeft: '10px solid green',
    height: '90%',
    position: 'absolute',
    left: '15px',
  },
});
