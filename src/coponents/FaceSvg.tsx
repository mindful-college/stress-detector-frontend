import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';

import HappyFaceSvg from '../svg/HappyFaceSvg';
import SadComponentSvg from '../svg/SadFaceSvg';
import SmileyFaceSvg from '../svg/SmileyFaceSvg';
import StraightFaceSvg from '../svg/StraightFaceSvg';
import ThrowUpFaceSvg from '../svg/ThrowUpFaceSvg';

type FaceSvgProps = {
  stressLevel: number;
};

const FaceSvg: React.FC<FaceSvgProps> = ({ stressLevel }) => {
  //
  const stressLevelMap = {
    1: 'Very Low',
    2: 'Low',
    3: 'Moderate',
    4: 'High',
    5: 'Very High',
  };

  const [stressLevelWord, setStressLevelWord] = useState('');
  //
  useEffect(() => {
    setStressLevelWord(stressLevelMap[stressLevel]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stressLevel]);

  const handleFaceSVG = (level: number) => {
    switch (level) {
      case 1:
        return <HappyFaceSvg width="100" height="100" strokeWidth="2" color="#000000" />;
      case 2:
        return <SmileyFaceSvg width="100" height="100" strokeWidth="2" color="#000000" />;
      case 3:
        return <StraightFaceSvg width="100" height="100" strokeWidth="2" color="#000000" />;
      case 4:
        return <SadComponentSvg width="100" height="100" strokeWidth="2" color="#000000" />;
      case 5:
        return <ThrowUpFaceSvg width="100" height="100" strokeWidth="2" color="#000000" />;
      default:
        return null;
    }
  };

  return (
    <>
      <View>{handleFaceSVG(stressLevel)}</View>
      <View>{stressLevelWord && <Text>Stress Level is {stressLevelWord}</Text>}</View>
    </>
  );
};

export default FaceSvg;
