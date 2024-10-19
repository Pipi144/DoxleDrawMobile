import {useCallback, useEffect, useRef, useState} from 'react';
import {FlatListProps, LayoutChangeEvent} from 'react-native';
import Animated, {
  SharedValue,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring,
  LinearTransition,
  AnimatedProps,
} from 'react-native-reanimated';
import {
  ISyncScrollViewProps,
  useSyncScrollView,
} from './SyncScrollViewProvider';
import {ReanimatedFlatList} from 'react-native-reanimated/lib/typescript/component/FlatList';

// ----------------------------------------------------------------------------

type SyncedFlatlistProps<T = any> = AnimatedProps<FlatListProps<T>> & {
  idFlatlist: number;
  scrollAnimatedValue?: SharedValue<number>;
  vertialScrollAnimatedValue?: SharedValue<number>; //used to control the appearance of the period icon in timeline table
  getContentLengthStateFunction?: (value: number) => void;
};

export const SyncedFlatlist = (props: SyncedFlatlistProps) => {
  const {
    idFlatlist,
    scrollAnimatedValue,
    vertialScrollAnimatedValue,
    getContentLengthStateFunction,
    CellRendererComponent,
    ...rest
  } = props;
  const {activeFlatlist, offsetFlatlistPercent} =
    useSyncScrollView() as ISyncScrollViewProps;

  // Get relevant Flatlist Dimensions --------------------------------------------------

  const [flatlistLength, setflatlistLength] = useState(0);
  const [contentLength, setContentLength] = useState(0);

  // const [scrollableLength, setScrollableLength] = useState(0);
  const scrollableLength = useRef<SharedValue<number>>(
    useSharedValue(0),
  ).current;
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const {width, height} = event.nativeEvent.layout;
      // The length of the flatlist depends on the orientation we scroll in
      setflatlistLength(props.horizontal ? width : height);
    },
    [props.horizontal],
  );

  const handleContentSizeChange = useCallback(
    (width: number, height: number) => {
      // The length of the content inside the scrollView depends on the orientation we scroll in
      setContentLength(props.horizontal ? width : height);
    },
    [],
  );
  // Calculate the scrollable Length everytime the contentLength or flatlistLength changes
  useEffect(() => {
    if (contentLength - flatlistLength >= 0)
      scrollableLength.value = contentLength - flatlistLength;
    if (getContentLengthStateFunction)
      getContentLengthStateFunction(
        contentLength - flatlistLength < 0 ? 0 : contentLength - flatlistLength,
      );
  }, [flatlistLength, contentLength]);

  // handle yPercent change ----------------------------------------------------

  const flatlistRef = useAnimatedRef<ReanimatedFlatList<any>>();

  const scrollHandler = useCallback(
    props.horizontal
      ? useAnimatedScrollHandler(
          {
            onScroll: event => {
              if (
                idFlatlist === activeFlatlist.value &&
                scrollableLength.value >= 0
              ) {
                offsetFlatlistPercent.value =
                  event.contentOffset.x / scrollableLength.value;
              }
              if (scrollAnimatedValue && idFlatlist === activeFlatlist.value)
                scrollAnimatedValue.value = event.contentOffset.x;
              if (
                vertialScrollAnimatedValue &&
                idFlatlist === activeFlatlist.value
              )
                vertialScrollAnimatedValue.value = withSpring(1, {
                  damping: 20,
                  mass: 4,
                });
            },
          },
          [],
        )
      : useAnimatedScrollHandler(
          {
            onScroll: event => {
              if (
                idFlatlist === activeFlatlist.value &&
                scrollableLength.value >= 0
              ) {
                offsetFlatlistPercent.value =
                  event.contentOffset.y / scrollableLength.value;
              }
              if (scrollAnimatedValue && idFlatlist === activeFlatlist.value)
                scrollAnimatedValue.value = event.contentOffset.y;
              if (
                vertialScrollAnimatedValue &&
                idFlatlist === activeFlatlist.value
              )
                vertialScrollAnimatedValue.value = withSpring(1, {
                  damping: 20,
                  mass: 4,
                });
            },
          },
          [],
        ),
    [
      props.horizontal,
      activeFlatlist.value,
      scrollableLength.value,
      offsetFlatlistPercent,
      scrollAnimatedValue,
      vertialScrollAnimatedValue,
    ],
  );

  props.horizontal
    ? useAnimatedReaction(
        () => {
          return offsetFlatlistPercent.value;
        },
        (next, prev) => {
          if (prev !== next) {
            if (
              idFlatlist !== activeFlatlist.value &&
              scrollableLength.value !== 0
            ) {
              scrollTo(flatlistRef, next * scrollableLength.value, 0, false);
            }
          }
        },
        [offsetFlatlistPercent],
      )
    : useAnimatedReaction(
        () => {
          return offsetFlatlistPercent.value;
        },
        (next, prev) => {
          if (prev !== next) {
            if (
              idFlatlist !== activeFlatlist.value &&
              scrollableLength.value !== 0
            ) {
              scrollTo(flatlistRef, 0, next * scrollableLength.value, false);
            }
          }
        },
        [offsetFlatlistPercent],
      );

  // Change this ScrollView to the active ScrollView when it is touched
  const handleTouchStart = () => {
    activeFlatlist.value = idFlatlist;
    if (
      vertialScrollAnimatedValue !== undefined &&
      idFlatlist === activeFlatlist.value
    )
      vertialScrollAnimatedValue.value = withSpring(1, {
        damping: 20,
        mass: 4,
      });
  };
  const handleTouchEnd = () => {
    if (
      vertialScrollAnimatedValue !== undefined &&
      idFlatlist === activeFlatlist.value
    )
      vertialScrollAnimatedValue.value = withSpring(0, {
        damping: 10,
        mass: 10,
      });
  };
  const layout = LinearTransition.springify().damping(16).mass(0.4);
  return (
    <Animated.FlatList
      itemLayoutAnimation={layout}
      nestedScrollEnabled={true}
      ref={flatlistRef}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onLayout={handleLayout}
      onContentSizeChange={handleContentSizeChange}
      skipEnteringExitingAnimations={true}
      {...rest}
    />
  );
};
