import React, { FC } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Progress from './progress';
import MemberScore from './memberscore';
import MemberSwitch from './memberswitch';
import useGlobalContext from '../context/context';
import MoodHistory from './moodhist';

type Props = {
  memberName: string;
  index: number;
  activeMember: boolean;
  memberIdx: number;
  elapsedPercent?: number;
  barColor?: string;
};

const MemberItem: FC<Props> = ({
    memberName, index, activeMember, memberIdx, elapsedPercent, barColor,
  }) => {
  const { handleSwitch } = useGlobalContext();

  return (
    <ListGroup.Item
      as="li"
      action
      active={index === memberIdx}
      variant={activeMember !== true ? 'secondary' : 'false'}
    >
      <Container fluid className="px-0">
        <Row>
          <Col xs={1}>
            <MoodHistory memberName={memberName} />
          </Col>
          <Col xs={2}>
            <div onClick={() => handleSwitch?.(index)} role="button" tabIndex={0} onKeyPress={() => handleSwitch?.(index)}>
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
            />
          </Col>
          <Col>
            <MemberScore index={index} />
          </Col>
        </Row>
      </Container>
    </ListGroup.Item>
  );
};

export default MemberItem;
