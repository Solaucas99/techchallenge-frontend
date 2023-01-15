import { Button, FormControl, InputAdornment, TextField } from '@mui/material';
import React from 'react';
import {
  FieldError,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { FaUserAlt } from 'react-icons/fa';
import { MdOutlineLogin } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLocalStorage } from '../../Hooks/useLocalStorage';
import { useAppContextProvider } from '../../Providers/AppContextProvider';
import { useUserContextProvider } from '../../Providers/UserContextProvider';
import { IUser } from '../../Types/entities/IUser';
import { IAxiosPost } from '../../Types/interfaces/IAxiosRequests';
import { instanceAPI } from '../../Utils/axios';
import { PageTitleH1 } from '../Useful/PageTitleH1';
import { Form, PageButton, PageContent } from './Useful/formComponents';

type LoginForm = {
  username: string;
  password: string;
};

type RHFCustomFieldError = FieldError & {
  ref: HTMLInputElement;
};

function LoginForm({
  pageStateCallback,
}: {
  pageStateCallback: (state: 'login' | 'sign-up') => void;
}) {
  const { register, handleSubmit } = useForm<LoginForm>();

  const [token, setToken] = useLocalStorage<string>('accToken', ''); //eslint-disable-line

  const navigate = useNavigate();
  const { setAppContext } = useAppContextProvider();
  const { setUserContext } = useUserContextProvider();

  const onSubmit: SubmitHandler<LoginForm> = async formData => {
    try {
      setAppContext(prevContext => ({ ...prevContext, isLoading: true }));

      const { data, headers } = await instanceAPI.post<IAxiosPost<IUser>>(
        `/user/login`,
        {
          ...formData,
        }
      );

      if (!data.result.id) {
        toast.error(
          'Erro desconhecido ao fazer login. Tente novamente mais tarde'
        );
        return;
      }

      setToken(headers['x-access-token']);
      setUserContext({
        ...data.result,
        is_logged_in: true,
      });
      setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
      toast.success('Usuário logado com sucesso!');
      navigate('/');
    } catch (err) {
      setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Erro inesperado! Tente novamente mais tarde');
      }
    }
  };

  const onErrors: SubmitErrorHandler<LoginForm> = data => {
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
        <MdOutlineLogin /> <p>Faça seu login</p>
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
            Entrar
          </Button>
        </FormControl>

        <FormControl sx={{ m: 1, width: '90%' }}>
          <p>
            Não tem cadastro?{' '}
            <PageButton
              type="button"
              onClick={() => pageStateCallback('sign-up')}
            >
              Clique aqui para se cadastrar!
            </PageButton>
          </p>
        </FormControl>
      </Form>
    </PageContent>
  );
}

export default LoginForm;
