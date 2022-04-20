import React, { FC } from 'react';
import Button from 'react-bootstrap/Button';
import useGlobalContext from '../context/context';

const SubmitButton: FC = () => {
  const submittable = ['Select Members', 'Stop'];
  const { startButtonState, handleSubmit } = useGlobalContext();

  return (
    <Button className="col-3" disabled={startButtonState ? submittable.includes(startButtonState) : false} onClick={() => handleSubmit?.()}>
      Submit moods
    </Button>
  );
};

export default SubmitButton;
