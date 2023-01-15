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
import { IJS_Challenge } from '../../../../../../Types/entities/IJS_Challenge';
import { IAxiosPost } from '../../../../../../Types/interfaces/IAxiosRequests';
import { Container } from '../../../../../../Components/Useful/Container';
import { useAppContextProvider } from '../../../../../../Providers/AppContextProvider';
import { database } from '../../../../../../Utils/offlineDB';
import {
  CodeMirrorCustomTheme,
  CodeMirrorDraft,
} from '../../../../../../Utils/codeMirrorSettings';

type ChallengeInputs = {
  title: string;
  pontuation: string;
  instruction: string;
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

const offline_db = database('challenges', 'js_challenges');

function CreateJSChallengeIndex() {
  const [viewTest, setViewTest] = useState<EditorView>();
  const [viewStart, setViewStart] = useState<EditorView>();
  const refTest = useRef<HTMLDivElement>();
  const refStart = useRef<HTMLDivElement>();

  const navigate = useNavigate();

  const { setAppContext } = useAppContextProvider();

  const { handleSubmit, watch, setValue, control } = useForm<ChallengeInputs>();

  const onSubmit: SubmitHandler<ChallengeInputs> = async formData => {
    try {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
      const testCode = viewTest.state.doc.toString();
      const startCode = viewStart.state.doc.toString();

      if (!testCode.includes('describe(') || !testCode.includes('it(')) {
        setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
        toast.error(
          'Código de teste inválido, por favor, reescreva o arquivo de teste corretamente'
        );

        return;
      }

      const { data } = await instanceAPI.post<IAxiosPost<IJS_Challenge>>(
        `/challenges/js/create`,
        {
          ...formData,
          test_archive: testCode,
          start_archive: startCode,
        }
      );

      if (!data.result.id) {
        toast.error(
          'Erro desconhecido ao criar o desafio. Tente novamente mais tarde'
        );
        return;
      }
      await offline_db.delete_by_id('jsCode');
      await offline_db.delete_by_id('testCode');
      await offline_db.delete_by_id('js_challenge');
      setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
      toast.success('O desafio foi criado com sucesso!');
      navigate(`/challenges/categories/js/${data.result.id}`);
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
      offline_db.create_or_update({ ...value, id: 'js_challenge' });
    });

    const fetchChallengeInfosIDB = async () => {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
      const testCode = await offline_db.read_by_id<CodeDraft>('testCode');
      const jsCode = await offline_db.read_by_id<CodeDraft>('jsCode');
      const challenge = await offline_db.read_by_id<ChallengeInputs>(
        'js_challenge'
      );

      if (testCode || jsCode || challenge)
        toast.warning(
          'Ops, parece que você já estava criando um desafio anteriormente. Trouxemos o seu rascunho.'
        );

      const CmViewTest = new EditorView({
        state: EditorState.create({
          extensions: [
            basicSetup,
            javascript(),
            CodeMirrorCustomTheme,
            CodeMirrorDraft(offline_db, 'testCode'),
          ],
          doc:
            testCode?.code ||
            `const chai = require('chai');\nconst { fnTeste } = require('../solution/solution.js');`,
        }),
        parent: refTest.current,
      });

      setViewTest(CmViewTest);

      const CmViewStart = new EditorView({
        state: EditorState.create({
          extensions: [
            basicSetup,
            javascript(),
            CodeMirrorCustomTheme,
            CodeMirrorDraft(offline_db, 'jsCode'),
          ],
          doc:
            jsCode?.code ||
            `function fnTeste() {\n  //código aqui\n}\n\nmodule.exports = { fnTeste }`,
        }),
        parent: refStart.current,
      });

      setViewStart(CmViewStart);

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
        <PageTitleH1>Criar desafio JavaScript</PageTitleH1>
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
            <BlockView>
              <h4>Test.js</h4>
              <CodeContainer ref={refTest} />
            </BlockView>
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

export default CreateJSChallengeIndex;
