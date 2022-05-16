import React, { FC } from 'react';
import Sparkline, { DateValue } from './visualization/sparkline';
import { range } from "d3";

type Props = {
    memberHistory?: DateValue[];
};

// can be removed when api is implemented
const genData = (): DateValue[] => {
  const data: DateValue[] = range(20, 1, -1).map((n) => {
      const date = new Date(new Date().setDate(new Date().getDate() - n))
      .toISOString()
      .substring(0, 10);
      const value = Math.max(Math.ceil(Math.random() * 10) / 2 - 1.5, 1);

      return { date, value };
  });

  return data;
};


const MoodHistory: FC<Props> = ({ memberHistory }: Props) => {
  // TODO replace with something implemented from backend.
    const historyLength = 30;
    const minDate = new Date(new Date().setDate(new Date().getDate() - historyLength))
      .toISOString()
      .substring(0, 10);

    // if (memberHistory === undefined) {
    //   return (
    //     <div className="border rounded text-center" style={{ width: 80, height: 30 }}>
    //       &#8211;&and;&#8212;&or;&#8211;
    //     </div>
    //   );
    // }
    return (
      <Sparkline minDate={minDate} width={80} height={30} data={genData()} />
    );
};

export default MoodHistory;
