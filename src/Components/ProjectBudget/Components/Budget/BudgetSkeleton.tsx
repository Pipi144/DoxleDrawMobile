import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import {FlatList} from 'react-native-gesture-handler';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import Skeleton from 'react-native-reanimated-skeleton';
import {StyledBudgetDataSection} from './StyledComponents';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {LightDocket} from '../../../../Models/docket';

type Props = {};
const BudgetSkeleton = (props: Props) => {
  const {THEME_COLOR} = useDOXLETheme();
  const {deviceType} = useOrientation();
  const textSizeWidth: Record<
    keyof Pick<
      LightDocket,
      'docketName' | 'costBudget' | 'costActual' | 'costXero' | 'costRunning'
    >,
    number
  > = {
    docketName: deviceType === 'Tablet' ? 380 : 290,
    costBudget: deviceType === 'Tablet' ? 260 : 180,
    costActual: deviceType === 'Tablet' ? 260 : 180,
    costXero: deviceType === 'Tablet' ? 260 : 180,
    costRunning: deviceType === 'Tablet' ? 260 : 180,
  };
  return (
    <Animated.View style={[styles.container]}>
      <FlatList
        style={{flex: 1}}
        scrollEnabled={false}
        data={Array(30).fill('hello')}
        keyExtractor={(item, index) => item + index}
        renderItem={({item, index}) => (
          <Skeleton
            isLoading={true}
            containerStyle={[
              styles.skelRow,
              {
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: THEME_COLOR.rowBorderColor,
              },
            ]}>
            <StyledBudgetDataSection>
              <Text
                style={{...styles.textDisplay, width: textSizeWidth.docketName}}
              />
            </StyledBudgetDataSection>
          </Skeleton>
        )}
        initialNumToRender={20}
      />
    </Animated.View>
  );
};

export default BudgetSkeleton;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },

  skelRow: {
    borderRadius: 2,
    marginBottom: 10,
    display: 'flex',
  },
  rowDataWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textDisplay: {
    height: 20,
    borderRadius: 4,
  },
});
