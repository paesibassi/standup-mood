import React, { FC } from 'react';

type Props = {
    width: number;
    height: number;
    children: React.ReactNode;
};

const VisContainer: FC<Props> = ({ width, height, children }: Props) => (
  <svg
    style={{ overflow: 'visible' }}
    viewBox={`0 0 ${width} ${height}`}
    width={width}
    height={height}
    className="ms-auto"
  >
    {children}
  </svg>
);

export default VisContainer;
