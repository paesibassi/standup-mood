import React from 'react';
import PropTypes from 'prop-types';
import ListGroup from 'react-bootstrap/ListGroup';
import MemberItem from './memberitem';
import SummaryItem from './summaryitem';

function MemberList({
  members, activeMembers, memberScores, memberIdx, elapsedSecs, individualTime,
  averageMood, elapsedPercents, barColors,
  handleSwitch, handleSelectMember, handleChangeMood,
}) {
  const ml = members.map((memberName, i) => (
    <MemberItem
      key={memberName}
      memberName={memberName}
      index={i}
      activeMember={activeMembers[i]}
      memberScore={memberScores[i]}
      memberIdx={memberIdx}
      elapsedPercent={elapsedPercents[i]}
      barColor={barColors[i]}
      handleSwitch={handleSwitch}
      handleSelectMember={handleSelectMember}
      handleChangeMood={handleChangeMood}
    />
  ));
  return (
    <ListGroup>
      <SummaryItem
        key="summary"
        averageMood={averageMood}
        members={members}
        memberIdx={memberIdx}
        elapsedSecs={elapsedSecs}
        individualTime={individualTime}
      />
      {ml}
    </ListGroup>
  );
}

MemberList.propTypes = {
  members: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeMembers: PropTypes.arrayOf(PropTypes.bool).isRequired,
  memberScores: PropTypes.arrayOf(PropTypes.number).isRequired,
  memberIdx: PropTypes.number.isRequired,
  elapsedSecs: PropTypes.arrayOf(PropTypes.number).isRequired,
  individualTime: PropTypes.number.isRequired,
  averageMood: PropTypes.number.isRequired,
  elapsedPercents: PropTypes.arrayOf(PropTypes.number).isRequired,
  barColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSwitch: PropTypes.func.isRequired,
  handleChangeMood: PropTypes.func.isRequired,
  handleSelectMember: PropTypes.func.isRequired,
};

export default MemberList;
