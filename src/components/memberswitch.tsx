import React from 'react';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

type Props = {
  memberName: string;
  activeMember: boolean;
};

function MemberSwitch({ memberName, activeMember }: Props): JSX.Element {
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

export default MemberSwitch;
