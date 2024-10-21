import {StyleSheet} from 'react-native';
import React from 'react';

import Svg, {Path} from 'react-native-svg';
import ShapeDrawer from './ShapeDrawer';
import {usePhotoAnnotationContext} from './PhotoAnnotation';

type Props = {};

const AnnotationDisplayer = (props: Props) => {
  const {addedMarkup, oldMarkup} = usePhotoAnnotationContext();

  return addedMarkup.length > 0 || oldMarkup ? (
    <>
      <Svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          zIndex: 8,
        }}>
        {addedMarkup.length > 0 &&
          addedMarkup.map((markup, idx) => {
            return markup.type === 'Circle' ? (
              <ShapeDrawer
                key={`markup#${idx}`}
                startPos={{x: markup.x, y: markup.y}}
                action="display"
                fillColor={markup.color}
                shapeType={markup.type}
                radius={markup.r}
              />
            ) : markup.type === 'Arrow' || markup.type === 'StraightLine' ? (
              <ShapeDrawer
                key={`markup#${idx}`}
                startPos={{x: markup.x1, y: markup.y1}}
                endPos={{x: markup.x2, y: markup.y2}}
                action="display"
                fillColor={markup.color}
                shapeType={markup.type}
              />
            ) : markup.type === 'Rectangle' ? (
              <ShapeDrawer
                key={`markup#${idx}`}
                startPos={{x: markup.x, y: markup.y}}
                action="display"
                fillColor={markup.color}
                shapeType={markup.type}
                width={markup.w}
                height={markup.h}
              />
            ) : markup.type === 'Pencil' ? (
              <Path
                key={`markup#${idx}`}
                d={markup.pathPoints.join('')}
                stroke={markup.color}
                fill={'transparent'}
                strokeWidth={4}
                strokeLinejoin={'round'}
                strokeLinecap={'round'}
              />
            ) : null;
          })}

        {oldMarkup &&
          oldMarkup.map((markup, idx) => {
            return markup.type === 'Circle' ? (
              <ShapeDrawer
                key={`oldMarkup#${idx}`}
                startPos={{x: markup.x, y: markup.y}}
                action="display"
                fillColor={markup.color}
                shapeType={markup.type}
                radius={markup.r}
              />
            ) : markup.type === 'Arrow' || markup.type === 'StraightLine' ? (
              <ShapeDrawer
                key={`oldMarkup#${idx}`}
                startPos={{x: markup.x1, y: markup.y1}}
                endPos={{x: markup.x2, y: markup.y2}}
                action="display"
                fillColor={markup.color}
                shapeType={markup.type}
              />
            ) : markup.type === 'Rectangle' ? (
              <ShapeDrawer
                key={`oldMarkup#${idx}`}
                startPos={{x: markup.x, y: markup.y}}
                action="display"
                fillColor={markup.color}
                shapeType={markup.type}
                width={markup.w}
                height={markup.h}
              />
            ) : markup.type === 'Pencil' ? (
              <Path
                key={`markup#${idx}`}
                d={markup.pathPoints.join('')}
                stroke={markup.color}
                fill={'transparent'}
                strokeWidth={4}
                strokeLinejoin={'round'}
                strokeLinecap={'round'}
              />
            ) : null;
          })}
      </Svg>
    </>
  ) : (
    <></>
  );
};

export default AnnotationDisplayer;

const styles = StyleSheet.create({});
