import React from 'react';
import Svg, { Path } from 'react-native-svg';

type HappyFaceSvgProps = {
  width: string;
  height: string;
  strokeWidth: string;
  color?: string;
};

const HappyFaceSvg = ({ width, height, strokeWidth, color = '#4B4B4B' }: HappyFaceSvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 122 123" fill="none">
      <Path
        d="M61 121.091C94.1375 121.091 121 94.2284 121 61.0908C121 27.9537 94.1375 1.09082 61 1.09082C27.8629 1.09082 1 27.9537 1 61.0908C1 94.2284 27.8629 121.091 61 121.091Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M40.2305 42.6293C38.9561 42.6293 37.9229 41.5961 37.9229 40.3216C37.9229 39.0471 38.9561 38.0139 40.2305 38.0139"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M40.2305 42.6293C41.505 42.6293 42.5382 41.5961 42.5382 40.3216C42.5382 39.0471 41.505 38.0139 40.2305 38.0139"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M81.7691 42.6293C80.4946 42.6293 79.4614 41.5961 79.4614 40.3216C79.4614 39.0471 80.4946 38.0139 81.7691 38.0139"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M81.7695 42.6293C83.044 42.6293 84.0772 41.5961 84.0772 40.3216C84.0772 39.0471 83.044 38.0139 81.7695 38.0139"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M61.0001 98.0139C78.8432 98.0139 93.3078 83.5493 93.3078 65.7062H28.6924C28.6924 83.5493 43.157 98.0139 61.0001 98.0139Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default HappyFaceSvg;
