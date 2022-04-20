import React, { FC } from 'react';
import Button from 'react-bootstrap/Button';
import useGlobalContext from '../context/context';

const NextButton: FC = () => {
  const { disabledNext, handleNext } = useGlobalContext();
  return (
    <Button className="col-4 mx-auto" disabled={disabledNext} onClick={() => handleNext?.()}>
      Next
    </Button>
  );
};

export default NextButton;
