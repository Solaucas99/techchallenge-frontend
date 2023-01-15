import React from 'react';
import { GiBrokenHeart } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { styled } from '../Styles/stitches.config';
import { Container } from './Useful/Container';

const ContainerContent = styled('div', {
  width: '100%',
  marginTop: '80px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
  gap: '10px',
  padding: '20px',
  borderRadius: '5px',
  position: 'relative',
});

const GameIframe = styled('div', {
  width: '80%',
  height: '550px',

  '& iframe': {
    background: '#fff',
    display: 'block',
    width: '100%',
    maxWidth: '848px',
    height: '509px',
    margin: '20px auto 10px',
    border: '10px solid #2e2e2e',
    boxSizing: 'border-box',
  },
});

function NotFound() {
  return (
    <Container>
      <ContainerContent>
        <h1>Oops</h1>
        <GiBrokenHeart color="red" size={73} />
        <h3>404 - Not Found</h3>

        <p>A página que você estava procurando não foi encontrada...</p>
        <p>
          <Link to="/">Clique aqui</Link> para voltar a página inicial.
        </p>
        <p>
          Ou se divirta abaixo...(Clique dentro do iFrame para iniciar o jogo)
        </p>

        <GameIframe>
          <iframe
            title="mini-game"
            src="https://playmarioonline.com/play/mario.html"
          />
        </GameIframe>
      </ContainerContent>
    </Container>
  );
}

export default NotFound;
