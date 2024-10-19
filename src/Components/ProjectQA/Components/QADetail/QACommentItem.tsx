import {StyleSheet} from 'react-native';
import React from 'react';

import {
  StyledQACommentAuthorText,
  StyledQACommentGeneralDetailSection,
  StyledQACommentItemContainer,
  StyledQACommentText,
  StyledQACommentTextWrapper,
  StyledQACommentTimestampText,
} from './StyledComponentQADetail';
import {QAComment} from '../../../../../../../Models/qa';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {
  TRgbaFormat,
  editRgbaAlpha,
  formatDate,
} from '../../../../../../../Utilities/FunctionUtilities';
import DoxleUserInitialTag from '../../../../../../DesignPattern/DoxleUserInitialTag/DoxleUserInitialTag';
import {useOrientation} from '../../../../../../../Providers/OrientationContext';
import useQACommentItem from '../../Hooks/useQACommentItem';
import Autolink from 'react-native-autolink';

type Props = {
  commentItem: QAComment;
};

const QACommentItem = ({commentItem}: Props) => {
  const {THEME_COLOR, DOXLE_FONT, doxleFontSize} = useDOXLETheme();
  const {deviceType} = useOrientation();

  const {handleLongPressComment} = useQACommentItem({commentItem});
  return (
    <StyledQACommentItemContainer
      onLongPress={handleLongPressComment}
      delayLongPress={200}>
      <StyledQACommentGeneralDetailSection>
        <StyledQACommentAuthorText>
          {commentItem.authorJson &&
            `${commentItem.authorJson.firstName} ${commentItem.authorJson.lastName}`}
        </StyledQACommentAuthorText>
        <StyledQACommentTimestampText>
          {commentItem.timeStamp &&
            formatDate(
              new Date(commentItem.timeStamp as string),
              'monthAcronym dd, yyyy',
              'fullDate',
            )}
        </StyledQACommentTimestampText>
      </StyledQACommentGeneralDetailSection>

      <StyledQACommentTextWrapper $isOfficial={commentItem.isOfficial}>
        <Autolink
          component={StyledQACommentText}
          text={commentItem.commentText}
          linkStyle={{
            color: editRgbaAlpha({
              rgbaColor: THEME_COLOR.doxleColor as TRgbaFormat,
              alpha: '0.5',
            }),
            textDecorationLine: 'underline',
            flex: 1,
          }}
          phone={true}
        />

        {commentItem.authorJson && (
          <DoxleUserInitialTag
            userFullName={`${commentItem.authorJson.firstName} ${commentItem.authorJson.lastName}`}
            containerStyle={{
              backgroundColor: THEME_COLOR.doxleColor,
              width: doxleFontSize.headTitleTextSize + 4,
              height: doxleFontSize.headTitleTextSize + 4,
              borderRadius: (doxleFontSize.headTitleTextSize + 4) / 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            textStyle={{
              fontFamily: DOXLE_FONT.titleFont,
              fontSize: doxleFontSize.subContentTextSize,
              fontWeight: '500',
              color: 'white',
              textTransform: 'uppercase',
            }}
          />
        )}
      </StyledQACommentTextWrapper>
    </StyledQACommentItemContainer>
  );
};

export default QACommentItem;

const styles = StyleSheet.create({});
