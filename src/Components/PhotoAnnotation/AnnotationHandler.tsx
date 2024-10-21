import {Keyboard} from 'react-native';
import React from 'react';
import {StyledAnnotationHandlerContainer} from './StyledComponentPhotoAnnotation';

import ShapeDrawer from './ShapeDrawer';
import Svg, {Path} from 'react-native-svg';
import useAnnotationHandler from './Hooks/useAnnotationHandler';
import {produce} from 'immer';
import DraggedTextInput from './DraggedTextInput';

const AnnotationHandler = () => {
  const {
    handleAddMarkup,
    startPos,
    setstartPos,
    movePos,
    setmovePos,
    tool,
    currentColorForTool,
    backgroundImage,
    currentDrawingPath,
    setCurrentDrawingPath,
    handleAddPathDrawing,
    addedMarkup,
    oldMarkup,
  } = useAnnotationHandler();

  return (
    <StyledAnnotationHandlerContainer //!ALL PAN RESPONDER ONLY GET GRANTED TOUCH WHEN TOOL is NOT "POINTER" and need to disable touch grant when the number of touch is more than 1
      onStartShouldSetResponder={event => {
        if (tool === 'Pointer') {
          Keyboard.dismiss();
          return false;
        }
        if (event.nativeEvent.touches.length === 1) {
          // if (tool === 'Text')
          //   setTempTextInputPos({
          //     x:
          //       event.nativeEvent.locationX + textInputWidth >=
          //       backgroundImage.width - 20
          //         ? backgroundImage.width - (textInputWidth + 10)
          //         : event.nativeEvent.locationX,
          //     y:
          //       event.nativeEvent.locationY + 35 >= backgroundImage.height - 10
          //         ? backgroundImage.height - 70
          //         : event.nativeEvent.locationY,
          //   });
          return true;
        } else return false;
      }}
      onMoveShouldSetResponder={event => {
        if (tool === 'Pointer') return false;
        if (event.nativeEvent.touches.length === 1) {
          return true;
        } else return false;
      }}
      onResponderStart={evt => {
        if (tool === 'Pointer') return;
        if (evt.nativeEvent.touches.length === 1) {
          if (tool !== 'Text' && tool !== 'Pencil')
            setstartPos({
              x: evt.nativeEvent.locationX,
              y: evt.nativeEvent.locationY,
            });
        }
      }}
      onResponderMove={evt => {
        if (tool === 'Pointer') return;
        if (evt.nativeEvent.touches.length === 1 && tool !== 'Text') {
          //!handle out of bound
          if (tool !== 'Pencil')
            setmovePos({
              x:
                evt.nativeEvent.locationX < 0
                  ? 4
                  : evt.nativeEvent.locationX >= backgroundImage.width
                  ? backgroundImage.width - 4
                  : evt.nativeEvent.locationX,
              y:
                evt.nativeEvent.locationY < 0
                  ? 4
                  : evt.nativeEvent.locationY >= backgroundImage.height
                  ? backgroundImage.height - 4
                  : evt.nativeEvent.locationY,
            });
          else {
            const newPath = [...currentDrawingPath];
            const locationX = evt.nativeEvent.locationX;
            const locationY = evt.nativeEvent.locationY;
            const newPoint = `${
              newPath.length === 0 ? 'M' : ''
            }${locationX.toFixed(0)},${locationY.toFixed(0)} `;

            setCurrentDrawingPath(
              produce(draftPath => {
                draftPath.push(newPoint);
                return draftPath;
              }),
            );
          }
        }
      }}
      onResponderRelease={evt => {
        if (tool === 'Pointer') return;
        if (tool !== 'Text') {
          if (tool !== 'Pencil')
            handleAddMarkup({
              x:
                evt.nativeEvent.locationX < 0
                  ? 4
                  : evt.nativeEvent.locationX >= backgroundImage.width
                  ? backgroundImage.width - 4
                  : evt.nativeEvent.locationX,
              y:
                evt.nativeEvent.locationY < 0
                  ? 4
                  : evt.nativeEvent.locationY >= backgroundImage.height
                  ? backgroundImage.height - 4
                  : evt.nativeEvent.locationY,
            });
          else {
            handleAddPathDrawing();
          }
        }
      }}>
      {startPos && movePos && (
        <Svg
          width="100%"
          height="100%"
          style={{position: 'absolute', zIndex: 0}}>
          <ShapeDrawer
            startPos={startPos}
            endPos={movePos}
            fillColor={currentColorForTool}
            shapeType={tool}
            action="drawing"
            width={
              tool === 'Rectangle'
                ? Math.abs(movePos.x - startPos.x)
                : undefined
            }
            height={
              tool === 'Rectangle'
                ? Math.abs(movePos.y - startPos.y)
                : undefined
            }
            radius={Math.sqrt(
              Math.pow(startPos.x - movePos.x, 2) +
                Math.pow(startPos.y - movePos.y, 2),
            )}
          />
        </Svg>
      )}

      {currentDrawingPath.length > 0 && (
        <Svg
          height={'100%'}
          width={'100%'}
          style={{position: 'absolute', zIndex: 0}}>
          <Path
            d={currentDrawingPath.join('')}
            stroke={currentColorForTool}
            fill={'transparent'}
            strokeWidth={4}
            strokeLinejoin={'round'}
            strokeLinecap={'round'}
          />
        </Svg>
      )}

      {addedMarkup.map((textAdded, index) =>
        textAdded.type === 'Text' ? (
          <DraggedTextInput
            key={`inputAdded#${index}`}
            item={textAdded}
            itemIndex={index}
            type="added"
          />
        ) : null,
      )}

      {oldMarkup &&
        oldMarkup.map((textAdded, index) =>
          textAdded.type === 'Text' ? (
            <DraggedTextInput
              key={`oldInput#${index}`}
              item={textAdded}
              itemIndex={index}
              type="old"
            />
          ) : null,
        )}
    </StyledAnnotationHandlerContainer>
  );
};

export default AnnotationHandler;
