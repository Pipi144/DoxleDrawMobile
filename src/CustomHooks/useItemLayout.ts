import {useState, useCallback, useEffect} from 'react';
import {LayoutChangeEvent, LayoutRectangle, View} from 'react-native';
type UseLayoutReturnType = [
  LayoutRectangle,
  (event: LayoutChangeEvent) => void,
];

const useItemLayout = (): UseLayoutReturnType => {
  const [layout, setLayout] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const {x, y, width, height} = event.nativeEvent.layout;
    setLayout({x, y, width, height});
  }, []);

  return [layout, onLayout];
};

export default useItemLayout;
