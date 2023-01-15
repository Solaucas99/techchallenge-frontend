// import { html } from '@codemirror/lang-html';
import React, { useEffect, useRef, useState } from 'react';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';
import { Button } from '@mui/material';
import { basicSetup, EditorView } from 'codemirror';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdHome } from 'react-icons/md';
import { BiCategory } from 'react-icons/bi';
import { RiInputCursorMove } from 'react-icons/ri';
import {
  Controller,
  FieldError,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl/FormControl';

import { styled } from '../../../../Styles/stitches.config';
import { instanceAPI } from '../../../../Utils/axios';
import { ICode_Complete_Challenge } from '../../../../Types/entities/ICode_Complete_Challenge';
import {
  IAxiosGet,
  IAxiosPost,
} from '../../../../Types/interfaces/IAxiosRequests';
import { useUserContextProvider } from '../../../../Providers/UserContextProvider';
import { useAppContextProvider } from '../../../../Providers/AppContextProvider';
import {
  CodeMirrorCustomTheme,
  ReadOnly,
} from '../../../../Utils/codeMirrorSettings';
import Breadcrumbs from '../../../../Components/Breadcrumbs';
import { ICode_Complete_Solution } from '../../../../Types/entities/ICode_Complete_Solution';

type ChallengeInputs = {
  title: string;
  pontuation: string;
  instruction: string;
  answer_1: string;
  answer_2: string;
  answer_3: string;
};

type RHFCustomFieldError = FieldError & {
  ref: HTMLInputElement;
};

const ParentContainer = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: '5px',
});

const ContentContainer = styled('div', {
  height: '90vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  marginTop: '80px',
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
  padding: '15px',
});

const BlockView = styled('div', {
  padding: '15px 5px 15px 5px',
  width: '100%',
  height: '45%',
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

const Form = styled('form', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

function SendCodeCompleteSolutionIndex() {
  const [challengeInfo, setChallengeInfo] =
    useState<ICode_Complete_Challenge | null>(null);

  const { handleSubmit, control } = useForm<ChallengeInputs>();

  const { id } = useParams();
  const cmRef = useRef<HTMLDivElement>();

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
      title: 'Code Complete',
      icon: <RiInputCursorMove />,
      to: '/challenges/categories/code-complete',
    },
  ];

  const onSubmit: SubmitHandler<ChallengeInputs> = async formData => {
    try {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));

      const { data } = await instanceAPI.post<
        IAxiosPost<ICode_Complete_Solution>
      >(`/solutions/code-complete/create`, {
        ...formData,
        code_complete_challenge_id: id,
        user_id: userContext.id,
      });

      if (!data.result.id) {
        toast.error(
          'Erro desconhecido ao criar o desafio. Tente novamente mais tarde'
        );
        return;
      }

      setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
      toast.success('O desafio foi solucionado com sucesso!');
      navigate(`/challenges/categories/code-complete`);
    } catch (err) {
      setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Erro inesperado! Tente novamente mais tarde');
      }
    }
  };

  const onErrors: SubmitErrorHandler<ChallengeInputs> = data => {
    setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
    const keys = Object.keys(data);

    keys.forEach(key => {
      const value: RHFCustomFieldError = data[key];

      if (value.type === 'required')
        toast.error(`O campo "${value.ref.labels[0].innerHTML}" é obrigatório`);

      if (
        key === 'pontuation' &&
        (value.type === 'min' || value.type === 'max')
      )
        toast.error(
          `O campo "${value.ref.labels[0].innerHTML}" tem valor mínimo de 1 e máximo de 10`
        );
    });
  };

  useEffect(() => {
    const userCompletedChallenge = async () => {
      try {
        setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
        const { data } = await instanceAPI.get<
          IAxiosGet<ICode_Complete_Solution[]>
        >(`/solutions/code-complete/challenge/${id}/${userContext.id}`);

        if (data.result.length > 0) {
          setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
          toast.error('Ops, você já completou esse desafio!');
          navigate(`/challenges/categories/code-complete`);
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
        const { data } = await instanceAPI.get<
          IAxiosGet<ICode_Complete_Challenge>
        >(`/challenges/code-complete/${id}`);

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

        const { data } = await instanceAPI.get<string>(
          `/challenges/code-complete/${id}/start/start.js`
        );

        new EditorView({
          state: EditorState.create({
            extensions: [
              basicSetup,
              javascript(),
              CodeMirrorCustomTheme,
              ReadOnly(),
            ],
            doc: data,
          }),
          parent: cmRef.current,
        });

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
        </InstructionContainer>

        <Container>
          <BlockView>
            <h4>Code.js</h4>
            <CodeContainer ref={cmRef} />
          </BlockView>

          <BlockView>
            <h4>Respostas</h4>
            <Form onSubmit={handleSubmit(onSubmit, onErrors)}>
              <FormControl sx={{ m: 1, width: '90%' }}>
                <Controller
                  render={({ field: { onChange, value, ref } }) => (
                    <TextField
                      id="answer_1"
                      label="Resposta 1"
                      variant="filled"
                      inputRef={ref}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                  control={control}
                  name="answer_1"
                  defaultValue=""
                  rules={{ required: true }}
                />
              </FormControl>

              <FormControl sx={{ m: 1, width: '90%' }}>
                <Controller
                  render={({ field: { onChange, value, ref } }) => (
                    <TextField
                      id="answer_2"
                      label="Resposta 2"
                      variant="filled"
                      inputRef={ref}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                  control={control}
                  name="answer_2"
                  defaultValue=""
                  rules={{ required: true }}
                />
              </FormControl>

              <FormControl sx={{ m: 1, width: '90%' }}>
                <Controller
                  render={({ field: { onChange, value, ref } }) => (
                    <TextField
                      id="answer_3"
                      label="Resposta 3"
                      variant="filled"
                      inputRef={ref}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                  control={control}
                  name="answer_3"
                  defaultValue=""
                  rules={{ required: true }}
                />
              </FormControl>

              <FormControl sx={{ m: 1, width: '90%' }}>
                <Button variant="contained" type="submit">
                  Enviar desafio
                </Button>
              </FormControl>
            </Form>
          </BlockView>
        </Container>
      </ContentContainer>
    </ParentContainer>
  );
}

export default SendCodeCompleteSolutionIndex;
