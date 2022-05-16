import React, { FC, useMemo } from 'react';
import {
 curveBasis, interpolateCool, line, mean, range, scaleLinear, scaleTime,
} from 'd3';
import './sparkline.css';

export interface DateValue {
    date: string;
    value: number;
}

type Props = {
    width: number;
    height: number;
    data: DateValue[];
    minDate: string;
};

const Sparkline: FC<Props> = ({
 width, height, data, minDate,
}: Props) => {
    const yPadding = 0.1;
    const xPadding = 0.05;

    const timeScale = scaleTime()
        .domain([new Date(minDate), new Date()])
        .range([width * xPadding, width * (1 - xPadding)])
        .clamp(true);

    const yScale = scaleLinear()
        .domain([1, 5])
        .range([height * (1 - yPadding), yPadding * height])
        .clamp(true);

    const pathContext = useMemo(
        () => line<DateValue>()
            .curve(curveBasis)
            .x((d) => timeScale(new Date(d.date)))
            .y((d) => yScale(d.value)),
        [timeScale, yScale],
    );

    if (!data || data.length === 0) return null;

    const avgMood = mean(data.map((d) => d.value)) as number;
    const lastDataPoint = data[data.length - 1];
    const avgSignDiffers = Math.abs(avgMood - 3) > 0.5;

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
      >
        <defs>
          <linearGradient id="gradient" x1="0%" x2="0%" y1="100%" y2="0%" gradientUnits="userSpaceOnUse">
            {range(10).map((i) => (
              <stop
                key={i}
                offset={`${(i / 10) * 100}%`}
                stopColor={interpolateCool(i / 14)}
              />
            ))}
          </linearGradient>
        </defs>
        <g>
          <rect className="sparkline-bg" />
          <line 
            x1={timeScale.range()[0]} 
            x2={timeScale.range()[1]} 
            y1={yScale(3)} 
            y2={yScale(3)} 
            className="sparkline-mid-line"
          />
          { avgSignDiffers && <line 
            x1={timeScale.range()[0]} 
            x2={timeScale.range()[1]} 
            y1={yScale(avgMood)} 
            y2={yScale(avgMood)} 
            className="sparkline-avg-line"
          />}
          <path
            className="sparkline-line"
            d={(data && pathContext(data)) || ''}
            stroke="url(#gradient)"
          />
          <circle
            className="sparkline-point"
            cx={timeScale(new Date(lastDataPoint.date))}
            cy={yScale(lastDataPoint.value)}
            fill="url(#gradient)"
          />
        </g>
      </svg>
    );
};

export default Sparkline;
