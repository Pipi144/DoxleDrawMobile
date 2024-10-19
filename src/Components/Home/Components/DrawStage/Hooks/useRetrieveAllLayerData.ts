import {useShallow} from 'zustand/react/shallow';
import {useKonvaStore} from '../../../Stores/useKonvaStore';
import {useEffect} from 'react';
import {useRetrieveBackgrounds} from '../../../../../API/BackgroundQueryHooks';
import {
  useRetrieveWalls,
  useRetrieveWallTypes,
} from '../../../../../API/WallQueryHooks';
import {useRetrieveOpeningItems} from '../../../../../API/OpeningQueryHooks';

const useRetrieveAllLayerData = () => {
  const {
    currentStorey,

    setStageState,
    stageState,
    // fitScreenStageState,
  } = useKonvaStore(
    useShallow(state => ({
      currentStorey: state.currentStorey,

      setStageState: state.setStageState,
      stageState: state.stageState,
      // fitScreenStageState: state.fitScreenStageState,
    })),
  );

  const {query: wallTypeQuery} = useRetrieveWallTypes({});

  const {query: wallQuery, walls} = useRetrieveWalls({
    enabled: Boolean(currentStorey),
    storeyId: currentStorey?.storeyId,
  });

  const {query: bgQuery, items: bgItems} = useRetrieveBackgrounds({
    enabled: Boolean(currentStorey),
    storeyId: currentStorey?.storeyId,
  });

  // const { query: flooringQuery } = useRetrieveFlooringItems({
  //   enabled: Boolean(currentStorey),
  //   storeyId: currentStorey?.storeyId,
  // });

  const {query: openingQuery, items: openingItems} = useRetrieveOpeningItems({
    enabled: Boolean(currentStorey),
    storeyId: currentStorey?.storeyId,
  });

  // const { query: plumbingQuery } = useRetrievePlumbingItems({
  //   enabled: Boolean(currentStorey),
  //   storeyId: currentStorey?.storeyId,
  // });

  // const { query: electricalQuery } = useRetrieveElectricalItems({
  //   enabled: Boolean(currentStorey),
  //   storeyId: currentStorey?.storeyId,
  // });
  // const { query: markUpQuery } = useRetrieveMarkUps({
  //   enabled: Boolean(currentStorey),
  //   storey_id: currentStorey?.storeyId ?? '',
  // });

  const isRetrieveLayerData =
    wallTypeQuery.isLoading || wallQuery.isLoading || bgQuery.isLoading;
  // ||
  // flooringQuery.isLoading ||
  openingQuery.isLoading;
  // ||
  // plumbingQuery.isLoading ||
  // electricalQuery.isLoading ||
  // markUpQuery.isLoading;
  useEffect(() => {
    if (!(wallQuery.isLoading || bgQuery.isLoading)) {
      // fitScreenStage();
    }
  }, [bgQuery.isLoading, wallQuery.isLoading]);

  return {isRetrieveLayerData, walls, bgItems, openingItems};
};

export default useRetrieveAllLayerData;
