import {StyleSheet} from 'react-native';
import {useCallback, useState} from 'react';

import {usePhotoAnnotationContext} from '../PhotoAnnotation';
import {produce} from 'immer';
import {
  IArrow,
  IAxisPos,
  ICircle,
  IPath,
  IRectangle,
  IStraightLine,
} from '../../../Models/MarkupTypes';

type Props = {};

const useAnnotationHandler = () => {
  const [startPos, setstartPos] = useState<IAxisPos | undefined>(undefined);
  const [movePos, setmovePos] = useState<IAxisPos | undefined>(undefined);
  const [currentDrawingPath, setCurrentDrawingPath] = useState<string[]>([]);
  const [tempTextInputPos, setTempTextInputPos] = useState<
    IAxisPos | undefined
  >(undefined);

  const [tempText, setTempText] = useState<string>('');
  const {
    currentColorForTool,
    addedMarkup,
    setAddedMarkup,
    tool,
    backgroundImage,
    oldMarkup,
  } = usePhotoAnnotationContext();

  const textInputWidth = 250;
  const handleAddMarkup = useCallback(
    (endPos: IAxisPos, text?: string) => {
      if (tool === 'Circle' && startPos) {
        const addedCircle: ICircle = {
          x: startPos.x,
          y: startPos.y,

          r: Math.sqrt(
            Math.pow(startPos.x - endPos.x, 2) +
              Math.pow(startPos.y - endPos.y, 2),
          ),
          color: currentColorForTool,
          type: 'Circle',
        };
        setAddedMarkup(
          produce(draft => {
            draft.push(addedCircle);
          }),
        );
      }

      if (tool === 'Arrow' && startPos) {
        const addedArrow: IArrow = {
          x1: startPos.x,
          y1: startPos.y,
          x2: endPos.x,
          y2: endPos.y,

          color: currentColorForTool,
          type: 'Arrow',
        };
        setAddedMarkup(
          produce(draft => {
            draft.push(addedArrow);
          }),
        );
      }

      if (tool === 'StraightLine' && startPos) {
        const addedLine: IStraightLine = {
          x1: startPos.x,
          y1: startPos.y,
          x2: endPos.x,
          y2: endPos.y,

          color: currentColorForTool,
          type: 'StraightLine',
        };
        setAddedMarkup(
          produce(draft => {
            draft.push(addedLine);
          }),
        );
      }
      if (tool === 'Rectangle' && startPos) {
        const addedRect: IRectangle = {
          x: startPos.x,
          y: startPos.y,
          w: endPos.x - startPos.x,
          h: endPos.y - startPos.y,
          color: currentColorForTool,
          type: 'Rectangle',
        };
        setAddedMarkup(
          produce(draft => {
            draft.push(addedRect);
          }),
        );
      }

      setstartPos(undefined);
      setmovePos(undefined);
    },
    [tool, startPos, currentColorForTool],
  );

  const handleAddPathDrawing = useCallback(() => {
    setAddedMarkup(
      produce(draft => {
        draft.push({
          pathPoints: currentDrawingPath,
          color: currentColorForTool,
          type: 'Pencil',
        } as IPath);
      }),
    );
    setCurrentDrawingPath([]);
  }, [currentDrawingPath, currentColorForTool]);
  return {
    handleAddMarkup,
    startPos,
    setstartPos,
    movePos,
    setmovePos,
    tempTextInputPos,
    setTempTextInputPos,
    tempText,
    setTempText,
    tool,
    currentColorForTool,
    textInputWidth,
    backgroundImage,
    currentDrawingPath,
    setCurrentDrawingPath,
    handleAddPathDrawing,
    addedMarkup,
    oldMarkup,
  };
};

export default useAnnotationHandler;

const styles = StyleSheet.create({});
