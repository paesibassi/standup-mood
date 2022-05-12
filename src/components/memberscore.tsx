import React, { FC } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import useGlobalContext from '../context/context';

type Props = {
  index: number;
};

const moodChangeStep = 0.5;

const MemberScore: FC<Props> = ({ index }) => {
  const { memberScores, handleChangeMood } = useGlobalContext();
  const score = memberScores[index];

  return (
    <Stack direction="horizontal" className="d-flex justify-content-end" gap={1}>
      <Form.Control
        style={{ width: '50px' }}
        className="p-0 border-0 text-center"
        as="input"
        type="text"
        value={score}
        onChange={(e) => handleChangeMood?.(index, parseFloat(e.target.value))}
      />
      <ButtonGroup size="sm">
        <Button
          variant="secondary"
          onClick={() => handleChangeMood?.(index, score - moodChangeStep)}
        >
          &#9660;
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleChangeMood?.(index, score + moodChangeStep)}
        >
          &#9650;
        </Button>
      </ButtonGroup>
    </Stack>
  );
};

export default MemberScore;
