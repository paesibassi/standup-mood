import React, { FC } from 'react';
import Sparkline, { DateValue } from './visualization/sparkline';

type Props = {
  memberHistory?: DateValue[];
};

const MoodHistory: FC<Props> = ({ memberHistory }: Props) => {
  // TODO replace with something implemented from backend.
  const historyLength = 30;
  const minDate = new Date(new Date().setDate(new Date().getDate() - historyLength))
    .toISOString()
    .substring(0, 10);

  if (memberHistory === undefined) {
    return (
      <div className="border rounded text-center" style={{ width: 80, height: 30 }}>
        &#8211;&and;&#8212;&or;&#8211;
      </div>
    );
  }
  return (
    <Sparkline minDate={minDate} width={80} height={30} data={memberHistory} />
  );
};

export default MoodHistory;
