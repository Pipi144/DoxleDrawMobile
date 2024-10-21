import React from 'react';
import {
  StyledFloorFilterItem,
  StyledFloorFilterItemText,
} from './StyledComponentsQAListDetail';
import {IProjectFloor} from '../../../../Models/location';

type Props = {
  floor: 'none' | 'not-none' | IProjectFloor;
  handleFilterFloor: (floor: 'none' | 'not-none' | IProjectFloor) => void;
  currentFloorId?: string;
};

const FloorFilterItem = ({floor, handleFilterFloor, currentFloorId}: Props) => {
  const isSelected =
    floor === 'none'
      ? currentFloorId === 'none'
      : floor === 'not-none'
      ? currentFloorId === 'not-none'
      : currentFloorId === floor.floorId;
  return (
    <StyledFloorFilterItem onPress={() => handleFilterFloor(floor)}>
      <StyledFloorFilterItemText $selected={isSelected}>
        {floor === 'none'
          ? 'Items without floor'
          : floor === 'not-none'
          ? 'Items with floor'
          : floor.name}
      </StyledFloorFilterItemText>
    </StyledFloorFilterItem>
  );
};

export default FloorFilterItem;
