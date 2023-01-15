import { keyframes } from '@stitches/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '../../Styles/stitches.config';

import coin from '../../Assets/images/coin.png';

const InfoBackground = styled('div', {
  width: '100%',
  height: '100vh',
  position: 'fixed',
  zIndex: '10',
  background: '#2c2525e9',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const InfoContainer = styled('div', {
  width: '60%',
  height: '75%',
  background: '#FFBB00',
  border: '5px solid #FF7701',
  padding: '10px',
  fontSize: '1.5em',
  fontFamily: '"VT323", monospace;',
  textShadow: '0px 0px 2px #000000',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
});

const CloseButton = styled('button', {
  border: 'none',
  boxShadow: 'none',
  outline: 'none',
  height: '2em',
  width: '2em',
  background: 'none',
  position: 'absolute',
  top: '5px',
  right: '5px',
  fontSize: '2em',
  fontFamily: '"VT323", monospace;',
  cursor: 'pointer',
  color: 'red',
  transition: 'all 0.5s ease-out',

  '&:hover': {
    color: 'black',
  },
});

const coinAnimation = keyframes({
  '0%': { bottom: '10px' },
  '50%': { bottom: '20px' },
  '100%': { bottom: '10px' },
});

const CoinImage = styled('img', {
  position: 'absolute',
  width: '1.5em',
  height: '1.5em',
  zIndex: '-1',
  bottom: '10px',
  right: '10px',

  animation: `${coinAnimation} 700ms infinite`,
});

export function Info({ enableInfoCallback }) {
  return (
    <InfoBackground>
      <InfoContainer className="animate__animated animate__bounceIn">
        <Link to="/page-not-found">
          <CoinImage alt="coin" src={coin} />
        </Link>
        <h4>Hello world! </h4>

        <p>
          Você está no TechChallenge, o sistema de desafios do webão! Seja bem
          vindo. <br />
          <br />
          Estamos felizes em te receber aqui! Aqui você poderá testar seus
          conhecimentos em código e também no geral sobre as tarefas que
          enfrentamos em nosso dia a dia aqui no webão. <br />
          <br />
          Aqui temos desafios de JavaScript, HTML, Quiz e até mesmo desafio para
          completar códigos, todos específicos para o nosso contexto de
          trabalho. <br />
          <br />
          Também incentivamos o aprendizado em equipe, portanto você pode
          compartilhar suas soluções com colegas de trabalho e assim interagir,
          aprender continuamente e competir. Acha que dá conta? Comece agora
          mesmo!
        </p>

        <CloseButton onClick={() => enableInfoCallback(false)}>X</CloseButton>
      </InfoContainer>
    </InfoBackground>
  );
}
