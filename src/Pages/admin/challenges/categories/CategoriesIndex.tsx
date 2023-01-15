import React from 'react';
import { MdQuiz } from 'react-icons/md';
import { RiInputCursorMove } from 'react-icons/ri';
import { SiHtml5, SiJavascript } from 'react-icons/si';
import { styled } from '../../../../Styles/stitches.config';

const ContainerBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100vh',
});

const CategoriesDiv = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  width: '80%',
  height: '24em',
  background: '#2e2e2e',
  gap: '20px',
});

const DivIcon = styled('div', {
  boxShadow: '0 0 0 4px #2e2e2e, 0 0 0 6px $$boxColor',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#2e2e2e',
  height: '100px',
  width: '100px',
});

const ButtonCreate = styled('a', {
  position: 'relative',
  background: '$$bgColor',
  color: '#2e2e2e',
  padding: '5px 10px',
  display: 'inline-block',
  textDecoration: 'none',
  fontWeight: '500',
  marginTop: '10px',
  transition: '0.5s ease-in-out',
  cursor: 'pointer',
  zIndex: '4',

  '&:hover': {
    color: '$$bgColor',
    background: 'purple',
  },
});

const CategoriesBox = styled('div', {
  background: '#2e2e2e',
  height: '280px',
  width: '230px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around',
  fontSize: '1.3em',
  boxShadow: '0px 6px 17px 3px rgba(0,0,0,0.45)',
  borderRadius: '5px',
  position: 'relative',
  gap: '20px',
  zIndex: '2',
  overflow: 'hidden',
  transition: 'all 0.5s ease-in-out',

  '& h4': {
    zIndex: '3',
    position: 'relative',
  },

  '& div.icon': {
    fontSize: '4em',
    color: '$$bgColor',
    transition: 'all 0.5s ease-in-out',
    zIndex: '1',
    position: 'relative',
  },

  '&:hover div.icon': {
    boxShadow: '0 0 0 4px #2e2e2e, 0 0 0 150px $$bgColor',
    color: '#2e2e2e',
    background: '$$bgColor',
  },

  '&:hover a': {
    color: '$$bgColor',
    background: '#2e2e2e',
  },

  '&:hover': {
    background: '$$bgColor',
    color: '#2e2e2e',
  },
});

function CategoriesIndex() {
  return (
    <ContainerBody>
      <h1>Criar desafio</h1>
      <CategoriesDiv>
        <CategoriesBox
          css={{
            $$bgColor: '#fcdf03',
          }}
        >
          <h4>JavaScript</h4>
          <DivIcon className="icon">
            <SiJavascript />
          </DivIcon>

          <ButtonCreate href="#hello">Criar desafio</ButtonCreate>
        </CategoriesBox>

        <CategoriesBox
          css={{
            $$bgColor: '#fc8c03',
          }}
        >
          <h4>HTML (DOM)</h4>
          <DivIcon className="icon">
            <SiHtml5 />
          </DivIcon>

          <ButtonCreate href="#hello">Criar desafio</ButtonCreate>
        </CategoriesBox>

        <CategoriesBox
          css={{
            $$bgColor: '#db03fc',
          }}
        >
          <h4>Quiz</h4>
          <DivIcon className="icon">
            <MdQuiz />
          </DivIcon>

          <ButtonCreate href="#hello">Criar desafio</ButtonCreate>
        </CategoriesBox>

        <CategoriesBox
          css={{
            $$bgColor: '#84fc03',
          }}
        >
          <h4>Code Complete</h4>
          <DivIcon className="icon">
            <RiInputCursorMove />
          </DivIcon>

          <ButtonCreate href="#hello">Criar desafio</ButtonCreate>
        </CategoriesBox>
      </CategoriesDiv>
    </ContainerBody>
  );
}

export default CategoriesIndex;
