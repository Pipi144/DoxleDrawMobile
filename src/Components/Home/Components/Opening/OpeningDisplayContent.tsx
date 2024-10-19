//# TODO: CONTENT NOT COMPLETED

import {ReactElement} from 'react';
import {OpeningItem} from '../../../../Models/DrawModels/Openings';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {Path, Polygon, Rect} from 'react-native-svg';

type Props = {
  item: OpeningItem;
  isSelected?: boolean;
};

export const OpeningDisplayContent = ({item, isSelected}: Props) => {
  const {theme, THEME_COLOR} = useDOXLETheme();
  const isDarkTheme = theme === 'dark';
  const backgroundColor = THEME_COLOR.primaryBackgroundColor;
  const fillColor = isDarkTheme ? 'black' : 'white';
  const strokeColor = isSelected ? '#5252FF' : isDarkTheme ? 'white' : 'black';
  const gradientStops: (string | number)[] = [
    // 0, lineColor, 0.05, lineColor,
    0.05,
    fillColor,
    0.25,
    fillColor,
    0.25,
    strokeColor,
    0.3,
    strokeColor,
    0.3,
    fillColor,
    0.5,
    fillColor,
    0.5,
    strokeColor,
    0.55,
    strokeColor,
    0.55,
    '#E3E8FF',
    0.95,
    '#E3E8FF',
    // 0.95, lineColor, 1, lineColor,
  ];
  const border = 30;
  const leaves: ReactElement[] = [];
  if (item.type === 'RobeDoors') {
    for (let i = 0; i < item.leafs; i++) {
      leaves.push(
        <Rect
          key={`leaf-${i}`}
          x={(item.xWidth / item.leafs) * i - (i !== 0 ? 20 : 0)}
          y={35 * (i % 2) + (item.yDepth - 70) / 2}
          strokeWidth={5}
          fill={fillColor}
          stroke={strokeColor}
          width={item.xWidth / item.leafs + 20}
          height={35}
        />,
      );
    }
  } else if (item.type === 'MultiLeafDoor') {
    const leafDegrees = 5;
    const leafCos = Math.cos((90 - leafDegrees) / (180 / Math.PI));
    const leafSin = Math.sin((90 - leafDegrees) / (180 / Math.PI));
    const leafWidth = item.xWidth / item.leafs;
    const leafThickness = 35;

    for (let i = 0; i < item.leafs; i++) {
      leaves.push(
        <Rect
          key={`leaf-${i}`}
          x={i * (leafCos * leafWidth * 2) + (i % 2) * leafSin * leafThickness}
          y={(i % 2 ? leafCos * leafThickness : 0) + item.yDepth}
          strokeWidth={5}
          fill={fillColor}
          stroke={strokeColor}
          width={leafWidth}
          height={leafThickness}
          rotation={-90 + (i % 2 ? -leafDegrees : leafDegrees)}
        />,
      );
    }
  }
  const createArcPath = (
    radius: number,
    angle: number,
    xOffset: number = 0,
  ): string => {
    const startX = radius + xOffset;
    const startY = 0;
    const endX = radius * Math.cos((angle * Math.PI) / 180) + xOffset;
    const endY = radius * Math.sin((angle * Math.PI) / 180);
    return `M ${startX},${startY} A ${radius},${radius} 0 0,1 ${endX},${endY}`;
  };
  return (
    <>
      {(item.type === 'Window' || item.type === 'SlidingDoor') && (
        <>
          <Rect
            // fillLinearGradientStartPointY={item.yDepth + 50}
            // fillLinearGradientColorStops={gradientStops}
            width={item.xWidth}
            height={item.yDepth + 50}
            strokeWidth={10}
            stroke={strokeColor}
          />
          <Rect
            y={item.yDepth * 0.4}
            strokeWidth={8}
            fill={fillColor}
            stroke={strokeColor}
            width={30}
            height={item.yDepth * 0.6 + 50}
          />
          <Rect
            x={item.xWidth - 30}
            y={item.yDepth * 0.4}
            strokeWidth={8}
            fill={fillColor}
            stroke={strokeColor}
            width={30}
            height={item.yDepth * 0.6 + 50}
          />
        </>
      )}
      {item.type === 'SwingingDoor' && (
        <>
          <Path
            d={createArcPath(item.xWidth, 90)}
            y={item.yDepth}
            fill={'#E3E8FF'}
            strokeWidth={5}
            stroke={strokeColor}
          />
          <Rect
            fill={backgroundColor}
            width={item.xWidth}
            height={item.yDepth}
          />
          <Rect
            strokeWidth={5}
            fill={fillColor}
            stroke={strokeColor}
            width={-30}
            height={item.yDepth}
          />
          <Rect
            strokeWidth={5}
            fill={fillColor}
            stroke={strokeColor}
            width={-30}
            height={item.yDepth}
          />
          <Rect
            y={item.yDepth}
            strokeWidth={5}
            fill={fillColor}
            stroke={strokeColor}
            width={35}
            height={item.xWidth}
          />
          <Rect
            x={item.xWidth}
            strokeWidth={5}
            fill={fillColor}
            stroke={strokeColor}
            width={30}
            height={item.yDepth}
          />
        </>
      )}

      {item.type === 'CavitySlider' && (
        <>
          <Rect
            x={-30}
            strokeWidth={5}
            fill={fillColor}
            stroke={strokeColor}
            width={30}
            height={item.yDepth}
          />
          <Rect
            x={item.xWidth}
            strokeWidth={5}
            strokeDasharray={[50, 30]}
            stroke={strokeColor}
            fill={'#E3E8FF'}
            width={item.xWidth}
            height={item.yDepth}
          />
          <Rect
            fill={backgroundColor}
            width={item.xWidth}
            height={item.yDepth}
          />
          <Rect
            x={item.xWidth / 2}
            y={(item.yDepth - 35) / 2}
            strokeWidth={5}
            fill={fillColor}
            stroke={strokeColor}
            width={item.xWidth}
            height={35}
          />
          <Rect
            strokeWidth={5}
            fill={fillColor}
            stroke={strokeColor}
            width={30}
            x={item.xWidth}
            height={item.yDepth}
          />
        </>
      )}

      {item.type === 'RobeDoors' && (
        <>
          <Rect
            fill={'#E3E8FF'}
            width={+item.xWidth}
            stroke={strokeColor}
            strokeWidth={5}
            height={item.yDepth}
          />
          {leaves}
          <Rect
            x={-30}
            strokeWidth={5}
            fill={fillColor}
            stroke={strokeColor}
            width={30}
            height={item.yDepth}
          />
          <Rect
            x={item.xWidth}
            strokeWidth={5}
            fill={fillColor}
            stroke={strokeColor}
            width={30}
            height={item.yDepth}
          />
        </>
      )}

      {item.type === 'MultiLeafDoor' && (
        <>
          <Rect
            fill={'#E3E8FF'}
            width={item.xWidth}
            stroke={strokeColor}
            strokeWidth={5}
            height={item.yDepth}
          />
          {leaves}
          <Rect
            strokeWidth={5}
            fill={fillColor}
            stroke={strokeColor}
            width={-30}
            height={item.yDepth}
          />
          <Rect
            x={item.xWidth}
            strokeWidth={5}
            fill={fillColor}
            stroke={strokeColor}
            width={30}
            height={item.yDepth}
          />
        </>
      )}

      {item.type === 'BipartingDoor' && (
        <>
          <Path
            d={createArcPath(item.xWidth / 2, 90)}
            fill={'#E3E8FF'}
            stroke={strokeColor}
            strokeWidth={5}
            transform={`translate(0, ${item.yDepth})`} // Move to the correct position
          />
          <Path
            d={createArcPath(item.xWidth / 2, 90, item.xWidth)}
            fill={'#E3E8FF'}
            stroke={strokeColor}
            strokeWidth={5}
            transform={`translate(0, ${item.yDepth}) rotate(90)`} // Move and rotate
          />
          <Rect
            width={item.xWidth}
            fill={backgroundColor}
            height={item.yDepth}
          />
          <Rect
            strokeWidth={5}
            fill={fillColor}
            stroke={strokeColor}
            width={-30}
            height={item.yDepth}
          />
          <Rect
            y={item.yDepth}
            strokeWidth={5}
            fill={fillColor}
            stroke={strokeColor}
            width={35}
            height={item.xWidth / 2}
          />
          <Rect
            y={item.yDepth}
            strokeWidth={5}
            fill={fillColor}
            stroke={strokeColor}
            width={35}
            height={item.xWidth / 2}
          />
          <Rect
            x={item.xWidth}
            strokeWidth={5}
            fill={fillColor}
            stroke={strokeColor}
            width={30}
            height={item.yDepth}
          />
        </>
      )}

      {item.type === 'Niche' && (
        <>
          <Rect
            fill={'#E3E8FF'}
            width={item.xWidth}
            height={item.yDepth}
            stroke={strokeColor}
            strokeWidth={8}
          />
          <Polygon
            points={`
              0,${item.yDepth} ${item.xWidth},${item.yDepth} ${item.xWidth},0 ${
              item.xWidth - border
            },0 ${item.xWidth - border},${item.yDepth - border} ${border},${
              item.yDepth - border
            } ${border},0 0,0
            `}
            strokeWidth={8}
            fill={fillColor}
            stroke={strokeColor}
          />
        </>
      )}
    </>
  );
};

export default OpeningDisplayContent;
