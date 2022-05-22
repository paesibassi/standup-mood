import React, { FC } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';
import useGlobalContext from '../context/context';
import CurrentSpeaker from './currentspeaker';
import MoodHistory from './moodhist';
import TeamSelector from './teamselector';

const SummaryItem: FC = () => {
  const {
    members, memberIdx, elapsedSecs, individualTime, averageMood, selectedTeam, teamHistory,
  } = useGlobalContext();
  if (members.length === 0) {
    return (
      <ListGroup.Item as="li" className="d-flex">
        <TeamSelector />
        { (selectedTeam === null) && (
        <h4 className="mx-auto text-primary animate__animated animate__bounceInRight animate__delay-2s">
          &larr; select your team using the dropdown
        </h4>
        )}
      </ListGroup.Item>
    );
  }
  return (
    <ListGroup.Item as="li" className="d-flex gap-2 justify-content-between">
      <Stack
        direction="horizontal"
        className="justify-content-between"
        style={{ width: '23%' }}
        gap={1}
      >
        <TeamSelector />
        <div className="d-none d-lg-flex">
          <MoodHistory moodHistory={teamHistory} width={133} height={50} />
        </div>
      </Stack>
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
