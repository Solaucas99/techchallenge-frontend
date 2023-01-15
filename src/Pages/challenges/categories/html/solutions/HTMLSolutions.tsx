import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import CodeMirrorSolution from '../../../../../Components/Solutions/CodeMirrorSolution';
import { Container } from '../../../../../Components/Useful/Container';
import { ContainerContent } from '../../../../../Components/Useful/ContainerContent';
import { PageTitleH1 } from '../../../../../Components/Useful/PageTitleH1';
import { useAppContextProvider } from '../../../../../Providers/AppContextProvider';
import { useUserContextProvider } from '../../../../../Providers/UserContextProvider';
import { styled } from '../../../../../Styles/stitches.config';
import { IHTML_Solution } from '../../../../../Types/entities/IHTML_Solution';
import { IAxiosGet } from '../../../../../Types/interfaces/IAxiosRequests';
import { instanceAPI } from '../../../../../Utils/axios';

const SolutionsDiv = styled('ul', {
  width: '90%',
  padding: '15px',
});

const SolutionsList = styled('ul', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  listStyle: 'none',
  height: '500px',
  overflow: 'auto',

  '& li': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',

    '&:not(:first-child)': {
      marginTop: '15px',
    },
  },
});

function HTMLSolutions() {
  const [solutions, setSolutions] = useState<IHTML_Solution[]>([]);
  const { setAppContext } = useAppContextProvider();
  const { userContext } = useUserContextProvider();

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
      try {
        const { data } = await instanceAPI.get<IAxiosGet<IHTML_Solution[]>>(
          `/solutions/html/challenge/${id}`
        );

        if (
          !data.result.some(solution => solution.user_id === userContext.id)
        ) {
          setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
          navigate('/page-not-found');
          return;
        }

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

    fetchData();
  }, [id, userContext.id, navigate, setAppContext]);
  return (
    <Container>
      <ContainerContent>
        <PageTitleH1>Soluções</PageTitleH1>

        <SolutionsDiv>
          <SolutionsList>
            {solutions.length > 0 &&
              solutions.map(solution => (
                <li key={solution.id}>
                  <CodeMirrorSolution
                    solutionId={solution.id}
                    solutionType="html"
                    codeUrl={solution.solution_submitted}
                    username={solution.User.username}
                    likes={solution.Likes.length}
                  />
                </li>
              ))}
          </SolutionsList>
        </SolutionsDiv>
      </ContainerContent>
    </Container>
  );
}

export default HTMLSolutions;
