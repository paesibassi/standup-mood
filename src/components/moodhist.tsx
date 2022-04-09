import * as React from "react";
import { range } from 'd3';
import { DateTime } from 'luxon';
import Sparkline from './visualization/sparkline';
import { DateValue } from './visualization/types';

// can be removed when api is implemented
const genData = (): DateValue[] => {
    const data: DateValue[] = range(20, 1, -1).map((n) => {
        const date = DateTime.now().minus({ days: n }).toISODate();
        const value = Math.ceil(Math.random() * 10) / 2;

        return { date, value };
    });

    return data;
};

const MoodHistory = ({ memberName }: { memberName: string }) => {
    const [data, setData] = React.useState<DateValue[]>([]);

    // replace with something implemented from backend.
    const minDate = DateTime.now().minus({ days: 20 }).toISODate();

    React.useEffect(() => {
        // when endpoint is fixed.
        //  fetch(url).then(r => r.json()).then(d => setData(d));
        setData(genData());
    }, []);

    if (data === null || data === undefined) return null;

    return (
      <Sparkline minDate={minDate} width={70} height={20} data={data} />
    );
};

export default MoodHistory;
