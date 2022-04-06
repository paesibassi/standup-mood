import React, { FC } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

type Props = {
  teams: string[];
  selectedTeam: string;
  handleChangeTeam: (eventKey: string | null, event: React.SyntheticEvent<unknown, Event>) => void;
};

const TeamSelector: FC<Props> = ({ teams, selectedTeam, handleChangeTeam }) => {
  const items = teams.map((t: string) => (
    <Dropdown.Item key={t} eventKey={t} active={selectedTeam === t}>{t}</Dropdown.Item>
  ));
  return (
    <DropdownButton id="dropdown-team" title={selectedTeam} onSelect={handleChangeTeam}>
      {items}
      <Dropdown.Divider />
      <Dropdown.Item eventKey="New" disabled>Create New</Dropdown.Item>
    </DropdownButton>
  );
};

export default TeamSelector;
