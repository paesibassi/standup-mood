import React from 'react';
import Stack from 'react-bootstrap/Stack';
import StartButton from './startbutton';
import NextButton from './nextbutton';
import SubmitButton from './submitbutton';

type Props = {
  startButtonState: string;
  handleStartStop: () => void;
  disabledNext: boolean;
  handleNext: () => void;
  handleSubmit: () => void;
};

function Buttons({
  startButtonState, handleStartStop, disabledNext, handleNext, handleSubmit,
}: Props): JSX.Element {
  return (
    <Stack direction="horizontal" gap={2} className="col-8 mx-auto mt-3">
      <StartButton startButtonState={startButtonState} startStop={handleStartStop} />
      <NextButton disabledNext={disabledNext} next={handleNext} />
      <SubmitButton startButtonState={startButtonState} handleSubmit={handleSubmit} />
    </Stack>
  );
}

export default Buttons;
