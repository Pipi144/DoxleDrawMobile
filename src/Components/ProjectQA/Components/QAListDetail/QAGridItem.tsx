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
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {QA, QAWithFirstImg} from '../../../../../../../Models/qa';
import {
  StyledQAGridItem,
  StyledQAGridItemInfoSection,
  StyledQAGridItemWrapper,
  StyledQAItemHeadTitleText,
  StyledQALatestCommentText,
} from './StyledComponentsQAListDetail';
import QAItemImageSection from './QAItemImageSection';
import AssigneeDisplayer from './CommonComponents/AssigneeDisplayer';

type Props = {
  qaItem: QAWithFirstImg;
  numOfColumns: number;
  setSelectedQAForAssignee: React.Dispatch<
    React.SetStateAction<QA | undefined>
  >;
};

const QAGridItem = ({
  qaItem,
  numOfColumns,
  setSelectedQAForAssignee,
}: Props) => {
  return (
    <StyledQAGridItemWrapper $numOfCol={numOfColumns}>
      <StyledQAGridItem>
        <QAItemImageSection qaDetail={qaItem} viewMode="grid" />

        <StyledQAGridItemInfoSection>
          <StyledQAItemHeadTitleText numberOfLines={2} ellipsizeMode="tail">
            {qaItem.index}. {qaItem.description}
          </StyledQAItemHeadTitleText>
          {qaItem.lastComment && (
            <StyledQALatestCommentText numberOfLines={3} ellipsizeMode="tail">
              {qaItem.lastComment.commentText}
            </StyledQALatestCommentText>
          )}

          <AssigneeDisplayer
            onPress={() => setSelectedQAForAssignee(qaItem)}
            assigneeName={qaItem.assignee ? qaItem.assigneeName : undefined}
          />
        </StyledQAGridItemInfoSection>
      </StyledQAGridItem>
    </StyledQAGridItemWrapper>
  );
};

export default QAGridItem;

const styles = StyleSheet.create({});
