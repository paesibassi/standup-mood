import React from 'react';
import PropTypes from 'prop-types';
import Stack from 'react-bootstrap/Stack';
import StartButton from './startbutton';
import NextButton from './nextbutton';

function Buttons({
  startButtonState, handleStartStop, disabledNext, handleNext,
}) {
  return (
    <Stack direction="horizontal" gap={3} className="col-6 mx-auto mt-3">
      <StartButton startButtonState={startButtonState} startStop={handleStartStop} />
      <NextButton disabledNext={disabledNext} next={handleNext} />
    </Stack>
  );
}

Buttons.propTypes = {
  startButtonState: PropTypes.string.isRequired,
  handleStartStop: PropTypes.func.isRequired,
  disabledNext: PropTypes.bool.isRequired,
  handleNext: PropTypes.func.isRequired,
};

export default Buttons;
