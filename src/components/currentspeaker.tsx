import React from 'react';
import Badge from 'react-bootstrap/Badge';
import { formatTimeMinSecs } from '../util';

type Props = {
  members: string[];
  memberIdx: number;
  elapsedSecs: number[];
  individualTime: number;
};

function CurrentSpeaker({
  members, memberIdx, elapsedSecs, individualTime,
}: Props): JSX.Element {
  const currentSpeaker = `${members[memberIdx]} `;
  const secondsRemaining = individualTime - elapsedSecs[memberIdx];
  const currentTimeRemaining = (secondsRemaining > 0)
    ? `${formatTimeMinSecs(secondsRemaining)}`
    : `-${formatTimeMinSecs(-secondsRemaining)}`;
  return (
    <h4 className="text-center text-primary">
      {currentSpeaker}
      <Badge pill bg={(secondsRemaining >= 0) ? 'primary' : 'danger'}>
        {currentTimeRemaining}
      </Badge>
    </h4>

  );
}

export default CurrentSpeaker;
