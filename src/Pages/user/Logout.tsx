import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../Components/Useful/Container';
import { ContainerContent } from '../../Components/Useful/ContainerContent';
import { useUserContextProvider } from '../../Providers/UserContextProvider';

function Logout() {
  const { removeUserContext } = useUserContextProvider();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      removeUserContext();
      navigate('/');
      navigate(0);
    }, 2000);
  }, [navigate, removeUserContext]);

  return (
    <Container>
      <ContainerContent>
        <p>Seu logout foi feito com sucesso!</p>
      </ContainerContent>
    </Container>
  );
}

export default Logout;
