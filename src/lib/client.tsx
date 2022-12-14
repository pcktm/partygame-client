import {useToast} from '@chakra-ui/react';
import {Client} from 'colyseus.js';
import React, {useContext, useEffect, useState} from 'react';

const Context = React.createContext<Client | undefined>(undefined);

export const ColyseusClientProvider = ({children}: {children: React.ReactNode}) => {
  const [client, setClient] = useState<Client>();

  useEffect(() => {
    if (!client) {
      const cc = new Client(import.meta.env.VITE_COLYSEUS_SOCKET_URL);
      setClient(cc);
    }
  }, [client]);

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
