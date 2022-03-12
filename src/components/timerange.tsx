import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { minsSecondsSubstr, formatTimeMinSecs } from '../util';

// TODO define these in config file
const minTime = 5;
const maxTime = 20;
const stepTime = 1;

type Props = {
  totalTime: number;
  numActiveMembers: number;
  individualTime: number;
  handleChangeRange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function TimeForm({
  totalTime, individualTime, numActiveMembers, handleChangeRange,
}: Props): JSX.Element {
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

export default TimeForm;
