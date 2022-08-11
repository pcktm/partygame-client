import React from 'react';
import ReactDOM from 'react-dom/client';
import {ChakraProvider, extendTheme} from '@chakra-ui/react';
import App from './App';
import {ColyseusClientProvider} from './lib/client';
import {RoomStoreProvider} from './lib/room';
import GlobalErrorBoundary from './components/GlobalErrorBounday';

const theme = extendTheme({
  fonts: {
    body: 'Work Sans, sans-serif',
    heading: 'Work Sans, sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
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
  </React.StrictMode>,
);
