import React from 'react';
import Button from 'react-bootstrap/Button';

type Props = {
  startButtonState: string;
  startStop: () => void;
};

function StartButton({ startButtonState, startStop }: Props): JSX.Element {
  return (
    <Button className="col-4" disabled={startButtonState === 'Select Members'} onClick={() => startStop()}>
      {startButtonState}
    </Button>
  );
}

export default StartButton;
