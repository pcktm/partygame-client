import {Room, Client} from 'colyseus.js';
import create, {StoreApi} from 'zustand';
import React, {useEffect} from 'react';
import createContext from 'zustand/context';
import {useToast} from '@chakra-ui/react';
import {useClient} from './client';
import {State} from './state';

const {Provider, useStore} = createContext<StoreApi<RoomState>>();

export const useRoomStore = useStore;

interface RoomState {
  room: Room<State>;
  joinRoomById: (roomId: string) => Promise<void>;
  createRoom: () => Promise<void>;
  dispose: () => void;
  setRoom: (room: Room) => void;
}

// LOL @ js pointer haxxx
const clientWrapper: {client?: Client} = {
  client: undefined,
};

export function RoomStoreProvider({children}: {children: React.ReactNode}) {
  const client = useClient();
  const toast = useToast();
  useEffect(() => {
    clientWrapper.client = client;
  }, [client]);

  return (
    <Provider
      createStore={() => create<RoomState>((set, get) => ({
        room: undefined as any,
        joinRoomById: async (roomId: string) => {
          const {client: cc} = clientWrapper;
          if (cc) {
            set({room: await cc.joinById(roomId)});
          }
        },
        createRoom: async () => {
          const {client: cc} = clientWrapper;
          if (cc) {
            set({room: await cc.create('game_room')});
          }
        },
        dispose: () => {
          get().room?.removeAllListeners();
          get().room?.leave(false);
        },
        setRoom: (room: Room) => {
          room.onLeave((code) => {
            if (code === 1000) {
              toast({
                description: 'Room left',
                status: 'info',
                duration: 9000,
                isClosable: true,
                position: 'top',
              });
            } else {
              toast({
                description: 'You have been disconnected from the room',
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top',
              });
            }
            set({room: undefined});
          });
          set({room});
        },
      }))}
    >
      {children}
    </Provider>
  );
}
