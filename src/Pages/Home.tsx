import React, { useCallback, useState } from 'react';
import { styled } from '../Styles/stitches.config';
import { Info } from '../Components/Home/Info';

import Typing from '../Components/Home/Typing';
import QuestionBlock from '../Components/Home/QuestionBlock';
import IntroCards from '../Components/Home/IntroCards';
import CategoriesCards from '../Components/Home/CategoriesCards';
import PurposeCard from '../Components/Home/PurposeCard';

import mariobg from '../Assets/images/mario-bg.jpg';

const GeneralDiv = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

const PageContentDiv = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
});

const CardDiv = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  /* Set a specific height */
  minHeight: '100vh',
  /* Create the parallax scrolling effect */
  background: `url(${mariobg})`,
  backgroundPosition: 'fixed',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  flex: 1,
});

function Home() {
  const [infoEnabled, setInfoEnabled] = useState<boolean>(false);

  const enableInfoCallback = useCallback((enabled: boolean) => {
    setInfoEnabled(enabled);
  }, []);

  return (
    <GeneralDiv style={{ overflow: `${infoEnabled ? 'hidden' : 'inherit'}` }}>
      <PageContentDiv>
        <CardDiv>
          {infoEnabled && <Info enableInfoCallback={enableInfoCallback} />}
          <Typing />
          <QuestionBlock enableInfoCallback={enableInfoCallback} />
        </CardDiv>

        <IntroCards />

        <CategoriesCards />

        <PurposeCard />
      </PageContentDiv>
    </GeneralDiv>
  );
}

export default Home;
