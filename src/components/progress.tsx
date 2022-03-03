import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

type Props = {
  elapsedPercent: number;
  barColor: string;
  index: number;
  handleSelectMember: (index: number) => void;
};

function Progress({
  elapsedPercent, barColor, index, handleSelectMember,
}: Props): JSX.Element {
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

export default Progress;
