import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { progressPerc } from '../util';

function progressVariant(percent) {
  if (percent === 100) { return 'success'; }
  if (percent > 90) { return 'danger'; }
  if (percent > 75) { return 'warning'; }
  return '';
}

function Progress({
  elapsedSecs, individualTime, index, handleSelectMember,
}) {
  const elapsedPercent = progressPerc(elapsedSecs, individualTime);
  const variant = progressVariant(elapsedPercent);
  return (
    <ProgressBar
      className="h-100"
      now={elapsedPercent}
      label={`${elapsedPercent}%`}
      onClick={() => handleSelectMember(index)}
      variant={variant}
    />
  );
}

Progress.propTypes = {
  elapsedSecs: PropTypes.number.isRequired,
  individualTime: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  handleSelectMember: PropTypes.func.isRequired,
};

export default Progress;
