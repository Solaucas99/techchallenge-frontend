import { keyframes } from '@stitches/react';
import React from 'react';
import { AiOutlineArrowDown } from 'react-icons/ai';
import { styled } from '../../Styles/stitches.config';
import coinSound from '../../Assets/sound/smw_coin.wav';

const scaleUp = keyframes({
  '0%': { top: '0' },
  '50%': { top: '-10px' },
  '100%': { top: '0' },
});

const AnimatedArrow = styled(AiOutlineArrowDown, {
  position: 'relative',
  animation: `${scaleUp} 1000ms infinite`,
});

const QuestionDiv = styled('div', {
  position: 'absolute',
  top: '30%',
  right: '50%',
  fontFamily: '"VT323", monospace;',
  fontSize: '23px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
  height: '7em',
  zIndex: '1',
});

const QuestionButton = styled('button', {
  display: 'flex',
  height: '4.5em',
  width: '4.5em',
  background: '#FFBB00',
  alignItems: 'center',
  justifyContent: 'center',
  border: '5px solid #FF7701',
  cursor: 'pointer',
  transition: 'all 0.5s ease-out',

  '&:hover': {
    background: '#bb8900',
  },

  '& p': {
    fontSize: '55px',
    padding: '5px',
    fontFamily: '"VT323", monospace;',
    color: '#fbe1c0',
    textShadow: '2px 2px rgba(0,0,0,0.75)',
  },
});

function QuestionBlock({ enableInfoCallback }) {
  return (
    <QuestionDiv>
      <p>Clique aqui!</p>
      <AnimatedArrow />
      <QuestionButton
        onClick={async () => {
          const sound = new Audio(coinSound);
          await sound.play();
          enableInfoCallback(true);
        }}
      >
        <p>?</p>
      </QuestionButton>
    </QuestionDiv>
  );
}

export default QuestionBlock;
