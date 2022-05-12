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
  const pillBackground = barColor === '' ? 'bg-light text-dark' : `bg-${barColor}`;
  return (
    <div
      className="w-100"
      role="button"
      tabIndex={0}
      onClick={() => handleSelectMember?.(index)}
      onKeyPress={() => handleSelectMember?.(index)}
    >
      <ProgressBar
        className="d-none d-md-flex"
        style={{ height: '30px' }}
        now={elapsedPercent}
        label={`${elapsedPercent}%`}
        variant={barColor}
      />
      <div className={`d-md-none badge rounded-pill ${pillBackground} position-absolute top-50 start-50 translate-middle px-5 py-1`}>
        {`${elapsedPercent}%`}
      </div>
    </div>
  );
};

export default Progress;
