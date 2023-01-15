import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

axios.defaults.headers.common.Authorization = `Bearer `;

const interceptorReqCallbackSuccess = async (
  config: AxiosRequestConfig<any>
) => {
  config.headers = { // eslint-disable-line
    Authorization: `Bearer ${localStorage.getItem('accToken')}`,
  };
  return config;
};

const interceptorReqCallbackError = error => {
  Promise.reject(error);
};

const interceptorResCallbackSuccess = response => response;

const interceptorResCallbackError = async error => {
  if (
    error.response.status === 401 &&
    error.response.data.message === 'jwt expired'
  ) {
    toast(
      'Para acessar essa página, você precisa fazer login novamente! Seu login expirou.'
    );
    window.localStorage.removeItem('userState');
    window.localStorage.removeItem('accToken');

    window.setTimeout(() => {
      window.location.replace('/user/login');
    }, 2000);
  }

  return Promise.reject(error);
};

const instanceAPI: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 2000,
});

// Request interceptor for API calls
instanceAPI.interceptors.request.use(
  interceptorReqCallbackSuccess,
  interceptorReqCallbackError
);

// Response interceptor for API calls
instanceAPI.interceptors.response.use(
  interceptorResCallbackSuccess,
  interceptorResCallbackError
);

const instanceTests: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3033',
  timeout: 20000,
});

// Request interceptor for API calls
instanceTests.interceptors.request.use(
  interceptorReqCallbackSuccess,
  interceptorReqCallbackError
);

// Response interceptor for API calls
instanceTests.interceptors.response.use(
  interceptorResCallbackSuccess,
  interceptorResCallbackError
);

export { instanceTests, instanceAPI };
