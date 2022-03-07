import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import TimeForm from './timerange';
import MemberList from './memberlist';
import Buttons from './buttons';

function MainGrid({
  totalTime, numActiveMembers, individualTime, handleChangeRange, members, memberIdx,
  elapsedSecs, activeMembers, memberScores, averageMood, handleSwitch, handleChangeMood,
  handleSelectMember, startButtonState, handleStartStop, disabledNext, handleNext,
  elapsedPercents, barColors,
}) {
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
          <Buttons
            startButtonState={startButtonState}
            handleStartStop={handleStartStop}
            disabledNext={disabledNext}
            handleNext={handleNext}
          />
        </Col>
      </Row>
    </Container>
  );
}

MainGrid.propTypes = {
  totalTime: PropTypes.number.isRequired,
  numActiveMembers: PropTypes.number.isRequired,
  members: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeMembers: PropTypes.arrayOf(PropTypes.bool).isRequired,
  memberScores: PropTypes.arrayOf(PropTypes.number).isRequired,
  memberIdx: PropTypes.number.isRequired,
  elapsedSecs: PropTypes.arrayOf(PropTypes.number).isRequired,
  individualTime: PropTypes.number.isRequired,
  averageMood: PropTypes.number.isRequired,
  handleChangeRange: PropTypes.func.isRequired,
  handleSwitch: PropTypes.func.isRequired,
  handleChangeMood: PropTypes.func.isRequired,
  handleSelectMember: PropTypes.func.isRequired,
  startButtonState: PropTypes.string.isRequired,
  handleStartStop: PropTypes.func.isRequired,
  disabledNext: PropTypes.bool.isRequired,
  handleNext: PropTypes.func.isRequired,
  elapsedPercents: PropTypes.arrayOf(PropTypes.number).isRequired,
  barColors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default MainGrid;
