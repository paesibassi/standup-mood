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
  moodHistory?: DateValue[];
};

const MemberDetails: FC<Props> = ({
 memberName, activeMember, index, moodHistory,
}: Props) => {
  const { handleSwitch } = useGlobalContext();
  return (
    <Stack
      direction="horizontal"
      className="justify-content-between"
      style={{ width: '35%' }}
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
      <div className="d-none d-lg-flex">
        <MoodHistory moodHistory={moodHistory} />
      </div>
    </Stack>
  );
};

export default MemberDetails;
