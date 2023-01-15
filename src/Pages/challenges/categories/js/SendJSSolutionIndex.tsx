// import { html } from '@codemirror/lang-html';
import React, { useEffect, useRef, useState } from 'react';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';
import { Button, CircularProgress } from '@mui/material';
import { basicSetup, EditorView } from 'codemirror';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdHome } from 'react-icons/md';
import { BiCategory } from 'react-icons/bi';
import { IoLogoJavascript } from 'react-icons/io';

import { styled } from '../../../../Styles/stitches.config';
import TestUI from '../../../../Components/TestUI';
import { instanceAPI, instanceTests } from '../../../../Utils/axios';
import { IJS_Challenge } from '../../../../Types/entities/IJS_Challenge';
import {
  IAxiosGet,
  IAxiosPost,
} from '../../../../Types/interfaces/IAxiosRequests';
import { IMochaTestJSON } from '../../../../Types/interfaces/ITest';
import { useUserContextProvider } from '../../../../Providers/UserContextProvider';
import { IJS_Solution } from '../../../../Types/entities/IJS_Solution';
import { useAppContextProvider } from '../../../../Providers/AppContextProvider';
import {
  CodeMirrorCustomTheme,
  CodeMirrorDraft,
} from '../../../../Utils/codeMirrorSettings';
import { database } from '../../../../Utils/offlineDB';
import Breadcrumbs from '../../../../Components/Breadcrumbs';

type CodeDraft = {
  id: string;
  code: string;
};

const ParentContainer = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: '5px',
});

const ContentContainer = styled('div', {
  height: '75vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  marginTop: '70px',
});

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  height: '100%',
  width: '45%',
  alignItems: 'center',
});

const CodeContainer = styled('div', {
  width: '100%',
  height: '100%',
});

const InstructionContainer = styled('div', {
  width: '45%',
  height: '90%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  background: '#2e2e2e',
  borderRadius: '5px',
  boxShadow: '0px 6px 17px 3px rgba(0,0,0,0.45)',
});

const BlockView = styled('div', {
  padding: '15px 5px 15px 5px',
  width: '100%',
  height: '90%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  background: '#2e2e2e',
  borderRadius: '5px',
  boxShadow: '0px 6px 17px 3px rgba(0,0,0,0.45)',
  overflow: 'hidden',

  '& h4': {
    marginBottom: '6px',
  },
});

const BlockViewFullW = styled('div', {
  padding: '5px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: '#2e2e2e',

  '& h4': {
    marginBottom: '6px',
  },
});

const ButtonsContainer = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
});

const offline_db = database('challenges', 'js_solutions');

function SendJSSolutionIndex() {
  const [view, setView] = useState<EditorView>();
  const [tab, setTab] = useState<string>('1');
  const [testResult, setTestResult] = useState<IMochaTestJSON | null>(null);
  const [challengeInfo, setChallengeInfo] = useState<IJS_Challenge | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams();
  const ref = useRef<HTMLDivElement>();

  const { userContext } = useUserContextProvider();
  const { setAppContext } = useAppContextProvider();

  const navigate = useNavigate();

  const breadcrumbsPrevPages = [
    { title: 'Home', icon: <MdHome />, to: '/' },
    {
      title: 'Categorias',
      icon: <BiCategory />,
      to: '/challenges/categories',
    },
    {
      title: 'JavaScript',
      icon: <IoLogoJavascript />,
      to: '/challenges/categories/js',
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const handleTestSubmit = async (e: React.MouseEvent) => {
    try {
      setTab('2');
      setIsLoading(true);
      e.stopPropagation();

      const code = view.state.doc.toString();

      if (
        !code.includes('function fnTeste') ||
        !code.includes('module.exports =')
      ) {
        toast.error(
          'Para a solução funcionar corretamente, o nome da função deve ser "fnTeste" e ela deve ser exportada como module'
        );
        setIsLoading(false);
        return;
      }

      const { data } = await instanceTests.post<IAxiosPost<IMochaTestJSON>>(
        '/tests/run',
        {
          code: view.state.doc.toString(),
          challenge_id: id,
          user_id: userContext.id,
          challenge_type: 'js',
        }
      );

      setTestResult({ ...data.result });

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Erro inesperado! Tente novamente mais tarde');
      }
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    try {
      setTab('2');
      setIsLoading(true);
      e.stopPropagation();

      if (testResult.stats.failures) {
        toast.error(
          'Oops, para enviar uma solução, seu código deverá passar nos testes primeiro!'
        );
        return;
      }

      const { data: solution } = await instanceAPI.post<
        IAxiosPost<IJS_Solution>
      >('/solutions/js/create', {
        js_challenge_id: id,
        user_id: userContext.id,
      });

      if (!solution.result.id) {
        toast.error(
          'Erro desconhecido ao enviar a solução. Tente novamente mais tarde'
        );
        return;
      }

      await offline_db.delete_by_id(id);

      setIsLoading(false);
      toast.success('A solução foi enviada com sucesso!');
      navigate('solutions');
    } catch (err) {
      setIsLoading(false);
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Erro inesperado! Tente novamente mais tarde');
      }
    }
  };

  useEffect(() => {
    const userCompletedChallenge = async () => {
      try {
        setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
        const { data } = await instanceAPI.get<IAxiosGet<IJS_Solution[]>>(
          `/solutions/js/challenge/${id}/${userContext.id}`
        );

        if (data.result.length > 0) {
          setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
          toast.error('Ops, você já completou esse desafio!');
          navigate(`/challenges/categories/js`);
          return;
        }
      } catch (err) {
        setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
        if (err.response?.data?.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error('Erro inesperado! Tente novamente mais tarde');
        }
      }
    };

    userCompletedChallenge();

    const fetchData = async () => {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
      try {
        const { data } = await instanceAPI.get<IAxiosGet<IJS_Challenge>>(
          `/challenges/js/${id}`
        );

        setChallengeInfo({ ...data.result });
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

    const mountCodeMirror = async () => {
      try {
        setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
        const solutionCode = await offline_db.read_by_id<CodeDraft>(id);

        if (solutionCode) {
          toast.warning(
            'Ops, parece que você já estava criando uma solução para esse desafio anteriormente. Trouxemos o seu rascunho.'
          );

          const CmView = new EditorView({
            state: EditorState.create({
              extensions: [
                basicSetup,
                javascript(),
                CodeMirrorCustomTheme,
                CodeMirrorDraft(offline_db, id),
              ],
              doc: solutionCode.code,
            }),
            parent: ref.current,
          });

          setView(CmView);

          setAppContext(prevContext => ({
            ...prevContext,
            isLoading: false,
          }));
          return;
        }

        const { data } = await instanceAPI.get<string>(
          `/challenges/js/${id}/start/start.js`
        );

        const CmView = new EditorView({
          state: EditorState.create({
            extensions: [
              basicSetup,
              javascript(),
              CodeMirrorCustomTheme,
              CodeMirrorDraft(offline_db, id),
            ],
            doc: data,
          }),
          parent: ref.current,
        });

        setView(CmView);
        setAppContext(prevContext => ({
          ...prevContext,
          isLoading: false,
        }));
        return;
      } catch (err) {
        setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
        if (err.response?.data?.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error('Erro inesperado! Tente novamente mais tarde');
        }
      }
    };

    mountCodeMirror();
  }, [id, userContext.id, navigate, setAppContext]);

  return (
    <ParentContainer>
      <Breadcrumbs
        prevPages={breadcrumbsPrevPages}
        actualPage={{ title: challengeInfo?.title }}
      />
      <ContentContainer>
        <InstructionContainer>
          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleTabChange}
                aria-label="lab API tabs example"
              >
                <Tab sx={{ color: 'white' }} label="Instruções" value="1" />
                <Tab
                  sx={{ color: 'white' }}
                  label="Saída (Resultado)"
                  value="2"
                />
              </TabList>
            </Box>
            <TabPanel sx={{ width: '100%', height: '100%' }} value="1">
              <BlockViewFullW>
                <h3>{challengeInfo?.title && challengeInfo?.title}</h3>
                <br />
                <p>
                  {challengeInfo?.instruction || 'Nenhuma instrução encontrada'}
                </p>
                <br />
                {challengeInfo?.pontuation && (
                  <p style={{ fontWeight: 'bold' }}>
                    {challengeInfo.pontuation <= 3 && 'Nível: Fácil'}
                    {challengeInfo.pontuation >= 4 &&
                      challengeInfo.pontuation <= 7 &&
                      'Nível: Médio'}
                    {challengeInfo.pontuation >= 8 && 'Nível: Difícil'}
                  </p>
                )}
                <p style={{ fontWeight: 'bold' }}>
                  Pontuação:{' '}
                  {challengeInfo?.pontuation && challengeInfo?.pontuation}
                </p>
              </BlockViewFullW>
            </TabPanel>
            <TabPanel sx={{ width: '100%', height: '100%' }} value="2">
              {isLoading && <CircularProgress />}
              {!isLoading && testResult && <TestUI testResult={testResult} />}
              {!isLoading &&
                !testResult &&
                'Os resultados dos testes apareceram aqui assim que a solução for enviada'}
            </TabPanel>
          </TabContext>
        </InstructionContainer>

        <Container>
          <BlockView>
            <h4>Solution.js</h4>
            <CodeContainer ref={ref} />
          </BlockView>
        </Container>
      </ContentContainer>

      <ButtonsContainer>
        <Button
          disabled={isLoading}
          onClick={handleTestSubmit}
          variant="contained"
          type="button"
          sx={{ width: '45%' }}
          color="error"
        >
          Rodar testes
        </Button>

        <Button
          disabled={!testResult || testResult.stats.failures > 0}
          onClick={handleSubmit}
          variant="contained"
          type="button"
          sx={{ width: '45%' }}
          color="success"
        >
          Enviar solução
        </Button>
      </ButtonsContainer>
    </ParentContainer>
  );
}

export default SendJSSolutionIndex;
