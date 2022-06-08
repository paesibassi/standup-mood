import React, { FC } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import useGlobalContext from '../context/context';
import MemberItem from './memberitem';
import SummaryItem from './summaryitem';

const MemberList: FC = () => {
  const {
    members, activeMembers, memberIdx, elapsedPercents, barColors, moodHistory,
  } = useGlobalContext();
  const memberItems = members.map((memberName, i) => (
    <MemberItem
      key={memberName}
      memberName={memberName}
      index={i}
      activeMember={activeMembers[i]}
      memberIdx={memberIdx}
      elapsedPercent={elapsedPercents?.[i]}
      barColor={barColors?.[i]}
      moodHistory={moodHistory?.[i]}
    />
  ));
  return (
    <ListGroup>
      <SummaryItem key="summary" />
      {memberItems.length > 0 ? memberItems : null}
    </ListGroup>
  );
};

export default MemberList;
