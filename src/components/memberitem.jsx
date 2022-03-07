import React from 'react';
import PropTypes from 'prop-types';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Progress from './progress';
import MemberScore from './memberscore';
import MemberSwitch from './memberswitch';

function MemberItem({
  memberName, index, activeMember, memberScore, memberIdx, elapsedPercent, barColor,
  handleSwitch, handleSelectMember, handleChangeMood,
}) {
  return (
    <ListGroup.Item
      as="li"
      action
      active={index === memberIdx}
      variant={activeMember !== true ? 'secondary' : 'false'}
    >
      <Container fluid className="px-0">
        <Row>
          <Col xs={2}>
            <div onClick={() => handleSwitch(index)} role="button" tabIndex={0} onKeyPress={() => handleSwitch(index)}>
              <MemberSwitch
                memberName={memberName}
                activeMember={activeMember}
              />
            </div>
          </Col>
          <Col xs={6} md={8}>
            <Progress
              elapsedPercent={elapsedPercent}
              barColor={barColor}
              index={index}
              handleSelectMember={handleSelectMember}
            />
          </Col>
          <Col>
            <MemberScore
              memberScore={memberScore}
              index={index}
              handleChangeMood={handleChangeMood}
            />
          </Col>
        </Row>
      </Container>
    </ListGroup.Item>
  );
}

MemberItem.propTypes = {
  memberName: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  activeMember: PropTypes.bool.isRequired,
  memberScore: PropTypes.number.isRequired,
  memberIdx: PropTypes.number.isRequired,
  elapsedPercent: PropTypes.number.isRequired,
  barColor: PropTypes.string.isRequired,
  handleSwitch: PropTypes.func.isRequired,
  handleChangeMood: PropTypes.func.isRequired,
  handleSelectMember: PropTypes.func.isRequired,
};

export default MemberItem;
