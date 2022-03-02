import React from 'react';
import PropTypes from 'prop-types';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CurrentSpeaker from './currentspeaker';

function SummaryItem({
  members, memberIdx, elapsedSecs, individualTime, averageMood,
}) {
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

SummaryItem.propTypes = {
  members: PropTypes.arrayOf(PropTypes.string).isRequired,
  memberIdx: PropTypes.number.isRequired,
  elapsedSecs: PropTypes.arrayOf(PropTypes.number).isRequired,
  individualTime: PropTypes.number.isRequired,
  averageMood: PropTypes.number.isRequired,
};

export default SummaryItem;
