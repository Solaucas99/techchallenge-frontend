import React, { useCallback, useState } from 'react';
import { Container } from '../../Components/Useful/Container';
import { ContainerContent } from '../../Components/Useful/ContainerContent';
import { styled } from '../../Styles/stitches.config';
import LoginForm from '../../Components/User/LoginForm';
import SignUpForm from '../../Components/User/SignUpForm';

import bg from '../../Assets/images/background-login.jpg';

const PageContainer = styled('div', {
  width: '80%',
  minHeight: '35em',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid $defaultGrayPallete',
});

const PageImage = styled('div', {
  width: '40%',
  height: '100%',
  position: 'absolute',
  left: '0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: `url(${bg})`,

  '& h1': {
    fontFamily: '"Fira Code", monospace',
    fontSize: '3em',
  },
});

function UserLoginOrSignUp() {
  const [pageState, setPageState] = useState<'login' | 'sign-up'>('login');

  const pageStateCallback = useCallback((state: 'login' | 'sign-up') => {
    setPageState(state);
  }, []);

  return (
    <Container>
      <ContainerContent>
        <PageContainer>
          <PageImage>
            <h1>
              Tech
              <br />
              Challenge
              <br />
              {'</>'}
            </h1>
          </PageImage>

          {pageState === 'login' ? (
            <LoginForm pageStateCallback={pageStateCallback} />
          ) : (
            <SignUpForm pageStateCallback={pageStateCallback} />
          )}
        </PageContainer>
      </ContainerContent>
    </Container>
  );
}

export default UserLoginOrSignUp;
