import React, { useEffect } from 'react';
import {
  FieldError,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  Controller,
} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl/FormControl';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { toast } from 'react-toastify';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { styled } from '../../../../../../Styles/stitches.config';
import { instanceAPI } from '../../../../../../Utils/axios';
import { IAxiosPost } from '../../../../../../Types/interfaces/IAxiosRequests';
import { IQuiz_Question } from '../../../../../../Types/entities/IQuiz_Question';
import { useAppContextProvider } from '../../../../../../Providers/AppContextProvider';
import { database } from '../../../../../../Utils/offlineDB';

const Form = styled('form', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

const QuestionsDiv = styled('div', {
  width: '100%',
  display: 'flex',
  flex: 1,
  justifyContent: 'space-around',
  flexWrap: 'wrap',
  gap: '20px 0px',
});

const offline_db_challenges = database('challenges', 'quiz_challenges');
const offline_db_questions = database('challenges', 'quiz_questions');

type ChallengeInputs = {
  first_question_text: string;
  first_question_score: string;
  first_question_option_1: string;
  first_question_option_2: string;
  first_question_option_3: string;
  first_question_option_4: string;
  first_question_correct_answer: string;

  second_question_text: string;
  second_question_score: string;
  second_question_option_1: string;
  second_question_option_2: string;
  second_question_option_3: string;
  second_question_option_4: string;
  second_question_correct_answer: string;

  third_question_text: string;
  third_question_score: string;
  third_question_option_1: string;
  third_question_option_2: string;
  third_question_option_3: string;
  third_question_option_4: string;
  third_question_correct_answer: string;

  fourth_question_text: string;
  fourth_question_score: string;
  fourth_question_option_1: string;
  fourth_question_option_2: string;
  fourth_question_option_3: string;
  fourth_question_option_4: string;
  fourth_question_correct_answer: string;

  fifth_question_text: string;
  fifth_question_score: string;
  fifth_question_option_1: string;
  fifth_question_option_2: string;
  fifth_question_option_3: string;
  fifth_question_option_4: string;
  fifth_question_correct_answer: string;
};

type RHFCustomFieldError = FieldError & {
  ref: HTMLInputElement;
};

function QuestionsForm({ challengeId }: { challengeId: string }) {
  const { handleSubmit, watch, setValue, control } = useForm<ChallengeInputs>();

  const navigate = useNavigate();

  const { setAppContext } = useAppContextProvider();

  const onSubmit: SubmitHandler<ChallengeInputs> = async formData => {
    try {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));

      const req1 = instanceAPI.post<IAxiosPost<IQuiz_Question>>(
        `/challenges/quiz/question/create`,
        {
          quiz_challenge_id: challengeId,
          question_text: formData.first_question_text,
          correct_answer: formData.first_question_correct_answer,
          question_score: Number(formData.first_question_score),
          option_1: formData.first_question_option_1,
          option_2: formData.first_question_option_2,
          option_3: formData.first_question_option_3,
          option_4: formData.first_question_option_4,
        }
      );

      const req2 = instanceAPI.post<IAxiosPost<IQuiz_Question>>(
        `/challenges/quiz/question/create`,
        {
          quiz_challenge_id: challengeId,
          question_text: formData.second_question_text,
          correct_answer: formData.second_question_correct_answer,
          question_score: Number(formData.second_question_score),
          option_1: formData.second_question_option_1,
          option_2: formData.second_question_option_2,
          option_3: formData.second_question_option_3,
          option_4: formData.second_question_option_4,
        }
      );

      const req3 = instanceAPI.post<IAxiosPost<IQuiz_Question>>(
        `/challenges/quiz/question/create`,
        {
          quiz_challenge_id: challengeId,
          question_text: formData.third_question_text,
          correct_answer: formData.third_question_correct_answer,
          question_score: Number(formData.third_question_score),
          option_1: formData.third_question_option_1,
          option_2: formData.third_question_option_2,
          option_3: formData.third_question_option_3,
          option_4: formData.third_question_option_4,
        }
      );

      const req4 = instanceAPI.post<IAxiosPost<IQuiz_Question>>(
        `/challenges/quiz/question/create`,
        {
          quiz_challenge_id: challengeId,
          question_text: formData.fourth_question_text,
          correct_answer: formData.fourth_question_correct_answer,
          question_score: Number(formData.fourth_question_score),
          option_1: formData.fourth_question_option_1,
          option_2: formData.fourth_question_option_2,
          option_3: formData.fourth_question_option_3,
          option_4: formData.fourth_question_option_4,
        }
      );

      const req5 = instanceAPI.post<IAxiosPost<IQuiz_Question>>(
        `/challenges/quiz/question/create`,
        {
          quiz_challenge_id: challengeId,
          question_text: formData.fifth_question_text,
          correct_answer: formData.fifth_question_correct_answer,
          question_score: Number(formData.fifth_question_score),
          option_1: formData.fifth_question_option_1,
          option_2: formData.fifth_question_option_2,
          option_3: formData.fifth_question_option_3,
          option_4: formData.fifth_question_option_4,
        }
      );

      const data = await Promise.allSettled([req1, req2, req3, req4, req5]);

      data.forEach(req => {
        if (req.status === 'rejected') {
          setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
          if (req.reason.response) {
            throw new Error(req.reason);
          } else {
            throw new Error('Not axios error');
          }
        }
      });

      if (data.every(req => req.status === 'fulfilled')) {
        await offline_db_questions.delete_by_id(challengeId);
        await offline_db_challenges.delete_by_id(challengeId);
        setAppContext(prevContext => ({
          ...prevContext,
          isLoading: false,
        }));
        toast.success('Todas as questões foram salvas com sucesso!');
        navigate(`/challenges/categories/quiz/${challengeId}`);
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

  const onErrors: SubmitErrorHandler<ChallengeInputs> = data => {
    setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
    const keys = Object.keys(data);

    keys.forEach(key => {
      const value: RHFCustomFieldError = data[key];

      if (
        key === 'pontuation' &&
        (value.type === 'min' || value.type === 'max')
      )
        toast.error(
          `O campo "${
            value?.ref?.labels ? value.ref.labels[0].innerHTML : key
          }" tem valor mínimo de 1 e máximo de 10`
        );

      if (value.type === 'required')
        toast.error(
          `O campo "${
            value?.ref?.labels ? value.ref.labels[0].innerHTML : key
          }" é obrigatório`
        );
    });
  };

  // Callback version of watch.  It's your responsibility to unsubscribe when done.
  useEffect(() => {
    const subscription = watch(value => {
      offline_db_questions.create_or_update({ ...value, id: challengeId });
    });

    const fetchQuestionsInfosIDB = async () => {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
      const value = await offline_db_questions.read_by_id(challengeId);
      if (value) {
        Object.keys(value).forEach((key: keyof ChallengeInputs) => {
          setValue(key, value[key], {
            shouldValidate: true,
            shouldDirty: true,
          });
        });
      }
      setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
    };

    fetchQuestionsInfosIDB();

    return () => subscription.unsubscribe();
  }, [watch, setValue, setAppContext, challengeId]);

  return (
    <Form onSubmit={handleSubmit(onSubmit, onErrors)}>
      <FormControl sx={{ m: 1, width: '90%' }}>
        <Accordion>
          <AccordionSummary
            expandIcon={<MdKeyboardArrowDown />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Questão 1</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <QuestionsDiv>
              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    multiline
                    rows={4}
                    variant="filled"
                    label="Pergunta"
                    id="first_question_text"
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                    sx={{ width: '100%' }}
                  />
                )}
                control={control}
                name="first_question_text"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="first_question_score"
                    label="Pontuação da Pergunta (min 1 - max 10)"
                    variant="filled"
                    type="number"
                    sx={{ width: '100%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="first_question_score"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="first_question_option_1"
                    label="Opção 1"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="first_question_option_1"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="first_question_option_2"
                    label="Opção 2"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="first_question_option_2"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="first_question_option_3"
                    label="Opção 3"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="first_question_option_3"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="first_question_option_4"
                    label="Opção 4"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="first_question_option_4"
                defaultValue=""
                rules={{ required: true }}
              />

              <FormControl variant="filled" sx={{ m: 1, width: '100%' }}>
                <InputLabel id="first_question_correct_answer_filled_label">
                  Resposta correta
                </InputLabel>

                <Controller
                  render={({ field: { onChange, value, ref } }) => (
                    <Select
                      id="first_question_correct_answer"
                      labelId="first_question_correct_answer_filled_label"
                      label="Resposta correta"
                      inputRef={ref}
                      onChange={onChange}
                      value={value}
                    >
                      <MenuItem value={1}>Opção 1</MenuItem>
                      <MenuItem value={2}>Opção 2</MenuItem>
                      <MenuItem value={3}>Opção 3</MenuItem>
                      <MenuItem value={4}>Opção 4</MenuItem>
                    </Select>
                  )}
                  control={control}
                  name="first_question_correct_answer"
                  defaultValue=""
                  rules={{ required: true }}
                />
              </FormControl>
            </QuestionsDiv>
          </AccordionDetails>
        </Accordion>
      </FormControl>

      <FormControl sx={{ m: 1, width: '90%' }}>
        <Accordion>
          <AccordionSummary
            expandIcon={<MdKeyboardArrowDown />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Questão 2</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <QuestionsDiv>
              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    multiline
                    rows={4}
                    variant="filled"
                    label="Pergunta"
                    id="second_question_text"
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                    sx={{ width: '100%' }}
                  />
                )}
                control={control}
                name="second_question_text"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="second_question_score"
                    label="Pontuação da Pergunta (min 1 - max 10)"
                    variant="filled"
                    type="number"
                    sx={{ width: '100%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="second_question_score"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="second_question_option_1"
                    label="Opção 1"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="second_question_option_1"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="second_question_option_2"
                    label="Opção 2"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="second_question_option_2"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="second_question_option_3"
                    label="Opção 3"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="second_question_option_3"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="second_question_option_4"
                    label="Opção 4"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="second_question_option_4"
                defaultValue=""
                rules={{ required: true }}
              />

              <FormControl variant="filled" sx={{ m: 1, width: '100%' }}>
                <InputLabel id="second_question_correct_answer_filled_label">
                  Resposta correta
                </InputLabel>

                <Controller
                  render={({ field: { onChange, value, ref } }) => (
                    <Select
                      id="second_question_correct_answer"
                      labelId="second_question_correct_answer_filled_label"
                      label="Resposta correta"
                      inputRef={ref}
                      onChange={onChange}
                      value={value}
                    >
                      <MenuItem value={1}>Opção 1</MenuItem>
                      <MenuItem value={2}>Opção 2</MenuItem>
                      <MenuItem value={3}>Opção 3</MenuItem>
                      <MenuItem value={4}>Opção 4</MenuItem>
                    </Select>
                  )}
                  control={control}
                  name="second_question_correct_answer"
                  defaultValue=""
                  rules={{ required: true }}
                />
              </FormControl>
            </QuestionsDiv>
          </AccordionDetails>
        </Accordion>
      </FormControl>

      <FormControl sx={{ m: 1, width: '90%' }}>
        <Accordion>
          <AccordionSummary
            expandIcon={<MdKeyboardArrowDown />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Questão 3</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <QuestionsDiv>
              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    multiline
                    rows={4}
                    variant="filled"
                    label="Pergunta"
                    id="third_question_text"
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                    sx={{ width: '100%' }}
                  />
                )}
                control={control}
                name="third_question_text"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="third_question_score"
                    label="Pontuação da Pergunta (min 1 - max 10)"
                    variant="filled"
                    type="number"
                    sx={{ width: '100%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="third_question_score"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="third_question_option_1"
                    label="Opção 1"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="third_question_option_1"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="third_question_option_2"
                    label="Opção 2"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="third_question_option_2"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="third_question_option_3"
                    label="Opção 3"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="third_question_option_3"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="third_question_option_4"
                    label="Opção 4"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="third_question_option_4"
                defaultValue=""
                rules={{ required: true }}
              />

              <FormControl variant="filled" sx={{ m: 1, width: '100%' }}>
                <InputLabel id="third_question_correct_answer_filled_label">
                  Resposta correta
                </InputLabel>

                <Controller
                  render={({ field: { onChange, value, ref } }) => (
                    <Select
                      id="third_question_correct_answer"
                      labelId="third_question_correct_answer_filled_label"
                      label="Resposta correta"
                      inputRef={ref}
                      onChange={onChange}
                      value={value}
                    >
                      <MenuItem value={1}>Opção 1</MenuItem>
                      <MenuItem value={2}>Opção 2</MenuItem>
                      <MenuItem value={3}>Opção 3</MenuItem>
                      <MenuItem value={4}>Opção 4</MenuItem>
                    </Select>
                  )}
                  control={control}
                  name="third_question_correct_answer"
                  defaultValue=""
                  rules={{ required: true }}
                />
              </FormControl>
            </QuestionsDiv>
          </AccordionDetails>
        </Accordion>
      </FormControl>

      <FormControl sx={{ m: 1, width: '90%' }}>
        <Accordion>
          <AccordionSummary
            expandIcon={<MdKeyboardArrowDown />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Questão 4</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <QuestionsDiv>
              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    multiline
                    rows={4}
                    variant="filled"
                    label="Pergunta"
                    id="fourth_question_text"
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                    sx={{ width: '100%' }}
                  />
                )}
                control={control}
                name="fourth_question_text"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="fourth_question_score"
                    label="Pontuação da Pergunta (min 1 - max 10)"
                    variant="filled"
                    type="number"
                    sx={{ width: '100%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="fourth_question_score"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="fourth_question_option_1"
                    label="Opção 1"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="fourth_question_option_1"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="fourth_question_option_2"
                    label="Opção 2"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="fourth_question_option_2"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="fourth_question_option_3"
                    label="Opção 3"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="fourth_question_option_3"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="fourth_question_option_4"
                    label="Opção 4"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="fourth_question_option_4"
                defaultValue=""
                rules={{ required: true }}
              />

              <FormControl variant="filled" sx={{ m: 1, width: '100%' }}>
                <InputLabel id="fourth_question_correct_answer_filled_label">
                  Resposta correta
                </InputLabel>

                <Controller
                  render={({ field: { onChange, value, ref } }) => (
                    <Select
                      id="fourth_question_correct_answer"
                      labelId="fourth_question_correct_answer_filled_label"
                      label="Resposta correta"
                      inputRef={ref}
                      onChange={onChange}
                      value={value}
                    >
                      <MenuItem value={1}>Opção 1</MenuItem>
                      <MenuItem value={2}>Opção 2</MenuItem>
                      <MenuItem value={3}>Opção 3</MenuItem>
                      <MenuItem value={4}>Opção 4</MenuItem>
                    </Select>
                  )}
                  control={control}
                  name="fourth_question_correct_answer"
                  defaultValue=""
                  rules={{ required: true }}
                />
              </FormControl>
            </QuestionsDiv>
          </AccordionDetails>
        </Accordion>
      </FormControl>

      <FormControl sx={{ m: 1, width: '90%' }}>
        <Accordion>
          <AccordionSummary
            expandIcon={<MdKeyboardArrowDown />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Questão 5</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <QuestionsDiv>
              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    multiline
                    rows={4}
                    variant="filled"
                    label="Pergunta"
                    id="fifth_question_text"
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                    sx={{ width: '100%' }}
                  />
                )}
                control={control}
                name="fifth_question_text"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="fifth_question_score"
                    label="Pontuação da Pergunta (min 1 - max 10)"
                    variant="filled"
                    type="number"
                    sx={{ width: '100%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="fifth_question_score"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="fifth_question_option_1"
                    label="Opção 1"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="fifth_question_option_1"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="fifth_question_option_2"
                    label="Opção 2"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="fifth_question_option_2"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="fifth_question_option_3"
                    label="Opção 3"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="fifth_question_option_3"
                defaultValue=""
                rules={{ required: true }}
              />

              <Controller
                render={({ field: { onChange, value, ref } }) => (
                  <TextField
                    id="fifth_question_option_4"
                    label="Opção 4"
                    multiline
                    variant="filled"
                    sx={{ width: '45%' }}
                    inputRef={ref}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="fifth_question_option_4"
                defaultValue=""
                rules={{ required: true }}
              />

              <FormControl variant="filled" sx={{ m: 1, width: '100%' }}>
                <InputLabel id="fifth_question_correct_answer_filled_label">
                  Resposta correta
                </InputLabel>

                <Controller
                  render={({ field: { onChange, value, ref } }) => (
                    <Select
                      id="fifth_question_correct_answer"
                      labelId="fifth_question_correct_answer_filled_label"
                      label="Resposta correta"
                      inputRef={ref}
                      onChange={onChange}
                      value={value}
                    >
                      <MenuItem value={1}>Opção 1</MenuItem>
                      <MenuItem value={2}>Opção 2</MenuItem>
                      <MenuItem value={3}>Opção 3</MenuItem>
                      <MenuItem value={4}>Opção 4</MenuItem>
                    </Select>
                  )}
                  control={control}
                  name="fifth_question_correct_answer"
                  defaultValue=""
                  rules={{ required: true }}
                />
              </FormControl>
            </QuestionsDiv>
          </AccordionDetails>
        </Accordion>
      </FormControl>

      <FormControl sx={{ m: 1, width: '90%' }}>
        <Button variant="contained" type="submit">
          Enviar
        </Button>
      </FormControl>
    </Form>
  );
}

export default QuestionsForm;
