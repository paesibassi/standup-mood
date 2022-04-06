import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import MemberItem from './memberitem';
import SummaryItem from './summaryitem';

type Props = {
  members: string[];
  activeMembers: boolean[];
  memberScores: number[];
  memberIdx: number;
  elapsedSecs: number[];
  individualTime: number;
  elapsedPercents: number[];
  barColors: string[];
  averageMood: number;
  teams: string[];
  selectedTeam: string;
  handleChangeTeam: (eventKey: string | null, event: React.SyntheticEvent<unknown, Event>) => void;
  handleSwitch: (index: number) => void;
  handleChangeMood: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectMember: (index: number) => void;
};

function MemberList({
  members, activeMembers, memberScores, memberIdx, elapsedSecs, individualTime,
  averageMood, elapsedPercents, barColors, teams, selectedTeam,
  handleChangeTeam, handleSwitch, handleSelectMember, handleChangeMood,
}: Props): JSX.Element {
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
        teams={teams}
        selectedTeam={selectedTeam}
        handleChangeTeam={handleChangeTeam}
      />
      {ml}
    </ListGroup>
  );
}

export default MemberList;
