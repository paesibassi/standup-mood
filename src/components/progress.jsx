import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'react-bootstrap/ProgressBar';

function Progress({
  elapsedPercent, barColor, index, handleSelectMember,
}) {
  return (
    <ProgressBar
      className="h-100"
      now={elapsedPercent}
      label={`${elapsedPercent}%`}
      onClick={() => handleSelectMember(index)}
      variant={barColor}
    />
  );
}

Progress.propTypes = {
  elapsedPercent: PropTypes.number.isRequired,
  barColor: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  handleSelectMember: PropTypes.func.isRequired,
};

export default Progress;
