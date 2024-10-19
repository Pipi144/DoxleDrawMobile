import {useCallback, useEffect, useRef, useState} from 'react';
import {
  ISyncScrollViewProps,
  useSyncScrollView,
} from './SyncScrollViewProvider';
import Animated, {
  useSharedValue,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedReaction,
  useAnimatedRef,
  scrollTo,
  AnimatedScrollViewProps,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

// ----------------------------------------------------------------------------

type SyncedScrollViewProps = AnimatedScrollViewProps & {
  idScrollViews: number;
  scrollAnimatedValue?: SharedValue<number>;
  touchAnimatedValue?: SharedValue<number>;
};

export const SyncedScrollView = (props: SyncedScrollViewProps) => {
  const {idScrollViews, scrollAnimatedValue, touchAnimatedValue, ...rest} =
    props;

  const {activeScrollView, offsetPercent} =
    useSyncScrollView() as ISyncScrollViewProps;

  // Get relevant ScrollView Dimensions --------------------------------------------------

  const [scrollViewLength, setScrollViewLength] = useState(0);
  const [contentLength, setContentLength] = useState(0);

  const scrollableLength = useRef<SharedValue<number>>(
    useSharedValue(0),
  ).current;
  const handleLayout = ({
    nativeEvent: {
      layout: {width, height},
    },
  }: any) => {
    // The length of the scrollView depends on the orientation we scroll in
    setScrollViewLength(props.horizontal ? width : height);
  };

  const handleContentSizeChange = (width: number, height: number) => {
    // The length of the content inside the scrollView depends on the orientation we scroll in
    setContentLength(props.horizontal ? width : height);
  };
  // Calculate the scrollable Length everytime the contentLength or scrollViewLength changes
  useEffect(() => {
    if (contentLength - scrollViewLength >= 0)
      scrollableLength.value = contentLength - scrollViewLength;
  }, [scrollViewLength, contentLength]);

  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  const scrollHandler = useCallback(
    props.horizontal
      ? useAnimatedScrollHandler(
          {
            onScroll: event => {
              if (
                idScrollViews === activeScrollView.value &&
                scrollableLength.value >= 0
              ) {
                offsetPercent.value =
                  event.contentOffset.x / scrollableLength.value;
              }
              if (
                scrollAnimatedValue &&
                idScrollViews === activeScrollView.value &&
                scrollableLength.value >= 0
              ) {
                scrollAnimatedValue.value = event.contentOffset.x;
              }
            },
            onMomentumBegin: event => {
              if (
                idScrollViews === activeScrollView.value &&
                scrollableLength.value >= 0
              ) {
                offsetPercent.value =
                  event.contentOffset.x / scrollableLength.value;
              }
              if (
                scrollAnimatedValue &&
                idScrollViews === activeScrollView.value &&
                scrollableLength.value >= 0
              ) {
                scrollAnimatedValue.value = event.contentOffset.x;
              }
            },
            onMomentumEnd: event => {
              if (
                idScrollViews === activeScrollView.value &&
                scrollableLength.value >= 0
              ) {
                offsetPercent.value =
                  event.contentOffset.x / scrollableLength.value;
              }
              if (
                scrollAnimatedValue &&
                idScrollViews === activeScrollView.value &&
                scrollableLength.value >= 0
              ) {
                scrollAnimatedValue.value = event.contentOffset.x;
              }
            },
          },
          [],
        )
      : useAnimatedScrollHandler(
          {
            onScroll: event => {
              if (
                idScrollViews === activeScrollView.value &&
                scrollableLength.value >= 0
              ) {
                offsetPercent.value =
                  event.contentOffset.y / scrollableLength.value;
              }
              if (
                scrollAnimatedValue &&
                idScrollViews === activeScrollView.value &&
                scrollableLength.value >= 0
              ) {
                scrollAnimatedValue.value = event.contentOffset.y;
              }
            },
            onMomentumBegin: event => {
              if (
                idScrollViews === activeScrollView.value &&
                scrollableLength.value >= 0
              ) {
                offsetPercent.value =
                  event.contentOffset.y / scrollableLength.value;
              }
              if (
                scrollAnimatedValue &&
                idScrollViews === activeScrollView.value &&
                scrollableLength.value >= 0
              ) {
                scrollAnimatedValue.value = event.contentOffset.y;
              }
            },
            onMomentumEnd: event => {
              if (
                idScrollViews === activeScrollView.value &&
                scrollableLength.value >= 0
              ) {
                offsetPercent.value = props.horizontal
                  ? event.contentOffset.x / scrollableLength.value
                  : event.contentOffset.y / scrollableLength.value;
              }
              if (
                scrollAnimatedValue &&
                idScrollViews === activeScrollView.value &&
                scrollableLength.value > 0
              )
                scrollAnimatedValue.value = props.horizontal
                  ? event.contentOffset.x
                  : event.contentOffset.y;
            },
          },
          [],
        ),
    [props.horizontal, idScrollViews, activeScrollView, scrollableLength],
  );

  props.horizontal
    ? useAnimatedReaction(
        () => {
          return offsetPercent.value;
        },
        (next, prev) => {
          if (prev !== next) {
            if (
              idScrollViews !== activeScrollView.value &&
              scrollableLength.value >= 0
            ) {
              scrollTo(scrollViewRef, next * scrollableLength.value, 0, false);
            }
          }
        },
        [offsetPercent],
      )
    : useAnimatedReaction(
        () => {
          return offsetPercent.value;
        },
        (next, prev) => {
          if (prev !== next) {
            if (
              idScrollViews !== activeScrollView.value &&
              scrollableLength.value >= 0
            ) {
              scrollTo(scrollViewRef, 0, next * scrollableLength.value, false);
            }
          }
        },
        [offsetPercent],
      );
  // useAnimatedReaction(
  //   () => {
  //     return offset.value;
  //   },
  //   (next, prev) => {
  //     if (next !== prev) {
  //       if (
  //         idScrollViews === activeScrollView.value &&
  //         scrollableLength.value >= 0
  //       ) {
  //         offsetPercent.value = next / scrollableLength.value;
  //       }

  //       // runOnUI(updateScrollAnimatedValue)(next);
  //     }
  //   },
  //   [],
  // );

  const handleTouchStart = () => {
    activeScrollView.value = idScrollViews;
    if (
      touchAnimatedValue !== undefined &&
      idScrollViews === activeScrollView.value
    )
      touchAnimatedValue.value = withTiming(1, {
        duration: 400,
      });
  };
  const handleTouchEnd = () => {
    if (
      touchAnimatedValue !== undefined &&
      idScrollViews === activeScrollView.value
    )
      touchAnimatedValue.value = withDelay(
        200,
        withTiming(0, {
          duration: 400,
        }),
      );
  };
  return (
    <Animated.ScrollView
      nestedScrollEnabled={true}
      {...rest}
      ref={scrollViewRef}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      // onTouchCancel={handleTouchEnd}
      onScrollEndDrag={handleTouchEnd}
      onLayout={handleLayout}
      onContentSizeChange={handleContentSizeChange}
    />
  );
};
