import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

function MemberSwitch({ memberName, activeMember }) {
  return (
    <Stack direction="horizontal" gap={2}>
      <Form>
        <Form.Check
          type="switch"
          readOnly
          id={`${memberName}-switch`}
          aria-label={`${memberName}-switch`}
          checked={activeMember}
        />
      </Form>
      <div>{memberName}</div>
    </Stack>
  );
}

MemberSwitch.propTypes = {
  memberName: PropTypes.string.isRequired,
  activeMember: PropTypes.bool.isRequired,
};

export default MemberSwitch;
