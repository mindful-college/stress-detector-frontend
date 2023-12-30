import React from 'react';
import Svg, { Path } from 'react-native-svg';

type SmileyFaceSvgProps = {
  width: string;
  height: string;
  strokeWidth: string;
  color?: string;
};

const SmileyFaceSvg = ({ width, height, strokeWidth, color = '#4B4B4B' }: SmileyFaceSvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 122 122" fill="none">
      <Path
        d="M61 121C94.1375 121 121 94.1375 121 61C121 27.8629 94.1375 1 61 1C27.8629 1 1 27.8629 1 61C1 94.1375 27.8629 121 61 121Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M30.5381 70.2307C35.1535 86.8461 53.615 96.9999 70.2304 92.3846C80.3842 88.6922 88.6919 80.3846 91.4616 70.2307"
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
        d="M40.231 47.154C41.5054 47.154 42.5386 46.1208 42.5386 44.8463C42.5386 43.5718 41.5054 42.5386 40.231 42.5386"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M81.7691 47.154C80.4946 47.154 79.4614 46.1208 79.4614 44.8463C79.4614 43.5718 80.4946 42.5386 81.7691 42.5386"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M81.769 47.154C83.0435 47.154 84.0767 46.1208 84.0767 44.8463C84.0767 43.5718 83.0435 42.5386 81.769 42.5386"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SmileyFaceSvg;
