import React from 'react';
import { styled } from '../Styles/stitches.config';
import { IMochaTestJSON } from '../Types/interfaces/ITest';

const CodeRunnerContainer = styled('div', {
  display: 'flex',
  height: '100%',
  width: '100%',
  background: '#101010',
  borderRadius: '5px',
  fontFamily: '"Fira Code", monospace',
  fontSize: '13px',
  flexDirection: 'column',
});

const Header = styled('div', {
  height: '10%',
  width: '100%',
  borderBottom: '1px solid gray',
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  justifyContent: 'space-around',
});

const Body = styled('div', {
  height: '90%',
  width: '100%',
  display: 'flex',
  padding: '10px',
  flexDirection: 'column',
});

const BodyElements = styled('div', {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  overflowY: 'auto',
  padding: '10px',
});

const TestTitle = styled('h4', {
  paddingLeft: '5px',
});

const TestResult = styled('div', {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
});

const TestDetails = styled('div', {
  marginLeft: '25px',
});

const TestResultDescription = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'start',
  alignItems: 'center',
  fontWeight: 'bold',

  '& span': {
    padding: '2px 5px',
    marginRight: '5px',
  },
});

function TestUI({ testResult }: { testResult: IMochaTestJSON }) {
  return (
    <CodeRunnerContainer
      style={{
        border: !testResult.stats.failures
          ? '2px solid #039603'
          : '2px solid #ab1111',
      }}
    >
      <Header>
        <span>Tempo: {testResult.stats.duration}ms</span>
        <span>Código de Saída: {testResult.stats.failures}</span>
        <span style={{ color: '#039603' }}>
          Sucesso: {testResult.stats.passes}
        </span>
        <span style={{ color: '#ab1111' }}>
          Falhas: {testResult.stats.failures}
        </span>
      </Header>

      <Body>
        <BodyElements>
          <TestResult>
            <TestTitle
              style={{
                borderLeft: !testResult.stats.failures
                  ? '5px solid #039603'
                  : '5px solid #ab1111',
              }}
            >
              Resultados
            </TestTitle>
            <br />
            <TestResultDescription>
              {!testResult.stats.failures ? (
                <span style={{ backgroundColor: '#039603' }}>PASS</span>
              ) : (
                <span style={{ backgroundColor: '#ab1111' }}>FAIL</span>
              )}
              <p>{testResult.tests[0].title}</p>
            </TestResultDescription>
            <br />
            {testResult.stats.failures && (
              <TestDetails>{testResult.failures[0].err.stack}</TestDetails>
            )}
          </TestResult>
        </BodyElements>
      </Body>
    </CodeRunnerContainer>
  );
}

export default TestUI;
