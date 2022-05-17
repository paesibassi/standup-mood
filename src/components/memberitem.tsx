import React, { FC } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Progress from './progress';
import MemberScore from './memberscore';
import MemberDetails from './memberdetails';
import { DateValue } from './visualization/sparkline';

type Props = {
  memberName: string;
  index: number;
  activeMember: boolean;
  memberIdx: number;
  memberHistory?: DateValue[];
  elapsedPercent?: number;
  barColor?: string;
};

const MemberItem: FC<Props> = ({
    memberName, index, activeMember, memberIdx, elapsedPercent, barColor, memberHistory,
  }) => (
    <ListGroup.Item
      as="li"
      className="d-flex gap-2 animate__animated animate__fadeInUp"
      action
      active={index === memberIdx}
      variant={activeMember !== true ? 'secondary' : 'false'}
    >
      <MemberDetails
        memberName={memberName}
        index={index}
        activeMember={activeMember}
        memberHistory={memberHistory}
      />
      <Progress
        elapsedPercent={elapsedPercent}
        barColor={barColor}
        index={index}
      />
      <MemberScore index={index} />
    </ListGroup.Item>
  );

export default MemberItem;
