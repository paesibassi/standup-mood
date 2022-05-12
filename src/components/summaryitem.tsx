import React, { FC } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import useGlobalContext from '../context/context';
import CurrentSpeaker from './currentspeaker';
import TeamSelector from './teamselector';

const SummaryItem: FC = () => {
  const {
    members, memberIdx, elapsedSecs, individualTime, averageMood,
  } = useGlobalContext();
  return (
    <ListGroup.Item as="li" className="d-flex justify-content-between">
      <TeamSelector />
      <CurrentSpeaker
        members={members}
        memberIdx={memberIdx}
        elapsedSecs={elapsedSecs}
        individualTime={individualTime}
      />
      <p className="h6 mt-1 text-center">
        {`avg score: ${averageMood?.toFixed(2)}`}
      </p>
    </ListGroup.Item>
  );
};

export default SummaryItem;
