import React, { FC } from 'react';
import Sparkline, { DateValue } from './visualization/sparkline';

type Props = {
    memberHistory?: DateValue[];
};

const MoodHistory: FC<Props> = ({ memberHistory }: Props) => {
  // TODO replace with something implemented from backend.
    const historyLength = 90;
    const minDate = new Date(new Date().setDate(new Date().getDate() - historyLength))
      .toISOString()
      .substring(0, 10);

    if (memberHistory === undefined) return <div className="border" style={{ width: 80, height: 30 }}>---</div>;

    return (
      <Sparkline minDate={minDate} width={80} height={30} data={memberHistory} />
    );
};

export default MoodHistory;
