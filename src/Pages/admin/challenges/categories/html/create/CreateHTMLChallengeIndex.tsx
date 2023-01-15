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
import { html } from '@codemirror/lang-html';
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
  height: '450px',
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

const offline_db = database('challenges', 'html_challenges');

const defaultHTMLCode = `<!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script type="text/javascript" async src="https://www.googletagmanager.com/gtag/js?id=AW-000000000"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            window.dataLayer.push(arguments);
          }
          gtag('js', new Date());

          gtag('config', 'AW-000000000');
        </script>
    </head>
    <body>

    </body>
    </html>`;

const defaultTestCode = `const { JSDOM } = require('jsdom');
const chai = require('chai');
const fs = require('fs');
const path = require('path');

describe('TEST_NAME', () => {
  it('TEST_DESCRIPTION', () => {
    // Virtual window DOM created
    const { window } = new JSDOM(
      fs.readFileSync(path.join(__dirname + '/../html/index.html')),
      { runScripts: 'dangerously' },
    ).window;

    // Virtual Document
    const document = window.document;

    //Creating and appending script
    const script_one = document.createElement('script');

    script_one.innerHTML = fs
      .readFileSync(path.join(__dirname + '/../solution/solution.js'))
      .toString();

    document.head.appendChild(script_one);

    // Creating an array from DataLayer for tests
    const mappedDL = window.dataLayer.map((argument) =>
      typeof argument[Symbol.iterator] === 'function'
        ? Object.values(argument)
        : argument,
    );

    // Example tests
    chai.expect(
      mappedDL.find((el) => el.find((element) => element === 'conversion')),
    ).to.nested.include.deep.members(['event', 'conversion']);
  });
});
`;

const defaultStartCode = `// Example script
const btn = document.querySelector('button');

btn.addEventListener('click', function() {
    gtag('event', 'conversion', {
        'send_to': 'AW-353091407/Z0lGCKLXtaUDEM_-rqgB',
        'value': 1.0,
        'currency': 'BRL',
        'transaction_id': ''
    });
})
`;

function CreateHTMLChallengeIndex() {
  const [viewTest, setViewTest] = useState<EditorView>();
  const [viewStart, setViewStart] = useState<EditorView>();
  const [viewHTML, setViewHTML] = useState<EditorView>();
  const refTest = useRef<HTMLDivElement>();
  const refStart = useRef<HTMLDivElement>();
  const refHTML = useRef<HTMLDivElement>();

  const navigate = useNavigate();

  const { setAppContext } = useAppContextProvider();

  const { handleSubmit, watch, setValue, control } = useForm<ChallengeInputs>();

  const onSubmit: SubmitHandler<ChallengeInputs> = async formData => {
    try {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
      const testCode = viewTest.state.doc.toString();
      const startCode = viewStart.state.doc.toString();
      const htmlCode = viewHTML.state.doc.toString();

      if (!testCode.includes('describe(') || !testCode.includes('it(')) {
        toast.error(
          'Código de teste inválido, por favor, reescreva o arquivo de teste corretamente'
        );
        return;
      }

      if (
        !htmlCode.includes('</html>') ||
        !htmlCode.includes('</body>') ||
        !htmlCode.includes('</head>')
      ) {
        toast.error(
          'Código de HTML inválido, por favor, reescreva o arquivo de HTML corretamente'
        );
        return;
      }

      const { data } = await instanceAPI.post<IAxiosPost<IJS_Challenge>>(
        `/challenges/html/create`,
        {
          ...formData,
          test_archive: testCode,
          start_archive: startCode,
          html_archive: htmlCode,
        }
      );

      if (!data.result.id) {
        toast.error(
          'Erro desconhecido ao criar o desafio. Tente novamente mais tarde'
        );
        return;
      }
      await offline_db.delete_by_id('testCode');
      await offline_db.delete_by_id('htmlCode');
      await offline_db.delete_by_id('jsCode');
      await offline_db.delete_by_id('html_challenge');

      setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
      toast.success('O desafio foi criado com sucesso!');
      navigate(`/challenges/categories/html/${data.result.id}`);
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
      offline_db.create_or_update({ ...value, id: 'html_challenge' });
    });

    const fetchChallengeInfosIDB = async () => {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
      const testCode = await offline_db.read_by_id<CodeDraft>('testCode');
      const jsCode = await offline_db.read_by_id<CodeDraft>('jsCode');
      const htmlCode = await offline_db.read_by_id<CodeDraft>('htmlCode');
      const challenge = await offline_db.read_by_id<ChallengeInputs>(
        'html_challenge'
      );

      if (testCode || jsCode || htmlCode || challenge)
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
          doc: testCode?.code || defaultTestCode,
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
          doc: jsCode?.code || defaultStartCode,
        }),
        parent: refStart.current,
      });

      setViewStart(CmViewStart);

      const CmViewHTML = new EditorView({
        state: EditorState.create({
          extensions: [
            basicSetup,
            html(),
            CodeMirrorCustomTheme,
            CodeMirrorDraft(offline_db, 'htmlCode'),
          ],
          doc: htmlCode?.code || defaultHTMLCode,
        }),
        parent: refHTML.current,
      });

      setViewHTML(CmViewHTML);

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
              <h4>index.html</h4>
              <CodeContainer ref={refHTML} />
            </BlockView>
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

export default CreateHTMLChallengeIndex;
