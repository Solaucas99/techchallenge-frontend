import React, { useEffect, useRef, useState } from 'react';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';
import { basicSetup, EditorView } from 'codemirror';
import {
  Controller,
  FieldError,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl/FormControl';
import Button from '@mui/material/Button';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { styled } from '../../../../../../Styles/stitches.config';
import { ContainerContent } from '../../../../../../Components/Useful/ContainerContent';
import { PageTitleH1 } from '../../../../../../Components/Useful/PageTitleH1';
import { instanceAPI } from '../../../../../../Utils/axios';
import { IAxiosPost } from '../../../../../../Types/interfaces/IAxiosRequests';
import { Container } from '../../../../../../Components/Useful/Container';
import { useAppContextProvider } from '../../../../../../Providers/AppContextProvider';
import { database } from '../../../../../../Utils/offlineDB';
import {
  CodeMirrorCustomTheme,
  CodeMirrorDraft,
} from '../../../../../../Utils/codeMirrorSettings';
import { ICode_Complete_Challenge } from '../../../../../../Types/entities/ICode_Complete_Challenge';

type ChallengeInputs = {
  title: string;
  pontuation: string;
  instruction: string;
  answer_1: string;
  answer_2: string;
  answer_3: string;
};

type CodeDraft = {
  id: string;
  code: string;
};

type RHFCustomFieldError = FieldError & {
  ref: HTMLInputElement;
};

const BlockView = styled('div', {
  padding: '15px 5px 15px 5px',
  width: '100%',
  height: '300px',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  background: '#414141',
  borderRadius: '5px',
  overflow: 'hidden',

  '& h4': {
    marginBottom: '6px',
  },
});

const CodeContainer = styled('div', {
  width: '100%',
  height: '100%',
});

const Form = styled('form', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

const offline_db = database('challenges', 'code_complete_challenges');

function CreateCodeCompleteChallengeIndex() {
  const [viewChallenge, setViewChallenge] = useState<EditorView>();
  const refStart = useRef<HTMLDivElement>();

  const navigate = useNavigate();

  const { setAppContext } = useAppContextProvider();

  const { handleSubmit, watch, setValue, control } = useForm<ChallengeInputs>();

  const onSubmit: SubmitHandler<ChallengeInputs> = async formData => {
    try {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
      const challengeCode = viewChallenge.state.doc.toString();

      const { data } = await instanceAPI.post<
        IAxiosPost<ICode_Complete_Challenge>
      >(`/challenges/code-complete/create`, {
        ...formData,
        challenge_archive: challengeCode,
      });

      if (!data.result.id) {
        toast.error(
          'Erro desconhecido ao criar o desafio. Tente novamente mais tarde'
        );
        return;
      }
      await offline_db.delete_by_id('challengeCode');
      await offline_db.delete_by_id('code_complete_challenge');
      setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
      toast.success('O desafio foi criado com sucesso!');
      navigate(`/challenges/categories/code-complete/${data.result.id}`);
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
    const subscription = watch(value => {
      offline_db.create_or_update({ ...value, id: 'code_complete_challenge' });
    });

    const fetchChallengeInfosIDB = async () => {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
      const challengeCode = await offline_db.read_by_id<CodeDraft>(
        'challengeCode'
      );
      const challenge = await offline_db.read_by_id<ChallengeInputs>(
        'code_complete_challenge'
      );

      if (challengeCode || challenge)
        toast.warning(
          'Ops, parece que você já estava criando um desafio anteriormente. Trouxemos o seu rascunho.'
        );

      const CmViewChallenge = new EditorView({
        state: EditorState.create({
          extensions: [
            basicSetup,
            javascript(),
            CodeMirrorCustomTheme,
            CodeMirrorDraft(offline_db, 'challengeCode'),
          ],
          doc: challengeCode?.code || `//Código para completar aqui`,
        }),
        parent: refStart.current,
      });

      setViewChallenge(CmViewChallenge);

      if (challenge) {
        Object.keys(challenge).forEach((key: keyof ChallengeInputs) => {
          setValue(key, challenge[key], {
            shouldValidate: true,
            shouldDirty: true,
          });
        });
      }
      setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
    };

    fetchChallengeInfosIDB();

    return () => subscription.unsubscribe();
  }, [watch, setValue, setAppContext]);

  return (
    <Container>
      <ContainerContent>
        <PageTitleH1>Criar desafio de Code Complete</PageTitleH1>
        <Form onSubmit={handleSubmit(onSubmit, onErrors)}>
          <FormControl sx={{ m: 1, width: '90%' }}>
            <Controller
              render={({ field: { onChange, value, ref } }) => (
                <TextField
                  id="title"
                  label="Nome do desafio"
                  variant="filled"
                  inputRef={ref}
                  onChange={onChange}
                  value={value}
                />
              )}
              control={control}
              name="title"
              defaultValue=""
              rules={{ required: true }}
            />
          </FormControl>

          <FormControl sx={{ m: 1, width: '90%' }}>
            <Controller
              render={({ field: { onChange, value, ref } }) => (
                <TextField
                  id="pontuation"
                  label="Pontuação (min 1 - max 10)"
                  variant="filled"
                  inputRef={ref}
                  onChange={onChange}
                  value={value}
                  type="number"
                />
              )}
              control={control}
              name="pontuation"
              defaultValue=""
              rules={{ required: true, min: 1, max: 10 }}
            />
          </FormControl>

          <FormControl sx={{ m: 1, width: '90%' }}>
            <Controller
              render={({ field: { onChange, value, ref } }) => (
                <TextField
                  multiline
                  rows={10}
                  variant="filled"
                  label="Instruções"
                  id="instruction"
                  inputRef={ref}
                  onChange={onChange}
                  value={value}
                />
              )}
              control={control}
              name="instruction"
              defaultValue=""
              rules={{ required: true }}
            />
          </FormControl>

          <FormControl sx={{ m: 1, width: '90%' }}>
            <BlockView>
              <h4>Start.js</h4>
              <CodeContainer ref={refStart} />
            </BlockView>
          </FormControl>

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
      </ContainerContent>
    </Container>
  );
}

export default CreateCodeCompleteChallengeIndex;
