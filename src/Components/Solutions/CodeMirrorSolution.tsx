import React, { useEffect, useRef, useState } from 'react';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';
import { basicSetup, EditorView } from 'codemirror';
import { BsHeartFill } from 'react-icons/bs';

import { toast } from 'react-toastify';
import { styled } from '../../Styles/stitches.config';
import {
  CodeMirrorSolutionsTheme,
  ReadOnly,
} from '../../Utils/codeMirrorSettings';
import { instanceAPI } from '../../Utils/axios';
import {
  IAxiosDelete,
  IAxiosGet,
  IAxiosPost,
} from '../../Types/interfaces/IAxiosRequests';
import { IJS_Solution_Like } from '../../Types/entities/IJS_Solution_Like';
import { useUserContextProvider } from '../../Providers/UserContextProvider';

const DivCodeFrame = styled('div', {
  background: 'linear-gradient(140deg, rgb(207, 47, 152), rgb(106, 61, 236))',
  height: '400px',
  width: '90%',
  padding: '50px 15px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '4px 3px 15px 0px rgba(0,0,0,0.25)',
  border: '5px solid #303133',
});

const DivWindow = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '70%',
  height: '500px',
  background: '#000000bf',
  borderRadius: '12px',
  padding: '16px',
  justifyContent: 'space-between',
  boxShadow: '4px 3px 15px 0px rgba(0,0,0,0.25)',
});

const Header = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  color: '#ffffff4a',

  '& div.controls': {
    display: 'flex',
    flexDirection: 'row',
    width: '10%',
    justifyContent: 'space-around',
    position: 'absolute',
    left: 0,
  },

  '& div.title': {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
});

const Footer = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',

  '& div.controls': {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
    fontSize: '16px',

    '& button': {
      outline: 'none',
      border: 'none',
      background: 'none',
      color: 'inherit',
      fontSize: '20px',
      marginRight: '5px',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',

      '&:hover': {
        color: 'red',
      },
    },
  },
});

const SpanControl = styled('div', {
  color: 'gray',
  borderRadius: '50px',
  background: '#ffffff4a',
  height: '15px',
  width: '15px',
});

const CodeContainer = styled('div', {
  width: '100%',
  height: '80%',
});

type CMProps = {
  solutionId: string;
  solutionType: 'js' | 'html';
  codeUrl: string;
  likes: number;
  username: string;
};

function CodeMirrorSolution({
  solutionId,
  solutionType,
  codeUrl,
  likes,
  username,
}: CMProps) {
  const [solutionLiked, setSolutionLiked] = useState<boolean>(false);
  const currentLikes = useRef<number>(likes);

  const ref = useRef<HTMLDivElement>();
  const likeRef = useRef<HTMLButtonElement>();

  const { userContext } = useUserContextProvider();

  const handleLike = async () => {
    try {
      if (!solutionLiked) {
        await instanceAPI.post<IAxiosPost<IJS_Solution_Like>>(
          `/solutions/${solutionType}/likes/create`,
          {
            [`${solutionType}_solution_id`]: solutionId,
            user_id: userContext.id,
          }
        );
        currentLikes.current += 1;
        likeRef.current.classList.add('animate__heartBeat');
      } else {
        await instanceAPI.delete<IAxiosDelete<IJS_Solution_Like>>(
          `/solutions/${solutionType}/likes/${solutionId}/${userContext.id}`
        );
        currentLikes.current -= 1;
        likeRef.current.classList.remove('animate__heartBeat');
      }

      setSolutionLiked(prevLiked => !prevLiked);
    } catch (err) {
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Erro inesperado! Tente novamente mais tarde');
      }
    }
  };

  useEffect(() => {
    const fetchLike = async () => {
      try {
        const { data } = await instanceAPI.get<IAxiosGet<IJS_Solution_Like[]>>(
          `/solutions/${solutionType}/likes/${solutionId}/${userContext.id}`
        );

        if (data.result.length > 0) {
          setSolutionLiked(true);
        }
      } catch (err) {
        if (err.response?.data?.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error('Erro inesperado! Tente novamente mais tarde');
        }
      }
    };

    fetchLike();

    const mountCodeMirror = async () => {
      try {
        const { data } = await instanceAPI.get(codeUrl);

        new EditorView({
          state: EditorState.create({
            extensions: [
              basicSetup,
              javascript(),
              CodeMirrorSolutionsTheme,
              ReadOnly(),
            ],
            doc: data.toString(),
          }),
          parent: ref.current,
        });
      } catch (err) {
        if (err.response?.data?.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error('Erro inesperado! Tente novamente mais tarde');
        }
      }
    };

    mountCodeMirror();
  }, [codeUrl, solutionId, solutionType, userContext.id]);

  return (
    <DivCodeFrame>
      <DivWindow>
        <Header>
          <div className="controls">
            <SpanControl />
            <SpanControl />
            <SpanControl />
          </div>

          <div className="title">
            <p>@{username}/solution.js</p>
          </div>
        </Header>

        <CodeContainer ref={ref} />

        <Footer>
          <div className="controls">
            <button
              onClick={handleLike}
              type="button"
              className="animate__animated"
              ref={likeRef}
            >
              <BsHeartFill color={solutionLiked ? 'red' : 'white'} />
            </button>

            <span>{currentLikes.current}</span>
          </div>
        </Footer>
      </DivWindow>
    </DivCodeFrame>
  );
}

export default CodeMirrorSolution;
