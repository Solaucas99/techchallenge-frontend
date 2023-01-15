import React from 'react';
import { styled } from '../../Styles/stitches.config';
import { Container } from '../Useful/Container';
import { PageTitleH1 } from '../Useful/PageTitleH1';

const ProjectPurposeDiv = styled('div', {
  width: '90%',
  height: '10em',
  background: '$defaultBlackPallete',
  fontSize: '1.2em',
  display: 'flex',
  padding: '15px',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '15px 0px',
  boxShadow: '4px 3px 15px 0px rgba(0,0,0,0.25)',

  '&:before': {
    content: '',
    borderLeft: '5px solid green',
    height: '100%',
  },

  '& p': {
    marginLeft: '15px',
  },
});

function PurposeCard() {
  return (
    <Container>
      <PageTitleH1>Um projeto feito com ❤️</PageTitleH1>
      <ProjectPurposeDiv>
        <p>
          Esse projeto foi feito visando ajudar a todos os colaboradores e pra
          ser um motivador para que vocês pratiquem. A ideia é não só ajudar,
          mas também formar profissionais que tenham a capacidade para
          solucionar problemas complexos e por conta própria. A autonomia é a
          melhor façanha que um profissional pode alcançar, e queremos te ajudar
          com isso. Apenas com dedicação e esforço você pode alcançar o caminho
          desejado. Obrigado pela sua participação e lembre-se: Seu feedback
          sempre é importante 😎
        </p>
      </ProjectPurposeDiv>
    </Container>
  );
}

export default PurposeCard;
