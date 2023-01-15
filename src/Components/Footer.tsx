import React from 'react';
import { styled } from '../Styles/stitches.config';

const FooterContainer = styled('div', {
  width: '100%',
  background: '#2e2e2e',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around',
  position: 'relative',
  borderTop: '5px solid green',
  overflowX: 'hidden',
  // clear: 'both',
  height: '10%',
  bottom: '0',
  padding: '1%',
});

function Footer() {
  return (
    <FooterContainer>
      <h4>Feito por WebTech Team (SAO-SKY)</h4>
    </FooterContainer>
  );
}

export default Footer;
