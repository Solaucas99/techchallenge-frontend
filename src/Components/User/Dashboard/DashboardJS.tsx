import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import CodeMirrorSolution from '../../Solutions/CodeMirrorSolution';
import { styled } from '../../../Styles/stitches.config';
import { IJS_Solution } from '../../../Types/entities/IJS_Solution';
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

const SolutionsDiv = styled('ul', {
  width: '90%',
  padding: '15px',
  background: '$background',
  boxShadow: '4px 3px 15px 0px rgba(0,0,0,0.25)',
  borderRadius: '5px',
  position: 'relative',

  '&:before': {
    content: '',
    borderLeft: '5px solid green',
    height: '95%',
    position: 'absolute',
    left: '15px',
  },
});

const SolutionsList = styled('ul', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  listStyle: 'none',
  height: '1000px',
  overflow: 'auto',

  '& li': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '15px 5px',

    '&:not(:first-child)': {
      marginTop: '15px',
    },

    '&:not(:last-child)': {
      borderBottom: '1px solid #ffffff1a',
    },
  },
});

function DashboardJS() {
  const [solutions, setSolutions] = useState<IJS_Solution[]>([]);
  const [challengesNumber, setChallengesNumber] = useState<number>(0);

  const { setAppContext } = useAppContextProvider();
  const { userContext } = useUserContextProvider();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolutionsData = async () => {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
      try {
        const { data } = await instanceAPI.get<IAxiosGet<IJS_Solution[]>>(
          `/solutions/js/user/${userContext.id}`
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
        const { data } = await instanceAPI.get<IAxiosGet<IJS_Solution[]>>(
          `/challenges/js`
        );

        if (!data.result) {
          setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
          toast.error('Erro ao procurar desafios JS');
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
    <>
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

          <div
            data-aos="fade-right"
            className="animate__animated animate__fadeInRight likes"
          >
            <span>Likes em soluções</span>
            <br />
            {solutions.length > 0 && (
              <h3>
                {solutions.reduce((acc, next) => acc + next.Likes.length, 0)}
              </h3>
            )}
          </div>
        </div>
      </Metrics>

      <Metrics>
        <h3>Soluções</h3>
        <br />
        <SolutionsDiv className="animate__animated animate__fadeInUp">
          <SolutionsList>
            {solutions.length > 0 &&
              solutions.map(solution => (
                <li key={solution.id}>
                  <h3>{solution.JS_Challenge.title}</h3>
                  <br />
                  <CodeMirrorSolution
                    solutionId={solution.id}
                    solutionType="js"
                    codeUrl={solution.solution_submitted}
                    username={solution.User.username}
                    likes={solution.Likes.length}
                  />
                  <br />
                  <Link
                    to={`/challenges/categories/js/${solution.JS_Challenge.id}/solutions`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button variant="outlined" type="button">
                      Ver todas as soluções para este desafio
                    </Button>
                  </Link>
                </li>
              ))}
          </SolutionsList>
        </SolutionsDiv>
        <br />
      </Metrics>
    </>
  );
}

export default DashboardJS;
