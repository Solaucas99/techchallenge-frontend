import React from 'react';
import ResponsiveAppBar from '../Components/AppBar';
import Footer from '../Components/Footer';
import Loading from '../Components/Loading';
import { useAppContextProvider } from '../Providers/AppContextProvider';
import { styled } from './stitches.config';

import noise from '../Assets/images/noise-bg.png';

type Props = {
  children: React.ReactNode;
  className?: string;
};

const ContainerBody = styled('div', {
  backgroundColor: '$background',
  color: '$textPrimary',
  width: '100%',
  minHeight: '100vh',
  fontFamily: '"poppins", sans-serif',
  backgroundImage: `url(${noise})`,
  backgroundPosition: '0px 0px',
  backgroundSize: '200px 200px',
});

function GlobalDiv({ children, className }: Props) {
  const { appContext } = useAppContextProvider();

  return (
    <>
      {appContext.isLoading && <Loading />}
      <ResponsiveAppBar />
      <ContainerBody className={className || ''}>{children}</ContainerBody>
      <Footer />
    </>
  );
}

GlobalDiv.defaultProps = {
  className: '',
};

export { GlobalDiv };
