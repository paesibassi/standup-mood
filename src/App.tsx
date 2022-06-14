import { hot, setConfig } from 'react-hot-loader';
import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Stack from 'react-bootstrap/Stack';
import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GlobalProvider } from './context/context';
import TimeRange from './components/timerange';
import Buttons from './components/buttons';
import AlertMessage from './components/alert';

setConfig({
  showReactDomPatchNotification: false,
});

const queryClient = new QueryClient();

const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <GlobalProvider>
      <Stack gap={3} className="m-sm-3 m-1 p-sm-3 p-1">
        <h1 className="header">Standup timer & mood scorer</h1>
        <TimeRange />
        <Outlet />
        <AlertMessage />
        <Buttons />
      </Stack>
    </GlobalProvider>
  </QueryClientProvider>
);

export default hot(module)(App);
