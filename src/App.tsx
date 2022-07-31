import {useEffect, useState} from 'react';
import Landing from './screens/Landing';
import Lobby from './screens/Lobby';
import {useRoomStore} from './lib/room';

function App() {
  const room = useRoomStore((s) => s.room);

  if (!room) {
    return <Landing />;
  }

  return (
    <div>
      {room.state.screen === 'lobby' && <Lobby />}
    </div>
  );
}

export default App;
