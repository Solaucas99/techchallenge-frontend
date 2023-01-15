import React, { useCallback, useState } from 'react';
import { IoMdStats } from 'react-icons/io';

import SideBar from '../../Components/SideBar';
import DashboardJS from '../../Components/User/Dashboard/DashboardJS';
import DashboardHTML from '../../Components/User/Dashboard/DashboardHTML';
import DashboardQuiz from '../../Components/User/Dashboard/DashboardQuiz';
import DashboardCodeComplete from '../../Components/User/Dashboard/DashboardCodeComplete';

import { PageTitleH1 } from '../../Components/Useful/PageTitleH1';
import { styled } from '../../Styles/stitches.config';

const DashboardContent = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  minHeight: '85vh',
  position: 'relative',
  marginTop: '80px',
  background: '#2e2e2e',
  boxShadow: '4px 3px 15px 0px rgba(0,0,0,0.25)',
});

const Content = styled('div', {
  width: '85%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: '15px 25px',
});

type Tab = 'js' | 'html' | 'quiz' | 'code-complete';

function Dashboard() {
  const [tab, setTab] = useState<Tab>('js');

  const tabCallback = useCallback((selectedTab: Tab) => {
    setTab(selectedTab);
  }, []);

  return (
    <DashboardContent>
      <SideBar tabCallback={tabCallback} actualTab={tab} />
      <IoMdStats
        style={{
          position: 'absolute',
          right: '10px',
          top: '10px',
          marginBottom: '15px',
        }}
        size={40}
      />

      <Content>
        <PageTitleH1>Meu Dashboard</PageTitleH1>

        {tab === 'js' ? <DashboardJS /> : null}
        {tab === 'html' ? <DashboardHTML /> : null}
        {tab === 'quiz' ? <DashboardQuiz /> : null}
        {tab === 'code-complete' ? <DashboardCodeComplete /> : null}
      </Content>
    </DashboardContent>
  );
}

export default Dashboard;
