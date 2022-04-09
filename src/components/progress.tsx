import React, { FC } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import useGlobalContext from '../context/context';

type Props = {
  elapsedPercent?: number;
  barColor?: string;
  index: number;
};

const Progress: FC<Props> = ({ elapsedPercent, barColor, index }) => {
  const { handleSelectMember } = useGlobalContext();
  return (
    <ProgressBar
      className="h-100"
      now={elapsedPercent}
      label={`${elapsedPercent}%`}
      onClick={() => handleSelectMember?.(index)}
      variant={barColor}
    />
  );
};

export default Progress;
