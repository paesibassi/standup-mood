import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Progress from './progress';
import MemberScore from './memberscore';
import MemberSwitch from './memberswitch';

type Props = {
  memberName: string;
  index: number;
  activeMember: boolean;
  memberScore: number;
  memberIdx: number;
  elapsedPercent: number;
  barColor: string;
  handleSwitch: (index: number) => void;
  handleChangeMood: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectMember: (index: number) => void;
};

function MemberItem({
  memberName, index, activeMember, memberScore, memberIdx, elapsedPercent, barColor,
  handleSwitch, handleSelectMember, handleChangeMood,
}: Props): JSX.Element {
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

export default MemberItem;
