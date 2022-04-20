import { hot, setConfig } from 'react-hot-loader';
import React, { FC } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './App.css';
import { GlobalProvider } from './context/context';
import TimeRange from './components/timerange';
import MemberList from './components/memberlist';
import Buttons from './components/buttons';
import AlertMessage from './components/alert';

setConfig({
  showReactDomPatchNotification: false,
});

const App: FC = () => (
  <GlobalProvider>
    <Container className="p-3">
      <Row>
        <Col>
          <h1 className="header">Standup timer & mood scorer</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <TimeRange />
        </Col>
      </Row>
      <Row>
        <Col>
          <MemberList />
        </Col>
      </Row>
      <Row>
        <Col>
          <AlertMessage />
          <Buttons />
        </Col>
      </Row>
    </Container>
  </GlobalProvider>
);

export default hot(module)(App);
