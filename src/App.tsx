import { hot, setConfig } from 'react-hot-loader';
import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Stack from 'react-bootstrap/Stack';
import './App.css';
import { GlobalProvider } from './context/context';
import TimeRange from './components/timerange';
import Buttons from './components/buttons';
import AlertMessage from './components/alert';

setConfig({
  showReactDomPatchNotification: false,
});

const App: FC = () => (
  <GlobalProvider>
    <Stack gap={3} className="m-sm-3 m-1 p-sm-3 p-1">
      <h1 className="header">Standup timer & mood scorer</h1>
      <TimeRange />
      <Outlet />
      <AlertMessage />
      <Buttons />
    </Stack>
  </GlobalProvider>
);

export default hot(module)(App);
