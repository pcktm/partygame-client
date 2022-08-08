/* eslint-disable no-promise-executor-return */
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
  state: State;
  revision: number;
  joinRoomById: (roomId: string, name: string) => Promise<void>;
  createRoom: (name: string) => Promise<void>;
  dispose: () => void;
  setRoom: (room: Room) => void;
}

// LOL @ js pointer haxxx
// V8 engine? BTFOd & fucked
const clientWrapperHAXX: {client?: Client} = {
  client: undefined,
};

export function RoomStoreProvider({children}: {children: React.ReactNode}) {
  const client = useClient();
  const toast = useToast();
  useEffect(() => {
    clientWrapperHAXX.client = client;
  }, [client]);

  return (
    <Provider
      createStore={() => create<RoomState>((set, get) => ({
        room: undefined as any,
        state: undefined as any,
        revision: 0,
        joinRoomById: async (roomId, nickname) => {
          const {client: cc} = clientWrapperHAXX;
          if (cc) {
            try {
              const r = await cc.joinById<State>(roomId, {nickname});
              await new Promise((res) => setTimeout(res, 500));
              get().setRoom(r);
            } catch (e) {
              toast({
                description: `Failed to join room: "${roomId.toUpperCase()}"`,
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top',
              });
            }
          }
        },
        createRoom: async (nickname) => {
          const {client: cc} = clientWrapperHAXX;
          if (cc) {
            try {
              const r = await cc.create<State>('game_room', {nickname});
              get().setRoom(r);
            } catch (e) {
              toast({
                description: 'Failed to create room',
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top',
              });
            }
          }
        },
        setRoom: async (room: Room) => {
          if (get().room) {
            get().dispose();
          }
          set({room, state: room.state});
          room.onStateChange(async (newState) => {
            set({state: newState, revision: get().revision + 1});
          });
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
            get().dispose();
          });
        },
        dispose: () => {
          console.debug('Disposing room');
          get().room?.removeAllListeners();
          try {
            get().room?.leave(false);
          } catch (e) {
            console.error(e);
          }
          set({room: undefined, state: undefined});
        },
      }))}
    >
      {children}
    </Provider>
  );
}
