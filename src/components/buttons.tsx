import React, { FC } from 'react';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import useGlobalContext from '../context/context';

const Buttons: FC = () => {
  const {
    startButtonState, handleStartStop, disabledNext, handleNext, handleSubmit,
  } = useGlobalContext();
  const submittable = ['Select Members', 'Stop'];

  return (
    <Stack direction="horizontal" gap={2} className="mt-3 justify-content-evenly">
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
        disabled={startButtonState ? submittable.includes(startButtonState) : false}
        onClick={() => handleSubmit?.()}
      >
        Submit
      </Button>
    </Stack>
  );
};

export default Buttons;
