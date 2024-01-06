import React from 'react';
import Svg, { Path } from 'react-native-svg';

type ThrowUpFaceSvgProps = {
  width: string;
  height: string;
  strokeWidth: string;
  color?: string;
};

const ThrowUpFaceSvg = ({ width, height, strokeWidth, color = '#4B4B4B' }: ThrowUpFaceSvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 122 122" fill="none">
      <Path
        d="M7.75886 88.6923C3.44094 80.4076 1 70.9889 1 61C1 27.8629 27.8629 1 61 1C94.1375 1 121 27.8629 121 61C121 70.9889 118.559 80.4076 114.241 88.6923"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M32.8325 90.4749C30.7576 69.2785 51.5098 65.6155 60.9997 65.6155C70.4897 65.6155 91.2416 69.2785 89.1665 90.4749C88.9819 92.3653 87.319 93.7278 85.4201 93.7278H78.5843C78.6345 106.529 97.9228 103.883 97.9228 111.368C97.9228 111.368 96.3324 121 60.9997 121C25.6671 121 24.0767 111.368 24.0767 111.368C24.0767 103.883 43.365 106.529 43.4152 93.7278H36.5794C34.6805 93.7278 33.0175 92.3653 32.8325 90.4749Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M84.077 33.3076L74.8462 47.1538H93.3077"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M37.9232 33.3076L47.1539 47.1538H28.6924"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ThrowUpFaceSvg;
