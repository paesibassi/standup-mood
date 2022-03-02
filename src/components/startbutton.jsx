import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

function StartButton({ startButtonState, startStop }) {
  return (
    <Button className="col-6" disabled={startButtonState === 'Select Members'} onClick={() => startStop()}>
      {startButtonState}
    </Button>
  );
}

StartButton.propTypes = {
  startButtonState: PropTypes.string.isRequired,
  startStop: PropTypes.func.isRequired,
};

export default StartButton;
