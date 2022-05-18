import React, { FC } from 'react';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import useGlobalContext from '../context/context';
import { startButtonValues } from '../context/state';

const readyToSubmit = (elapsedSecs: number[], startButtonState?: startButtonValues): boolean => {
  if (startButtonState === undefined) return false;
  const notSubmittableStates = ['Select Members', 'Stop'];
  if (notSubmittableStates.includes(startButtonState)) return false;
  if (elapsedSecs.reduce((p, c) => p + c, 0) === 0) return false;
  return true;
};

const Buttons: FC = () => {
  const {
    startButtonState, handleStartStop, disabledNext, handleNext, handleSubmit, elapsedSecs,
  } = useGlobalContext();
  const disabledSubmit = !readyToSubmit(elapsedSecs, startButtonState);

  return (
    <Stack direction="horizontal" className="mt-3 w-100 justify-content-evenly">
      <Button
        className="w-25"
        disabled={startButtonState === 'Select Members'}
        onClick={() => handleStartStop?.()}
      >
        {startButtonState}
      </Button>
      <Button
        className="w-25"
        disabled={disabledNext}
        onClick={() => handleNext?.()}
      >
        Next
      </Button>
      <Button
        className="w-25"
        disabled={disabledSubmit}
        onClick={() => handleSubmit?.()}
      >
        Submit
      </Button>
    </Stack>
  );
};

export default Buttons;
