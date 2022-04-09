import React, { FC } from 'react';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import useGlobalContext from '../context/context';

type Props = {
  index: number;
};

const MemberScore: FC<Props> = ({ index }) => {
  const { memberScores, handleChangeMood } = useGlobalContext();

  return (
    <Stack direction="horizontal" gap={3}>
      <Form.Range
        min="1"
        max="5"
        step="0.5"
        value={memberScores[index]}
        onChange={(e) => handleChangeMood?.(index, e)}
      />
      {memberScores[index]}
    </Stack>
  );
};

export default MemberScore;
