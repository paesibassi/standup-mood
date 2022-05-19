import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css';

import App from './App';
import MemberList from './components/memberlist';

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={(<MemberList />)} />
        <Route path="*" element={<MemberList />} />
      </Route>
    </Routes>
  </BrowserRouter>,
    document.getElementById('root'),
);
