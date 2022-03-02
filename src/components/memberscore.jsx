import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

function MemberScore({ memberScore, index, handleChangeMood }) {
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

MemberScore.propTypes = {
  memberScore: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  handleChangeMood: PropTypes.func.isRequired,
};

export default MemberScore;
