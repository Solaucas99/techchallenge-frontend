import React from 'react';
import { Container } from '../../Components/Useful/Container';
import { ContainerContent } from '../../Components/Useful/ContainerContent';
import { PageTitleH1 } from '../../Components/Useful/PageTitleH1';
import { styled } from '../../Styles/stitches.config';

const AboutContent = styled('div', {
  width: '90%',
  fontSize: '18px',
});

function About() {
  return (
    <Container>
      <ContainerContent>
        <PageTitleH1>Sobre</PageTitleH1>

        <AboutContent>
          <p>
            Esse projeto foi feito visando ajudar a todos os colaboradores e pra
            ser um motivador para que vocês pratiquem. A ideia é não só ajudar,
            mas também formar profissionais que tenham a capacidade para
            solucionar problemas complexos e por conta própria. A autonomia é a
            melhor façanha que um profissional pode alcançar, e queremos te
            ajudar com isso. Apenas com dedicação e esforço você pode alcançar o
            caminho desejado. Obrigado pela sua participação e lembre-se: Seu
            feedback sempre é importante 😎
          </p>
        </AboutContent>
      </ContainerContent>
    </Container>
  );
}

export default About;
