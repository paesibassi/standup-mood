import React, { FC } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import useGlobalContext from '../context/context';

const TeamSelector: FC = () => {
  const { teams, selectedTeam, handleChangeTeam } = useGlobalContext();
  const items = teams.map((t: string) => (
    <Dropdown.Item key={t} eventKey={t} active={selectedTeam === t}>{t}</Dropdown.Item>
  ));
  const dropdownTitle = selectedTeam === null ? 'Select your team' : selectedTeam;
  return (
    <DropdownButton id="dropdown-team" title={dropdownTitle} onSelect={(ek, e) => handleChangeTeam?.(ek, e)}>
      {items}
      <Dropdown.Divider />
      <Dropdown.Item eventKey="New" disabled>Create New</Dropdown.Item>
    </DropdownButton>
  );
};

export default TeamSelector;
