import {memo} from 'react';
import {generateObjName} from '../../Stores/useKonvaStore.ts';
import {OpeningItem} from '../../../../Models/DrawModels/Openings.ts';
import useOpeningComponent from './Hooks/useOpeningComponent.ts';
import {G} from 'react-native-svg';
import OpeningDisplayContent from './OpeningDisplayContent.tsx';

interface Props {
  item: OpeningItem;
}

const OpeningComponent = memo(({item}: Props) => {
  const {} = useOpeningComponent({item});

  return (
    <>
      <G
        name={generateObjName(item.openingId, 'Openings')}
        key={item.openingId}
        id={item.openingId}
        x={item.xPosition}
        y={item.yPosition}
        rotation={item.rotation}
        scaleX={item.xFlipped ? -1 : 1}
        scaleY={item.yFlipped ? -1 : 1}>
        <OpeningDisplayContent item={item} />
      </G>
    </>
  );
});
export default memo(OpeningComponent);
