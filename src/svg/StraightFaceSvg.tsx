import React from 'react';
import Svg, { Path } from 'react-native-svg';

type StraightFaceSvgProps = {
  width: string;
  height: string;
  strokeWidth: string;
  color?: string;
};

const StraightFaceSvg = ({
  width,
  height,
  strokeWidth,
  color = '#4B4B4B',
}: StraightFaceSvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 122 122" fill="none">
      <Path
        d="M37.9229 84.0769H84.0767"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M61 121C94.1375 121 121 94.1375 121 61C121 27.8629 94.1375 1 61 1C27.8629 1 1 27.8629 1 61C1 94.1375 27.8629 121 61 121Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M40.2305 47.154C38.9561 47.154 37.9229 46.1208 37.9229 44.8463C37.9229 43.5718 38.9561 42.5386 40.2305 42.5386"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M40.2305 47.154C41.505 47.154 42.5382 46.1208 42.5382 44.8463C42.5382 43.5718 41.505 42.5386 40.2305 42.5386"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M81.7696 47.154C80.4951 47.154 79.4619 46.1208 79.4619 44.8463C79.4619 43.5718 80.4951 42.5386 81.7696 42.5386"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M81.7695 47.154C83.044 47.154 84.0772 46.1208 84.0772 44.8463C84.0772 43.5718 83.044 42.5386 81.7695 42.5386"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default StraightFaceSvg;
