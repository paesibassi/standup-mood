import React, { FC } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import useGlobalContext from '../context/context';
import MemberItem from './memberitem';
import SummaryItem from './summaryitem';

const MemberList: FC = () => {
  const {
    members, activeMembers, memberIdx, elapsedPercents, barColors, memberHistory,
  } = useGlobalContext();
  const ml = members.map((memberName, i) => (
    <MemberItem
      key={memberName}
      memberName={memberName}
      index={i}
      activeMember={activeMembers[i]}
      memberIdx={memberIdx}
      elapsedPercent={elapsedPercents?.[i]}
      barColor={barColors?.[i]}
      memberHistory={memberHistory?.[i]}
    />
  ));
  return (
    <ListGroup>
      <SummaryItem key="summary" />
      {ml}
    </ListGroup>
  );
};

export default MemberList;
