import React, { FC } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import useGlobalContext from '../context/context';
import CurrentSpeaker from './currentspeaker';
import TeamSelector from './teamselector';

const SummaryItem: FC = () => {
  const {
    members, memberIdx, elapsedSecs, individualTime, averageMood, selectedTeam,
  } = useGlobalContext();
  if (selectedTeam === null) {
    return (
      <ListGroup.Item as="li" className="d-flex">
        <TeamSelector />
        <h4 className="mx-auto text-primary animate__animated animate__bounceInRight animate__delay-2s">
          &larr; select your team using the dropdown
        </h4>
      </ListGroup.Item>
    );
  }
  return (
    <ListGroup.Item as="li" className="d-flex justify-content-between">
      <TeamSelector />
      <CurrentSpeaker
        members={members}
        memberIdx={memberIdx}
        elapsedSecs={elapsedSecs}
        individualTime={individualTime}
      />
      <p className="h6 my-auto text-center">
        {`avg score: ${averageMood?.toFixed(2)}`}
      </p>
    </ListGroup.Item>
  );
};

export default SummaryItem;
