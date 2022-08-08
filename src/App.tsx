import {useEffect, useState} from 'react';
import {
  Alert, AlertIcon, AlertTitle, AlertDescription,
} from '@chakra-ui/react';
import shallow from 'zustand/shallow';
import Landing from './screens/Landing';
import Lobby from './screens/Lobby';
import {useRoomStore} from './lib/room';
import QuestionAskedScreen from './screens/QuestionAsked';
import DuelScreen from './screens/Duel';

function App() {
  const {state, revision} = useRoomStore((s) => ({revision: s.revision, state: s.state}), shallow);

  if (!state || !state?.screen) {
    return <Landing />;
  }

  if (state.screen === 'lobby') {
    return <Lobby />;
  }

  if (state.screen === 'questionAsked') {
    return <QuestionAskedScreen />;
  }

  if (state.screen === 'duel') {
    return <DuelScreen />;
  }

  return (
    <div>
      <Alert
        status="error"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          It&apos;s completely fucked
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Something went REEEAL wrong, just refresh i guess lol
        </AlertDescription>
      </Alert>
      {JSON.stringify(state ?? null)}
    </div>
  );
}

export default App;
