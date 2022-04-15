import React, { FC } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Progress from './progress';
import MemberScore from './memberscore';
import MemberSwitch from './memberswitch';
import MoodHistory from './moodhist';
import { DateValue } from './visualization/sparkline';
import useGlobalContext from '../context/context';

type Props = {
  memberName: string;
  index: number;
  activeMember: boolean;
  memberIdx: number;
  memberHistory?: DateValue[];
  elapsedPercent?: number;
  barColor?: string;
};

const MemberItem: FC<Props> = ({
    memberName, index, activeMember, memberIdx, elapsedPercent, barColor, memberHistory,
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
          <Col xs={2} className="px-1">
            <Stack direction="horizontal" onClick={() => handleSwitch?.(index)} onKeyPress={() => handleSwitch?.(index)}>
              <MemberSwitch
                memberName={memberName}
                activeMember={activeMember}
              />
              <MoodHistory memberHistory={memberHistory} />
            </Stack>
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
