import React, { useCallback, useState } from 'react';

import { ContainerContent } from '../../../../../../Components/Useful/ContainerContent';
import { PageTitleH1 } from '../../../../../../Components/Useful/PageTitleH1';
import { Container } from '../../../../../../Components/Useful/Container';
import ChallengeForm from '../../../../../../Components/Admin/Challenges/Categories/Quiz/Create/ChallengeForm';
import QuestionsForm from '../../../../../../Components/Admin/Challenges/Categories/Quiz/Create/QuestionsForm';

function CreateQuizChallengeIndex() {
  const [challengeId, setChallengeId] = useState<string>('');

  const challengeIdCallback = useCallback((id: string) => {
    setChallengeId(id);
  }, []);

  return (
    <Container>
      <ContainerContent>
        <PageTitleH1>Criar desafio de Quiz</PageTitleH1>
        {!challengeId ? (
          <ChallengeForm challengeIdCallback={challengeIdCallback} />
        ) : (
          <QuestionsForm challengeId={challengeId} />
        )}
      </ContainerContent>
    </Container>
  );
}

export default CreateQuizChallengeIndex;
