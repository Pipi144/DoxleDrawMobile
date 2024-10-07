import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDOXLETheme} from '../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../Providers/OrientationContext';

type Props = {
  behavior?: 'height' | 'padding' | 'position' | undefined;
  containerStyle?: ViewStyle;
  children: React.ReactNode[] | React.ReactNode;
  keyboardVerticalOffset?: number | undefined;
};

const DoxleKeyboardAvoidingView = ({
  behavior,
  children,
  containerStyle,
  keyboardVerticalOffset,
}: Props) => {
  const [enabled, setEnabled] = useState(false);
  const {deviceSize} = useOrientation();
  const {THEME_COLOR} = useDOXLETheme();
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', () => {
      setEnabled(true);
    });

    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      setEnabled(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={behavior}
      style={{
        display: containerStyle?.display ?? 'flex',
        backgroundColor:
          containerStyle?.backgroundColor ?? THEME_COLOR.primaryBackgroundColor,
        position: containerStyle?.position ?? 'relative',
        zIndex: containerStyle?.zIndex ?? 0,
        paddingTop: Platform.OS === 'ios' ? deviceSize.insetTop : undefined,
        ...containerStyle,
      }}
      enabled={enabled}
      keyboardVerticalOffset={keyboardVerticalOffset ?? 14}>
      {children}
    </KeyboardAvoidingView>
  );
};

export default DoxleKeyboardAvoidingView;

const styles = StyleSheet.create({});
