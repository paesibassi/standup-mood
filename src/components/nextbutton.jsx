import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

function NextButton({ disabledNext, next }) {
  return (
    <Button className="col-6" disabled={disabledNext} onClick={() => next()}>
      Next
    </Button>
  );
}

NextButton.propTypes = {
  disabledNext: PropTypes.bool.isRequired,
  next: PropTypes.func.isRequired,
};

export default NextButton;
