import React, { FC } from 'react';
import Stack from 'react-bootstrap/Stack';
import StartButton from './startbutton';
import NextButton from './nextbutton';
import SubmitButton from './submitbutton';

const Buttons: FC = () => (
  <Stack direction="horizontal" gap={2} className="col-8 mx-auto mt-3">
    <StartButton />
    <NextButton />
    <SubmitButton />
  </Stack>
);

export default Buttons;
