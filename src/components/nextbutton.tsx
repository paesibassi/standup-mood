import React from 'react';
import Button from 'react-bootstrap/Button';

type Props = {
  disabledNext: boolean;
  next: () => void;
};

function NextButton({ disabledNext, next }: Props): JSX.Element {
  return (
    <Button className="col-4 mx-auto" disabled={disabledNext} onClick={() => next()}>
      Next
    </Button>
  );
}

export default NextButton;
