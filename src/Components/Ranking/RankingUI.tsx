import React from 'react';
import { FaCrown } from 'react-icons/fa';
import { styled } from '../../Styles/stitches.config';
import { IRanking } from '../../Types/entities/IRanking';

const RankingContainer = styled('div', {
  height: '700px',
  width: '100%',
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around',
  padding: '10px',
});

const RankingTop3 = styled('div', {
  height: '40%',
  width: '40%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

const RankingListDiv = styled('div', {
  height: '90%',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  padding: '15px',
  overflow: 'hidden',
  justifyContent: 'center',

  '& ul': {
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
    alignItems: 'center',
    overflow: 'auto',

    '& li': {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '15px 0px',

      '&:not(:last-child)': {
        borderBottom: '1px solid gray',
      },

      '& span': {
        fontSize: '17px',
      },

      '& div.details': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        background: '#EEEEEE1A',
        borderRadius: '50px',
        gap: '120px',

        '& div': {
          alignSelf: 'flex-start',
          marginLeft: '-3px',
        },
      },
    },
  },
});

const RankingHeader = styled('div', {
  width: '150px',
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'flex-end',
  position: 'relative',
  overflow: 'hidden',
  justifyContent: 'center',
  flexDirection: 'column',

  '&:nth-child(2)': {
    alignSelf: 'flex-start',
  },
});

const RankingAvatar = styled('div', {
  display: 'flex',
  width: '65px',
  height: '65px',
  borderRadius: '50%',
  background: 'purple',
  justifyContent: 'center',
  alignItems: 'center',
});

function RankingUI({ ranking }: { ranking: IRanking[] }) {
  const top3Ranking = ranking.slice(0, 3);

  return (
    <RankingContainer>
      <RankingTop3>
        <RankingHeader>
          <h3>2</h3>

          <FaCrown color="#adadad" />

          <RankingAvatar
            css={{
              border: '3px solid #adadad',
              boxShadow: '2px 3px 32px -2px #adadad',
            }}
          >
            <h2>{top3Ranking[1].username.split('')[0].toUpperCase()}</h2>
          </RankingAvatar>

          <span>@{top3Ranking[1].username}</span>

          <span>{top3Ranking[1].score} pts</span>
        </RankingHeader>

        <RankingHeader>
          <h3>1</h3>

          <FaCrown color="#ffbf00" />

          <RankingAvatar
            css={{
              width: '80px',
              height: '80px',
              border: '3px solid #ffbf00',
              boxShadow: '2px 3px 32px -2px #ffbf00bf',
            }}
          >
            <h1>{top3Ranking[0].username.split('')[0].toUpperCase()}</h1>
          </RankingAvatar>

          <span>@{top3Ranking[0].username}</span>

          <span>{top3Ranking[0].score} pts</span>
        </RankingHeader>

        <RankingHeader>
          <h3>3</h3>

          <FaCrown color="#b93e22" />

          <RankingAvatar
            css={{
              border: '3px solid #b93e22',
              boxShadow: '2px 3px 32px -2px #b93e22',
            }}
          >
            <h2>{top3Ranking[2].username.split('')[0].toUpperCase()}</h2>
          </RankingAvatar>

          <span>@{top3Ranking[2].username}</span>

          <span>{top3Ranking[2].score} pts</span>
        </RankingHeader>
      </RankingTop3>

      {ranking.length > 3 ? (
        <RankingListDiv>
          <ul>
            {ranking.slice(3).map(user => (
              <li key={user.user_id}>
                <span>{ranking.indexOf(user) + 1}</span>

                <div className="details">
                  <RankingAvatar>
                    <h2>{user.username.split('')[0].toUpperCase()}</h2>
                  </RankingAvatar>
                  <span>{user.username}</span>
                  <span>{user.score} pts</span>
                </div>
              </li>
            ))}
          </ul>
        </RankingListDiv>
      ) : (
        'Só há um top 3 no momento. Volte mais tarde para verificar se mais usuários completaram desafios!'
      )}
    </RankingContainer>
  );
}

export default RankingUI;
