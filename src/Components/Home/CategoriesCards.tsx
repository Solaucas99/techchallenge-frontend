import React from 'react';
import { MdQuiz } from 'react-icons/md';
import { RiInputCursorMove } from 'react-icons/ri';
import { SiHtml5, SiJavascript } from 'react-icons/si';
import { Link } from 'react-router-dom';
import { styled } from '../../Styles/stitches.config';

import { Container } from '../Useful/Container';
import { PageTitleH1 } from '../Useful/PageTitleH1';

const CategoriesDiv = styled('div', {
  width: '100%',
  height: '30em',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  position: 'relative',
  flexWrap: 'wrap',
  padding: '60px',
  zIndex: 2,
});

const CategoriesBox = styled('div', {
  position: 'relative',
  width: '300px',
  height: '400px',
  background: '$defaultBlackPallete',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  '&:hover div.icon': {
    boxShadow: '0 0 0 4px #2e2e2e, 0 0 0 300px $$boxColor',
    background: '$$boxColor',
    color: '$defaultBlackPallete',
  },

  '&:hover h3, &:hover p': {
    color: '$defaultBlackPallete',
  },

  '&:hover a': {
    background: '$defaultBlackPallete',
    color: '$$boxColor',
  },

  '&:before': {
    content: '',
    position: 'absolute',
    inset: '-10px 30px',
    borderTop: '4px solid $$boxColor',
    borderBottom: '4px solid $$boxColor',
    zIndex: '-1',
    transform: 'skewY(7deg)',
    transition: 'all 0.5s ease-in-out',
  },

  '&:hover::before': {
    transform: 'skewY(0)',
    inset: '-10px 40px',
  },

  '&:after': {
    content: '',
    position: 'absolute',
    inset: '60px -10px',
    borderLeft: '4px solid $$boxColor',
    borderRight: '4px solid $$boxColor',
    zIndex: '-1',
    transform: 'skew(7deg)',
    transition: 'all 0.5s ease-in-out',
  },

  '&:hover::after': {
    transform: 'skew(0)',
    inset: '40px -10px',
  },
});

const CategoriesContent = styled('div', {
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  textAlign: 'center',
  gap: '20px',
  padding: '0 20px',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

const CategoriesIcon = styled('div', {
  color: '$$boxColor',
  width: '80px',
  height: '80px',
  boxShadow: '0 0 0 4px #2e2e2e, 0 0 0 6px $$boxColor',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '2.5em',
  background: '$defaultBlackPallete',
  transition: '0.5s ease-in-out',
});

const CategoriesText = styled('div', {
  '& h3': {
    fontSize: '1.5em',
    color: '#fff',
    fontWeight: '500',
    transition: '0.5s ease-in-out',
  },

  '& p': {
    color: '#999',
    transition: '0.5s ease-in-out',
  },

  '& a': {
    position: 'relative',
    background: '$$boxColor',
    color: '$defaultBlackPallete',
    padding: '8px 15px',
    display: 'inline-block',
    textDecoration: 'none',
    fontWeight: '500',
    marginTop: '10px',
    transition: '0.5s ease-in-out',
  },
});

function CategoriesCards() {
  return (
    <Container>
      <PageTitleH1>Categorias de Desafios</PageTitleH1>
      <CategoriesDiv>
        <CategoriesBox
          css={{
            $$boxColor: '#fcdf03',
          }}
        >
          <CategoriesContent>
            <CategoriesIcon className="icon">
              <SiJavascript />
            </CategoriesIcon>
            <CategoriesText>
              <h3>JavaScript</h3>
              <p>
                Teste seus conhecimentos na linguagem de programação mais
                utilizada no mundo. Aqui você terá desafios de arrays,
                variáveis, condições e muitos outros.
              </p>
              <Link to="/challenges/categories/js">Saiba Mais</Link>
            </CategoriesText>
          </CategoriesContent>
        </CategoriesBox>

        <CategoriesBox
          css={{
            $$boxColor: '#fc8c03',
          }}
        >
          <CategoriesContent>
            <CategoriesIcon className="icon">
              <SiHtml5 />
            </CategoriesIcon>
            <CategoriesText>
              <h3>HTML (DOM)</h3>
              <p>
                Teste seus conhecimentos em eventos JavaScript do DOM. Algo
                muito utilizado no nosso dia a dia como agente aqui no Webão.
                Será que você conseguirá completar os desafios?
              </p>
              <Link to="/challenges/categories/html">Saiba Mais</Link>
            </CategoriesText>
          </CategoriesContent>
        </CategoriesBox>

        <CategoriesBox
          css={{
            $$boxColor: '#db03fc',
          }}
        >
          <CategoriesContent>
            <CategoriesIcon className="icon">
              <MdQuiz />
            </CategoriesIcon>
            <CategoriesText>
              <h3>Quiz</h3>
              <p>
                Teste os seus conhecimentos respondendo desafios de quiz de
                perguntas e respostas. Cada quiz equivale a uma determinada
                pontuação e possuem 5 perguntas.
              </p>
              <Link to="/challenges/categories/quiz">Saiba Mais</Link>
            </CategoriesText>
          </CategoriesContent>
        </CategoriesBox>

        <CategoriesBox
          css={{
            $$boxColor: '#84fc03',
          }}
        >
          <CategoriesContent>
            <CategoriesIcon className="icon">
              <RiInputCursorMove />
            </CategoriesIcon>
            <CategoriesText>
              <h3>Complete o Código</h3>
              <p>
                Teste os seus conhecimentos preenchendo códigos incompletos com
                os pedaços corretos que faltam. É um ótimo teste quando se
                precisa melhorar a organização dos códigos.
              </p>
              <Link to="/challenges/categories/code-complete">Saiba Mais</Link>
            </CategoriesText>
          </CategoriesContent>
        </CategoriesBox>
      </CategoriesDiv>
    </Container>
  );
}

export default CategoriesCards;
