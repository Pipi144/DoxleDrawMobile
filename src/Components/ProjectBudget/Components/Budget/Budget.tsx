// Copyright 2024 selvinkamal
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import React, {useCallback} from 'react';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import useBudget from './Hooks/useBudget';
import {LightDocket} from '../../../../Models/docket';
import {SyncScrollViewProvider} from '../../../DesignPattern/SyncScrollViews/SyncScrollViewProvider';
import {StyledBudgetContainer} from './StyledComponents';
import BudgetSkeleton from './BudgetSkeleton';
import BudgetItem from './BudgetItem';
import {RefreshControl, StyleSheet, View} from 'react-native';
import {SyncedScrollView} from '../../../DesignPattern/SyncScrollViews/SyncedScrollView';
import Animated from 'react-native-reanimated';
import ListLoadingMoreBottom from '../../../../Utilities/AnimationScreens/ListLoadingMoreBottom/ListLoadingMoreBottom';
import {ActivityIndicator} from 'react-native-paper';
import SearchSection from '../../../DesignPattern/SearchSection/SearchSection';

type Props = {};

const Budget = () => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();

  const {deviceType, deviceSize} = useOrientation();
  const {
    docketBudgetList,

    isFetchingBudgetData,
    refetchBudgetData,
    isRefetchingBudgetData,
    handleFetchNextPageBudget,
    isFetchingNextPageBudget,
    scrollXAnimatedValue,
    touchAnimatedValue,
    horizontalScrollViewAnimatedStyle,
    onSearch,
  } = useBudget({});
  const renderItem = useCallback(
    (props: {item: LightDocket; index: number}) => (
      <BudgetItem budgetItem={props.item} itemIndex={props.index} />
    ),
    [],
  );
  const keyExtractor = useCallback((item: LightDocket) => item.docketPk, []);
  return (
    <SyncScrollViewProvider>
      <StyledBudgetContainer
        resizeMode="cover"
        source={require('../../../../assets/images/gridbg.png')}>
        <SearchSection
          placeholder="Search budget items..."
          containerStyle={{
            marginVertical: 14,
          }}
          onSearch={onSearch}
        />
        {isFetchingBudgetData && <BudgetSkeleton />}
        {!isFetchingBudgetData && (
          <>
            <View style={styles.contentWrapper}>
              <>
                <SyncedScrollView
                  idScrollViews={1}
                  horizontal
                  nestedScrollEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  style={[
                    horizontalScrollViewAnimatedStyle,
                    styles.horizontalScrollViewWrapper,
                  ]}
                  touchAnimatedValue={touchAnimatedValue}
                  scrollAnimatedValue={scrollXAnimatedValue}
                  automaticallyAdjustContentInsets
                  automaticallyAdjustsScrollIndicatorInsets
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}>
                  <Animated.FlatList
                    contentContainerStyle={{
                      flexGrow: 1,
                      paddingBottom: deviceSize.insetBottom,
                    }}
                    showsVerticalScrollIndicator={false}
                    data={docketBudgetList}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    onEndReached={handleFetchNextPageBudget}
                    onEndReachedThreshold={0.1}
                    initialNumToRender={18}
                    maxToRenderPerBatch={4}
                    updateCellsBatchingPeriod={200}
                    refreshControl={
                      <RefreshControl
                        refreshing={isRefetchingBudgetData}
                        onRefresh={refetchBudgetData}
                        tintColor={THEME_COLOR.primaryFontColor}
                        size={doxleFontSize.contentTextSize}
                      />
                    }
                    automaticallyAdjustContentInsets
                    automaticallyAdjustsScrollIndicatorInsets
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                  />
                </SyncedScrollView>
              </>

              {isFetchingNextPageBudget && (
                <ListLoadingMoreBottom
                  containerStyle={styles.preloaderContainer}
                  size={44}
                />
              )}
              {isRefetchingBudgetData && (
                <ActivityIndicator
                  style={styles.refetchIcon}
                  size={deviceType === 'Smartphone' ? 20 : 23}
                  color={THEME_COLOR.primaryFontColor}
                />
              )}
            </View>
          </>
        )}
      </StyledBudgetContainer>
    </SyncScrollViewProvider>
  );
};

export default Budget;
const styles = StyleSheet.create({
  refetchIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,

    zIndex: 10,
  },
  preloaderContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  retryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  horizontalScrollViewWrapper: {
    height: '100%',
    zIndex: 0,
  },
  addBtn: {
    alignSelf: 'flex-end',

    padding: 10,
  },

  contentWrapper: {
    flex: 1,
    display: 'flex',
    position: 'relative',
    width: '100%',
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
});
