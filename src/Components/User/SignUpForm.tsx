import React from 'react';
import { Button, FormControl, InputAdornment, TextField } from '@mui/material';
import {
  FieldError,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { FaUserAlt } from 'react-icons/fa';
import { MdEmail, MdOutlineLogin } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { IUser } from '../../Types/entities/IUser';
import { IAxiosPost } from '../../Types/interfaces/IAxiosRequests';
import { instanceAPI } from '../../Utils/axios';
import { PageTitleH1 } from '../Useful/PageTitleH1';
import { Form, PageButton, PageContent } from './Useful/formComponents';
import { useAppContextProvider } from '../../Providers/AppContextProvider';

type SignUpForm = {
  username: string;
  email: string;
  password: string;
};

type RHFCustomFieldError = FieldError & {
  ref: HTMLInputElement;
};

function SignUpForm({
  pageStateCallback,
}: {
  pageStateCallback: (state: 'login' | 'sign-up') => void;
}) {
  const { register, handleSubmit } = useForm<SignUpForm>();

  const { setAppContext } = useAppContextProvider();

  const onSubmit: SubmitHandler<SignUpForm> = async formData => {
    try {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
      const { data } = await instanceAPI.post<IAxiosPost<IUser>>(
        `/user/sign-up`,
        {
          ...formData,
        }
      );

      if (!data.result.id) {
        toast.error(
          'Erro desconhecido ao criar o usuário. Tente novamente mais tarde'
        );
        return;
      }

      setAppContext(prevContext => ({ ...prevContext, isLoading: false }));

      toast.success('Cadastro realizado com sucesso!');
      pageStateCallback('login');
    } catch (err) {
      setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Erro inesperado! Tente novamente mais tarde');
      }
    }
  };

  const onErrors: SubmitErrorHandler<SignUpForm> = data => {
    const keys = Object.keys(data);

    keys.forEach(key => {
      const value: RHFCustomFieldError = data[key];

      if (value.type === 'required')
        toast.error(`O campo "${value.ref.labels[0].innerHTML}" é obrigatório`);

      if (value.type === 'pattern') toast.error(`${value.message}`);

      if (key === 'password' && value.type === 'minLength')
        toast.error(
          `O campo "${value.ref.labels[0].innerHTML}" deve ter no mínimo 8 caracteres`
        );
    });
  };

  return (
    <PageContent>
      <PageTitleH1
        css={{
          display: 'flex',
          alignItems: 'center',

          '& p': {
            marginLeft: '15px',
          },
        }}
      >
        <MdOutlineLogin /> <p>Faça seu cadastro</p>
      </PageTitleH1>

      <Form onSubmit={handleSubmit(onSubmit, onErrors)}>
        <FormControl sx={{ m: 1, width: '90%' }}>
          <TextField
            id="username"
            label="Usuário"
            variant="outlined"
            type="text"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaUserAlt />
                </InputAdornment>
              ),
            }}
            {...register('username', {
              required: true,
            })}
          />
        </FormControl>

        <FormControl sx={{ m: 1, width: '90%' }}>
          <TextField
            id="email"
            label="E-Mail"
            variant="outlined"
            type="text"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdEmail />
                </InputAdornment>
              ),
            }}
            {...register('email', {
              required: true,
              pattern: {
                value: /\S+@\S+\.\S+/,
                message:
                  'O E-mail está num formato incorreto. Por favor, tente novamente',
              },
            })}
          />
        </FormControl>

        <FormControl sx={{ m: 1, width: '90%' }}>
          <TextField
            id="password"
            label="Senha"
            variant="outlined"
            type="password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RiLockPasswordFill />
                </InputAdornment>
              ),
            }}
            {...register('password', {
              required: true,
              minLength: 8,
              pattern: {
                value: /(?:[A-Za-z].*?\d|\d.*?[A-Za-z])/,
                message: 'A sua senha deve ter números e letras',
              },
            })}
          />
        </FormControl>

        <FormControl sx={{ m: 1, width: '90%' }}>
          <Button variant="contained" type="submit">
            Cadastrar
          </Button>
        </FormControl>

        <FormControl sx={{ m: 1, width: '90%' }}>
          <p>
            Já tem um login?{' '}
            <PageButton
              onClick={() => pageStateCallback('login')}
              type="button"
            >
              Clique aqui para entrar!
            </PageButton>
          </p>
        </FormControl>
      </Form>
    </PageContent>
  );
}

export default SignUpForm;
