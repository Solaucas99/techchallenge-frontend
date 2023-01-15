import React from 'react';
import TypewriterComponent from 'typewriter-effect';
import { styled } from '../../Styles/stitches.config';

const TypingDiv = styled('div', {
  height: '10em',
  width: '13em',
  background: '#bd2800',
  position: 'absolute',
  top: '5em',
  right: '10em',

  '& div': {
    fontSize: '35px',
    padding: '5px',
    fontFamily: '"VT323", monospace;',
    color: '#fbe1c0',
  },
});

function Typing() {
  return (
    <TypingDiv>
      <TypewriterComponent
        options={{
          strings: ['Tech Challenge </>'],
          autoStart: true,
          loop: true,
        }}
      />
    </TypingDiv>
  );
}

export default Typing;
