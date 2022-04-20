import React, { FC } from 'react';
import Button from 'react-bootstrap/Button';
import useGlobalContext from '../context/context';

const StartButton: FC = () => {
  const { startButtonState, handleStartStop } = useGlobalContext();

  return (
    <Button className="col-4" disabled={startButtonState === 'Select Members'} onClick={() => handleStartStop?.()}>
      {startButtonState}
    </Button>
  );
};

export default StartButton;
