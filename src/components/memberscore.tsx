import React from 'react';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

type Props = {
  memberScore: number;
  index: number;
  handleChangeMood: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
};

function MemberScore({ memberScore, index, handleChangeMood }: Props): JSX.Element {
  return (
    <Stack direction="horizontal" gap={3}>
      <Form.Range
        min="1"
        max="5"
        step="0.5"
        value={memberScore}
        onChange={(e) => handleChangeMood(index, e)}
      />
      {memberScore}
    </Stack>
  );
}

export default MemberScore;
