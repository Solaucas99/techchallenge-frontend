import React from 'react';
import { styled } from '../../Styles/stitches.config';
import { Container } from '../Useful/Container';
import { PageTitleH1 } from '../Useful/PageTitleH1';

import bug from '../../Assets/images/bug.jpg';
import gamification from '../../Assets/images/gamification.jpg';
import reward from '../../Assets/images/reward.png';
import competition from '../../Assets/images/competition.jpg';

const DescriptionDiv = styled('div', {
  width: '90%',
  height: '20em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '15px',
  background: '#353535',
  margin: '15px 0px',
  boxShadow: '4px 3px 15px 0px rgba(0,0,0,0.25)',

  '& div': {
    width: '60%',
  },

  '& img': {
    width: '22em',
    height: '12em',
    border: '4px solid white',
    outline: 'none',
  },

  '&:before': {
    content: '',
    borderLeft: '10px solid $$borderColor',
    height: '100%',
  },
});

function IntroCards() {
  return (
    <Container>
      <PageTitleH1>Bem vindo ao Tech Challenge</PageTitleH1>

      <DescriptionDiv
        css={{
          $$borderColor: '#fcdf03',
        }}
        data-aos="fade-right"
      >
        <div>
          <h2>Melhore suas habilidades</h2>
          <br />
          <p>
            O tech challenge é um sistema de desafios para que você evolua como
            agente e também como profissional. <br />A ideia é gerar
            profissionais que consigam superar desafios por conta própria e que
            consigam evoluir e trazer cada vez mais qualidade ao nosso projeto!
            Atinja habilidades superiores para lidar com desafios de JavaScript,
            HTML, complete códigos que precisam ser finalizados e responda
            perguntas em nosso quiz para atingir a sua melhor colocação!
          </p>
        </div>

        <img alt="Bug" src={bug} />
      </DescriptionDiv>

      <DescriptionDiv
        css={{
          $$borderColor: '#fc8c03',
        }}
        data-aos="fade-left"
      >
        <div>
          <h2>Atinja resultados relevantes</h2>
          <br />
          <p>
            Atinja níveis de habilidades e evolua com o passar do tempo.
            <br />
            Praticar sempre será a melhor opção, e por aqui a ideia de prática é
            totalmente viável. Teste seus conhecimentos e avance para ganhar
            habilidades e lidar melhor com seus problemas diariamente!
          </p>
        </div>

        <img alt="Gamification" src={gamification} />
      </DescriptionDiv>

      <DescriptionDiv
        css={{
          $$borderColor: '#db03fc',
        }}
        data-aos="fade-right"
      >
        <div>
          <h2>Competição e trabalho em equipe é a chave</h2>
          <br />
          <p>
            Com o poder da gamificação e desafio você terá mais motivação para
            praticar.
            <br />
            Veja soluções de outros companheiros de equipe e avalie a que você
            achar melhor. Competição saudável é a melhor maneira de se desafiar
            para aprender, portanto, compita com seus colegas para enviar a
            melhor solução para determinados desafios.
          </p>
        </div>

        <img alt="Competition" src={competition} />
      </DescriptionDiv>

      <DescriptionDiv
        css={{
          $$borderColor: '#84fc03',
        }}
        data-aos="fade-left"
      >
        <div>
          <h2>Receba recompensas pelo progresso</h2>
          <br />
          <p>
            O desempenho também tem seu papel relevante.
            <br />
            Seja recompensado pelo seu desempenho durante as atividades no
            quarter. Quanto mais desafios completar, mais chance de ficar no
            pódio você terá! E quem estiver no topo ao final do quarter, será
            recompensado por isso!
          </p>
        </div>

        <img alt="Reward" src={reward} />
      </DescriptionDiv>
    </Container>
  );
}

export default IntroCards;
