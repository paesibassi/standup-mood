import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { minsSecondsSubstr, formatTimeMinSecs } from '../util';

// TODO define these in config file
const minTime = 5;
const maxTime = 20;
const stepTime = 1;

function TimeForm({
  totalTime, individualTime, numActiveMembers, handleChangeRange,
}) {
  const timeLabel = `Standup time: ${formatTimeMinSecs(totalTime, minsSecondsSubstr)}`;
  const timeText = `${formatTimeMinSecs(individualTime, minsSecondsSubstr)} for ${numActiveMembers} joiners`;
  return (
    <Form>
      <Form.Group as={Row} className="mb-3" controlId="formBasicRange">
        <Form.Label column sm={2} className="pt-0">{timeLabel}</Form.Label>
        <Col sm={8}>
          <Form.Range
            min={minTime}
            max={maxTime}
            step={stepTime}
            value={totalTime / 60}
            onChange={(e) => handleChangeRange(e)}
          />
        </Col>
        <Col>
          <Form.Text className="text-muted">{timeText}</Form.Text>
        </Col>
      </Form.Group>
    </Form>
  );
}

TimeForm.propTypes = {
  totalTime: PropTypes.number.isRequired,
  numActiveMembers: PropTypes.number.isRequired,
  individualTime: PropTypes.number.isRequired,
  handleChangeRange: PropTypes.func.isRequired,
};

export default TimeForm;
