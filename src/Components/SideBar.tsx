import * as React from 'react';
import { MdQuiz } from 'react-icons/md';
import { RiInputCursorMove } from 'react-icons/ri';
import { SiHtml5, SiJavascript } from 'react-icons/si';
import { styled } from '../Styles/stitches.config';

const SidebarDiv = styled('div', {
  background: '$background',
  width: '15%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '9px 3px 24px 4px rgba(0,0,0,0.25)',
  borderTopRightRadius: '15px',
  borderBottomRightRadius: '15px',
  position: 'relative',
  borderRight: '2px solid #ffffff1a',

  '& h3': {
    padding: '20px 10px',
    textAlign: 'center',
    borderBottom: '1px solid #ffffff1a',
  },

  '& ul': {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    listStyle: 'none',

    '& li': {
      width: '100%',
    },

    '& button': {
      fontSize: '16px',
      width: '100%',
      padding: '20px',
      color: 'white',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      outline: 'none',
      background: 'none',
      border: 'none',

      '& span': {
        marginLeft: '25px',
      },

      '&:not(:first-child)': {
        marginTop: '5px',
      },

      '&:hover': {
        background: '#ffffff1a',
      },
    },
  },
});

type Tab = 'js' | 'html' | 'quiz' | 'code-complete';

export default function SideBar({
  tabCallback,
  actualTab,
}: {
  tabCallback: (selectedTab: Tab) => void;
  actualTab: Tab;
}) {
  return (
    <SidebarDiv>
      <h3>Categorias</h3>
      <ul>
        <li>
          <button
            style={actualTab === 'js' ? { background: '#ffffff1a' } : {}}
            type="button"
            onClick={() => tabCallback('js')}
          >
            <SiJavascript size={25} color="#fcdf03" />
            <span>JavaScript</span>
          </button>
        </li>

        <li>
          <button
            style={actualTab === 'html' ? { background: '#ffffff1a' } : {}}
            type="button"
            onClick={() => tabCallback('html')}
          >
            <SiHtml5 size={25} color="#fc8c03" />
            <span>HTML (DOM)</span>
          </button>
        </li>

        <li>
          <button
            style={actualTab === 'quiz' ? { background: '#ffffff1a' } : {}}
            type="button"
            onClick={() => tabCallback('quiz')}
          >
            <MdQuiz size={25} color="#db03fc" />
            <span>Quiz</span>
          </button>
        </li>

        <li>
          <button
            style={
              actualTab === 'code-complete' ? { background: '#ffffff1a' } : {}
            }
            type="button"
            onClick={() => tabCallback('code-complete')}
          >
            <RiInputCursorMove size={25} color="#84fc03" />
            <span>Code Complete</span>
          </button>
        </li>
      </ul>
    </SidebarDiv>
  );
}
