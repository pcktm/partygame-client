import {useToast} from '@chakra-ui/react';
import {Client} from 'colyseus.js';
import React, {useContext, useEffect, useState} from 'react';

const Context = React.createContext<Client | undefined>(undefined);

export const ColyseusClientProvider = ({children}: {children: React.ReactNode}) => {
  const [client, setClient] = useState<Client>();

  const toast = useToast();

  useEffect(() => {
    if (!client) {
      const cc = new Client(import.meta.env.VITE_COLYSEUS_SOCKET_URL);
      setClient(cc);
    }
  }, [client]);

  useEffect(() => {
    fetch(import.meta.env.VITE_COLYSEUS_SERVER_URL).then((r) => console.debug(r)).catch((r) => {
      if (toast.isActive('colyseus-api-down')) return;
      toast({
        id: 'colyseus-api-down',
        description: 'Game server seems down!',
        status: 'error',
        isClosable: false,
        duration: 100000000,
        position: 'top-right',
      });
    });
  }, [toast]);

  return (
    <Context.Provider value={client}>
      {children}
    </Context.Provider>
  );
};

export const useClient = () => {
  const client = useContext(Context);
  return client;
};
