import React, { FC } from 'react';
import Button from 'react-bootstrap/Button';

type Props = {
  startButtonState: string;
  handleSubmit: () => void;
};

const SubmitButton: FC<Props> = ({ startButtonState, handleSubmit }) => {
  const submittable = ['Select Members', 'Stop'];
  return (
    <Button className="col-3" disabled={submittable.includes(startButtonState)} onClick={() => handleSubmit()}>
      Submit moods
    </Button>
  );
};

export default SubmitButton;
