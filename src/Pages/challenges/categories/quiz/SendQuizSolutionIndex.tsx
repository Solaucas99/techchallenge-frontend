import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { BiCategory } from 'react-icons/bi';
import { MdHome, MdQuiz } from 'react-icons/md';
import { styled } from '../../../../Styles/stitches.config';
import { instanceAPI } from '../../../../Utils/axios';
import {
  IAxiosGet,
  IAxiosPost,
} from '../../../../Types/interfaces/IAxiosRequests';
import { useUserContextProvider } from '../../../../Providers/UserContextProvider';
import { useAppContextProvider } from '../../../../Providers/AppContextProvider';
import { ContainerContent } from '../../../../Components/Useful/ContainerContent';
import { Container } from '../../../../Components/Useful/Container';
import { IQuiz_Question } from '../../../../Types/entities/IQuiz_Question';
import { IQuiz_Solution } from '../../../../Types/entities/IQuiz_Solution';
import Breadcrumbs from '../../../../Components/Breadcrumbs';

const ButtonsContainer = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
});

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
  flexDirection: 'column',
  background: '$background',
  padding: '65px 15px',
  position: 'relative',
});

const QuestionPontuation = styled('span', {
  position: 'absolute',
  top: 15,
  right: 15,
});

type ChallengeInputs = {
  [key: `answer_${number}`]: string;
};

type Answers = {
  answer_1: {
    selected: string;
    question_id: string;
  };

  answer_2: {
    selected: string;
    question_id: string;
  };

  answer_3: {
    selected: string;
    question_id: string;
  };

  answer_4: {
    selected: string;
    question_id: string;
  };

  answer_5: {
    selected: string;
    question_id: string;
  };
};

const DEFAULT_ANSWERS = {
  answer_1: {
    selected: '1',
    question_id: '',
  },

  answer_2: {
    selected: '1',
    question_id: '',
  },

  answer_3: {
    selected: '1',
    question_id: '',
  },

  answer_4: {
    selected: '1',
    question_id: '',
  },

  answer_5: {
    selected: '1',
    question_id: '',
  },
};

function SendQuizSolutionIndex() {
  const [challengeQuestions, setChallengeQuestions] = useState<
    IQuiz_Question[]
  >([]);

  const [questionsAnswers, setQuestionsAnswers] =
    useState<Answers>(DEFAULT_ANSWERS);

  const { id } = useParams();

  const { register, handleSubmit } = useForm<ChallengeInputs>();

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
      title: 'Quiz',
      icon: <MdQuiz />,
      to: '/challenges/categories/quiz',
    },
  ];

  const onSubmit: SubmitHandler<ChallengeInputs> = async () => {
    try {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));

      const { data } = await instanceAPI.post<IAxiosPost<IQuiz_Solution>>(
        `/solutions/quiz/create`,
        {
          ...questionsAnswers,
          user_id: userContext.id,
          quiz_challenge_id: id,
        }
      );

      if (!data.result.id) {
        setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
        toast.error(
          'Erro desconhecido ao enviar a solução. Tente novamente mais tarde'
        );
        return;
      }

      setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
      toast.success('O desafio foi solucionado com sucesso!');
      navigate('/challenges/categories/quiz');
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
    const values = Object.values(data);

    if (values.some(value => value.type === 'required'))
      toast.error('Existem questões não respondidas!');
  };

  useEffect(() => {
    const userCompletedChallenge = async () => {
      try {
        setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
        const { data } = await instanceAPI.get<IAxiosGet<IQuiz_Solution[]>>(
          `/solutions/quiz/challenge/${id}/${userContext.id}`
        );

        if (data.result.length > 0) {
          setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
          toast.error('Ops, você já completou esse desafio!');
          navigate('/challenges/categories/quiz');
          return;
        }
      } catch (err) {
        setAppContext(prevContext => ({ ...prevContext, isLoading: false }));

        if (err.response.status === 404) {
          navigate('404');
        }

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
        const { data } = await instanceAPI.get<IAxiosGet<IQuiz_Question[]>>(
          `/challenges/quiz/questions/${id}`
        );

        setChallengeQuestions([...data.result]);
        setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
      } catch (err) {
        setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
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
      <Breadcrumbs
        prevPages={breadcrumbsPrevPages}
        actualPage={{
          title: challengeQuestions[0]?.Quiz_Challenge?.title,
        }}
      />
      <ContainerContent>
        <h2>
          {challengeQuestions.length > 0 &&
            challengeQuestions[0].Quiz_Challenge.title}
        </h2>
        <p>
          {challengeQuestions.length > 0 &&
            challengeQuestions[0].Quiz_Challenge.instruction}
        </p>
        <Form onSubmit={handleSubmit(onSubmit, onErrors)}>
          {challengeQuestions.length > 0 &&
            challengeQuestions.map((question, i) => (
              <FormControl sx={{ m: 1, width: '90%' }} key={question.id}>
                <QuestionsDiv>
                  <QuestionPontuation>
                    Pontos da questão: {question.question_score}
                  </QuestionPontuation>
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    <h3>
                      {i + 1}. {question.question_text}
                    </h3>
                  </FormLabel>
                  <br />
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    onChange={e => {
                      setQuestionsAnswers(prevState => ({
                        ...prevState,
                        [`answer_${i + 1}`]: {
                          selected: e.target.value,
                          question_id: question.id,
                        },
                      }));
                    }}
                  >
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label={question.option_1}
                      {...register(`answer_${i + 1}`, { required: true })}
                    />
                    <FormControlLabel
                      value="2"
                      control={<Radio />}
                      label={question.option_2}
                      {...register(`answer_${i + 1}`, { required: true })}
                    />
                    <FormControlLabel
                      value="3"
                      control={<Radio />}
                      label={question.option_3}
                      {...register(`answer_${i + 1}`, { required: true })}
                    />
                    <FormControlLabel
                      value="4"
                      control={<Radio />}
                      label={question.option_4}
                      {...register(`answer_${i + 1}`, { required: true })}
                    />
                  </RadioGroup>
                </QuestionsDiv>
              </FormControl>
            ))}

          <ButtonsContainer>
            <Button
              variant="contained"
              type="submit"
              sx={{ width: '95%' }}
              color="success"
            >
              Enviar respostas
            </Button>
          </ButtonsContainer>
        </Form>
      </ContainerContent>
    </Container>
  );
}

export default SendQuizSolutionIndex;
