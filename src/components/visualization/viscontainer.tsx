import { VisContainerProps } from './types';
import * as React from "react";

const VisContainer = ({ width, height, children }: VisContainerProps) => {
  return (
    <svg style={{ overflow: 'visible' }} viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
        {children}
    </svg>
  );
};

export default VisContainer;
