import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import { styled } from '../../../Styles/stitches.config';
import { IQuiz_Solution } from '../../../Types/entities/IQuiz_Solution';
import { instanceAPI } from '../../../Utils/axios';
import { useAppContextProvider } from '../../../Providers/AppContextProvider';
import { useUserContextProvider } from '../../../Providers/UserContextProvider';
import { IAxiosGet } from '../../../Types/interfaces/IAxiosRequests';

const Metrics = styled('div', {
  width: '90%',
  borderRadius: '10px',
  padding: '20px 10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  '& div.solutions, & div.likes': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '$background',
    padding: '15px',
    boxShadow: '4px 3px 15px 0px rgba(0,0,0,0.25)',
    borderRadius: '5px',
    width: '40%',
    position: 'relative',

    '&:before': {
      content: '',
      borderLeft: '5px solid green',
      height: '80%',
      position: 'absolute',
      left: '15px',
    },
  },

  '& div.stats': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
});

function DashboardQuiz() {
  const [solutions, setSolutions] = useState<IQuiz_Solution[]>([]);
  const [challengesNumber, setChallengesNumber] = useState<number>(0);

  const { setAppContext } = useAppContextProvider();
  const { userContext } = useUserContextProvider();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolutionsData = async () => {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
      try {
        const { data } = await instanceAPI.get<IAxiosGet<IQuiz_Solution[]>>(
          `/solutions/quiz/user/${userContext.id}`
        );

        setSolutions([...data.result]);
        setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
      } catch (err) {
        setAppContext(prevContext => ({ ...prevContext, isLoading: false }));

        if (err.response.status === 404) {
          navigate('/page-not-found');
        }

        if (err.response?.data?.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error('Erro inesperado! Tente novamente mais tarde');
        }
      }
    };

    fetchSolutionsData();

    const fetchChallengesNumber = async () => {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));

      try {
        const { data } = await instanceAPI.get<IAxiosGet<IQuiz_Solution[]>>(
          `/challenges/quiz`
        );

        if (!data.result) {
          setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
          toast.error('Erro ao procurar desafios Quiz');
          return;
        }

        setChallengesNumber(data.result.length);
        setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
      } catch (err) {
        setAppContext(prevContext => ({ ...prevContext, isLoading: false }));

        if (err.response.status === 404) {
          navigate('/page-not-found');
        }

        if (err.response?.data?.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error('Erro inesperado! Tente novamente mais tarde');
        }
      }
    };

    fetchChallengesNumber();
  }, [userContext.id, navigate, setAppContext]);

  return (
    <Metrics>
      <h3>Stats</h3>
      <br />
      <div className="stats">
        <div className="animate__animated animate__fadeInLeft solutions">
          <span>
            Desafios completados: {solutions.length}/{challengesNumber}
          </span>
          <br />
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              value={
                Math.ceil((solutions.length * 100) / challengesNumber) || 0
              }
              variant="determinate"
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
              >
                {Math.ceil((solutions.length * 100) / challengesNumber) || 0}%
              </Typography>
            </Box>
          </Box>
        </div>
      </div>
    </Metrics>
  );
}

export default DashboardQuiz;
