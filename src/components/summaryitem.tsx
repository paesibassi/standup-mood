import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CurrentSpeaker from './currentspeaker';

type Props = {
  members: string[];
  memberIdx: number;
  elapsedSecs: number[];
  individualTime: number;
  averageMood: number;
};

function SummaryItem({
  members, memberIdx, elapsedSecs, individualTime, averageMood,
}: Props): JSX.Element {
  return (
    <ListGroup.Item as="li">
      <Container fluid className="px-0">
        <Row>
          <Col xs={2} />
          <Col xs={6} md={8}>
            <CurrentSpeaker
              members={members}
              memberIdx={memberIdx}
              elapsedSecs={elapsedSecs}
              individualTime={individualTime}
            />
          </Col>
          <Col>
            <p className="h6 mt-1 text-center">
              {`avg score: ${averageMood.toFixed(2)}`}
            </p>
          </Col>
        </Row>
      </Container>
    </ListGroup.Item>
  );
}

export default SummaryItem;
