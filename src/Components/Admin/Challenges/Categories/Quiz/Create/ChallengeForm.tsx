import React, { useEffect } from 'react';
import {
  FieldError,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl/FormControl';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import { styled } from '../../../../../../Styles/stitches.config';
import { instanceAPI } from '../../../../../../Utils/axios';
import { IAxiosPost } from '../../../../../../Types/interfaces/IAxiosRequests';
import { IQuiz_Challenge } from '../../../../../../Types/entities/IQuiz_Challenge';
import { useAppContextProvider } from '../../../../../../Providers/AppContextProvider';
import { database } from '../../../../../../Utils/offlineDB';

const Form = styled('form', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

const offline_db = database('challenges', 'quiz_challenges');

type ChallengeInputs = {
  title: string;
  instruction: string;
};

type RHFCustomFieldError = FieldError & {
  ref: HTMLInputElement;
};

function ChallengeForm({
  challengeIdCallback,
}: {
  challengeIdCallback: (id: string) => void;
}) {
  const { register, handleSubmit } = useForm<ChallengeInputs>();

  const { setAppContext } = useAppContextProvider();

  const onSubmit: SubmitHandler<ChallengeInputs> = async formData => {
    try {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));

      const { data } = await instanceAPI.post<IAxiosPost<IQuiz_Challenge>>(
        `/challenges/quiz/create`,
        {
          ...formData,
        }
      );

      if (!data.result.id) {
        setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
        toast.error(
          'Erro desconhecido ao criar o teste. Tente novamente mais tarde'
        );
        return;
      }

      offline_db.create_or_update({
        id: data.result.id,
        creation_in_progress: true,
      });

      challengeIdCallback(data.result.id);
      setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
      toast.success('O desafio foi criado com sucesso!');
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
    });
  };

  useEffect(() => {
    const fetchChallenge = async () => {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
      const challenges = await offline_db.read_all();

      if (
        challenges.length > 0 &&
        challenges.some(challenge => challenge.creation_in_progress)
      ) {
        challengeIdCallback(challenges[0].id);
        toast.warning(
          'Você já estava criando um desafio antes. Conclua antes de criar um novo'
        );
      }
      setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
    };

    fetchChallenge();
  }, [challengeIdCallback, setAppContext]);

  return (
    <Form onSubmit={handleSubmit(onSubmit, onErrors)}>
      <FormControl sx={{ m: 1, width: '90%' }}>
        <TextField
          id="title"
          label="Nome do desafio"
          variant="filled"
          {...register('title', { required: true })}
        />
      </FormControl>

      <FormControl sx={{ m: 1, width: '90%' }}>
        <TextField
          multiline
          rows={10}
          variant="filled"
          label="Instruções"
          id="instructions"
          {...register('instruction', { required: true })}
        />
      </FormControl>

      <FormControl sx={{ m: 1, width: '90%' }}>
        <Button variant="contained" type="submit">
          Criar perguntas
        </Button>
      </FormControl>
    </Form>
  );
}

export default ChallengeForm;
