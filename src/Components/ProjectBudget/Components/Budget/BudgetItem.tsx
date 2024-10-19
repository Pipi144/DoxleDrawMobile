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
import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import dayjs from 'dayjs';
import {LightDocket} from '../../../../Models/docket';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import useBudgetItem from './Hooks/useBudgetItem';
import {
  StyledBudgetCommentText,
  StyledBudgetDataSection,
  StyledBudgetDataText,
  StyledBudgetItem,
  StyledCommentDueDateSection,
  StyledDueDateText,
} from './StyledComponents';
import DoxleDocketStatus from '../../../DoxleDocketStatus/DoxleDocketStatus';
import BudgetProgress from './BudgetProgress';
import {BudgetIcon, OrderIcon} from './BudgetIcons';
import {
  editRgbaAlpha,
  formatter,
} from '../../../../Utilities/FunctionUtilities';
type Props = {budgetItem: LightDocket; itemIndex: number};

const BudgetItem: React.FC<Props> = ({budgetItem, itemIndex}: Props) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
  const {convertedStatusColor, textSizeWidth, isOverBudget} = useBudgetItem({
    budgetItem,
  });
  return (
    <Pressable>
      <StyledBudgetItem>
        <StyledBudgetDataSection>
          <View
            style={{
              ...styles.rowDataWrapper,
              width: textSizeWidth.docketName,
            }}>
            <DoxleDocketStatus
              animated={budgetItem.statusAnimateIcon}
              statusColor={convertedStatusColor}
              size={doxleFontSize.contentTextSize}
              extraStyle={{marginRight: 14}}
            />

            <BudgetProgress percentage={budgetItem.percentageCompleted} />
            <StyledBudgetDataText
              style={{flex: 1}}
              numberOfLines={1}
              ellipsizeMode="tail">
              {itemIndex + 1} {budgetItem.docketName}
            </StyledBudgetDataText>
          </View>

          <BudgetIcon
            themeColor={THEME_COLOR}
            containerStyle={{
              width: doxleFontSize.contentTextSize + 1,
              marginRight: 5,
            }}
          />
          <StyledBudgetDataText $width={textSizeWidth.costBudget}>
            {budgetItem.costBudget
              ? formatter.format(parseFloat(budgetItem.costBudget?.toString()))
              : '$0.00'}
          </StyledBudgetDataText>
          <OrderIcon
            themeColor={THEME_COLOR}
            containerStyle={{
              width: doxleFontSize.subContentTextSize,
              marginRight: 5,
            }}
          />
          <StyledBudgetDataText $width={textSizeWidth.costActual}>
            {budgetItem.costActual
              ? formatter.format(parseFloat(budgetItem.costActual?.toString()))
              : '$0.00'}
          </StyledBudgetDataText>
          <StyledBudgetDataText
            $width={textSizeWidth.costXero}
            $textColor="#6873B5">
            {budgetItem.costXero
              ? formatter.format(parseFloat(budgetItem.costXero?.toString()))
              : '$0.00'}
          </StyledBudgetDataText>

          <StyledBudgetDataText
            $textColor={isOverBudget ? '#EA1515' : '#209D34'}>
            {budgetItem.costRunning
              ? formatter.format(parseFloat(budgetItem.costRunning?.toString()))
              : '$0.00'}{' '}
            {isOverBudget ? (
              <AntIcon
                name="arrowup"
                size={doxleFontSize.contentTextSize}
                color="#EA1515"
              />
            ) : (
              <AntIcon
                name="arrowdown"
                size={doxleFontSize.contentTextSize}
                color="#209D34"
              />
            )}
          </StyledBudgetDataText>
        </StyledBudgetDataSection>

        <StyledCommentDueDateSection>
          <View
            style={{
              ...styles.rowDataWrapper,
              width: textSizeWidth.docketName,
            }}>
            {itemIndex % 2 !== 0 && (
              <FontAwesome
                name="comment-o"
                size={doxleFontSize.contentTextSize}
                color={editRgbaAlpha({
                  rgbaColor: THEME_COLOR.primaryFontColor,
                  alpha: '0.4',
                })}
                style={{marginRight: 5}}
              />
            )}
            <StyledBudgetCommentText>
              {itemIndex % 2 !== 0 ? 'new comment' : 'Hello 1234'}
            </StyledBudgetCommentText>
          </View>
          <StyledDueDateText>
            {budgetItem.endDate
              ? `Due by ${dayjs(budgetItem.endDate).format('MM/YY')}`
              : 'No Due Date'}
          </StyledDueDateText>
        </StyledCommentDueDateSection>
      </StyledBudgetItem>
    </Pressable>
  );
};

export default memo(BudgetItem);

const styles = StyleSheet.create({
  rowDataWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
