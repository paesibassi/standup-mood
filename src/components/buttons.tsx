import React from 'react';
import Stack from 'react-bootstrap/Stack';
import StartButton from './startbutton';
import NextButton from './nextbutton';

type Props = {
  startButtonState: string;
  handleStartStop: () => void;
  disabledNext: boolean;
  handleNext: () => void;
};

function Buttons({
  startButtonState, handleStartStop, disabledNext, handleNext,
}: Props): JSX.Element {
  return (
    <Stack direction="horizontal" gap={3} className="col-6 mx-auto mt-3">
      <StartButton startButtonState={startButtonState} startStop={handleStartStop} />
      <NextButton disabledNext={disabledNext} next={handleNext} />
    </Stack>
  );
}

export default Buttons;
