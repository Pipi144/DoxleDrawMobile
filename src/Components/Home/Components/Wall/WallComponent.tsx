import {memo} from 'react';
import {generateObjName} from '../../Stores/useKonvaStore.ts';
import {IWall} from '../../../../Models/DrawModels/Walls.ts';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider.tsx';
import useWallComponent from './Hooks/useWallComponent.ts';
import {Polygon} from 'react-native-svg';

type Props = {
  wall: IWall;
};

const WallComponent = memo(({wall}: Props) => {
  const {THEME_COLOR} = useDOXLETheme();
  const {wallPoints} = useWallComponent({wall});

  return (
    <Polygon
      points={wallPoints}
      strokeWidth={5}
      stroke={THEME_COLOR.primaryFontColor}
      fill={THEME_COLOR.doxleColor}
    />
  );
});

export default memo(WallComponent);
