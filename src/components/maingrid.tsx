import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import TimeForm from './timerange';
import MemberList from './memberlist';
import Buttons from './buttons';
import AlertMessage from './alert';

type Props = {
  totalTime: number;
  numActiveMembers: number;
  members: string[];
  activeMembers: boolean[];
  memberScores: number[];
  memberIdx: number;
  elapsedSecs: number[];
  individualTime: number;
  averageMood: number;
  handleChangeRange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitch: (index: number) => void;
  handleChangeMood: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectMember: (index: number) => void;
  startButtonState: string;
  handleStartStop: () => void;
  disabledNext: boolean;
  handleNext: () => void;
  elapsedPercents: number[];
  barColors: string[];
  handleSubmit: () => void;
  isAlertVisible: boolean;
  messageHeading: string;
  messageBody: string;
  handleCloseAlert: () => void;
};

function MainGrid({
  totalTime, numActiveMembers, individualTime, handleChangeRange, members, memberIdx,
  elapsedSecs, activeMembers, memberScores, averageMood, handleSwitch, handleChangeMood,
  handleSelectMember, startButtonState, handleStartStop, disabledNext, handleNext,
  elapsedPercents, barColors, handleSubmit, isAlertVisible, messageHeading, messageBody,
  handleCloseAlert,
}: Props): JSX.Element {
  return (
    <Container className="p-3">
      <Row>
        <Col>
          <h1 className="header">Standup timer & mood scorer</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <TimeForm
            totalTime={totalTime}
            numActiveMembers={numActiveMembers}
            individualTime={individualTime}
            handleChangeRange={handleChangeRange}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <MemberList
            members={members}
            activeMembers={activeMembers}
            memberScores={memberScores}
            memberIdx={memberIdx}
            elapsedSecs={elapsedSecs}
            individualTime={individualTime}
            averageMood={averageMood}
            elapsedPercents={elapsedPercents}
            barColors={barColors}
            handleSwitch={handleSwitch}
            handleChangeMood={handleChangeMood}
            handleSelectMember={handleSelectMember}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <AlertMessage
            isAlertVisible={isAlertVisible}
            messageHeading={messageHeading}
            messageBody={messageBody}
            handleCloseAlert={handleCloseAlert}
          />
          <Buttons
            startButtonState={startButtonState}
            handleStartStop={handleStartStop}
            disabledNext={disabledNext}
            handleNext={handleNext}
            handleSubmit={handleSubmit}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default MainGrid;
