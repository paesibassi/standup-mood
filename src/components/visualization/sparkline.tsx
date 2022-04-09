import { DateValue, SparklineProps } from './types';
import VisContainer from './viscontainer';
import './sparkline.css';
import * as React from "react";
import { curveBasis, curveLinear, interpolateCividis, interpolateCool, interpolateInferno, interpolatePuBuGn, interpolateRdYlGn, interpolateYlGnBu, line, range, scaleLinear, scaleTime, schemeBlues, schemeBrBG, schemeSpectral, schemeYlGnBu } from 'd3';
import { DateTime } from 'luxon';

const Sparkline = ({ width, height, data, minDate }: SparklineProps) => {
    const yPadding = 0.1;
    const xPadding = 0.05;

    const timeScale = scaleTime()
            .domain([new Date(minDate), new Date()])
            .range([xPadding * width, width * (1 - xPadding)])
            .clamp(true);

    const yScale = scaleLinear()
        .domain([1, 5])
        .range([height * (1 - yPadding), yPadding * height])
        .clamp(true);

    const pathContext = React.useMemo(() => {
    
        return line<DateValue>()
            .curve(curveBasis)
            .x(d => timeScale(new Date(d.date)))
            .y(d => yScale(d.value));

    }, [data, minDate]);

    if (!data || data.length === 0) return null;

    const lastDataPoint = data[data.length - 1];

    return (
        <VisContainer width={width} height={height}>
            <defs>
                <linearGradient id="tg" x1="0%" x2="0%" y1="100%" y2="0%" gradientUnits="userSpaceOnUse" >
                    {range(10).map((i) => (
                        <stop offset={`${(i / 10) * 100}%`} stop-color={interpolateCool(i / 14)} />
                    ))}
                </linearGradient>
            </defs>
            <g>
                <rect className="sparkline-bg" />
                <path className="sparkline-line" d={(data && pathContext(data)) || ""} stroke="url(#tg)" />
                <circle 
                    className='sparkline-point'
                    cx={timeScale(new Date(lastDataPoint.date))} 
                    cy={yScale(lastDataPoint.value)}
                    fill={"url(#tg)"}
                />
            </g>
        </VisContainer>
    );
};

export default Sparkline;
