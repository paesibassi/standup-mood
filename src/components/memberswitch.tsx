import React, { FC } from 'react';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import useGlobalContext from '../context/context';
import MoodHistory from './moodhist';
import { DateValue } from './visualization/sparkline';

type Props = {
  memberName: string;
  activeMember: boolean;
  index: number;
  memberHistory?: DateValue[];
};

const MemberSwitch: FC<Props> = ({
 memberName, activeMember, index, memberHistory,
}: Props) => {
  const { handleSwitch } = useGlobalContext();
  return (
    <Stack
      direction="horizontal"
      className="w-25 justify-content-between"
      style={{ width: '30%' }}
      gap={1}
      onClick={() => handleSwitch?.(index)}
    >
      <Form>
        <Form.Check
          type="switch"
          readOnly
          id={`${memberName}-switch`}
          aria-label={`${memberName}-switch`}
          checked={activeMember}
        />
      </Form>
      <div className="flex-grow-1">{memberName}</div>
      <div className="d-none d-lg-block">
        <MoodHistory memberHistory={memberHistory} />
      </div>
    </Stack>
  );
};

export default MemberSwitch;
