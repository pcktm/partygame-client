import React from 'react';
import ReactDOM from 'react-dom/client';
import {ChakraProvider, extendTheme} from '@chakra-ui/react';
import {SWRConfig} from 'swr';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import App from './App';
import {ColyseusClientProvider} from './lib/client';
import {RoomStoreProvider} from './lib/room';
import GlobalErrorBoundary from './components/GlobalErrorBounday';

import en from './locales/en.json';
import pl from './locales/pl.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en, pl,
    },
    lng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

const theme = extendTheme({
  fonts: {
    body: 'Work Sans, sans-serif',
    heading: 'Work Sans, sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(import.meta.env.VITE_COLYSEUS_SERVER_URL + resource, init).then((res) => res.json()),
      }}
    >
      <ChakraProvider theme={theme}>
        {/* todo: customize theme */}
        <GlobalErrorBoundary>
          <ColyseusClientProvider>
            <RoomStoreProvider>
              <App />
            </RoomStoreProvider>
          </ColyseusClientProvider>
        </GlobalErrorBoundary>
      </ChakraProvider>
    </SWRConfig>
  </React.StrictMode>,
);
