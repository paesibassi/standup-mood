import React from 'react';
import PropTypes from 'prop-types';
import Badge from 'react-bootstrap/Badge';
import { formatTimeMinSecs } from '../util';

function CurrentSpeaker({
  members, memberIdx, elapsedSecs, individualTime,
}) {
  const currentSpeaker = `${members[memberIdx]} `;
  const currentTimeRemaining = `${formatTimeMinSecs(individualTime - elapsedSecs[memberIdx])}`;
  return (
    <h4 className="text-center text-primary">
      {currentSpeaker}
      <Badge pill>{currentTimeRemaining}</Badge>
    </h4>

  );
}

CurrentSpeaker.propTypes = {
  members: PropTypes.arrayOf(PropTypes.string).isRequired,
  memberIdx: PropTypes.number.isRequired,
  elapsedSecs: PropTypes.arrayOf(PropTypes.number).isRequired,
  individualTime: PropTypes.number.isRequired,
};

export default CurrentSpeaker;
