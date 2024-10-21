import {StyleSheet} from 'react-native';
import React from 'react';
import {
  StyledQADetailHeader,
  StyledQADetailLabelText,
} from './StyledComponentQADetail';

import Animated, {
  FadeInUp,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import QADetailEditDueDate from './QADetailEditDueDate';
import QADetailEditAssignee from './QADetailEditAssignee';
import QADetailEditComment from './QADetailEditComment';
import QAImageMenuSection from './QAImageMenuSection';
import {ActivityIndicator} from 'react-native-paper';
import QADetailEditStatus from './QADetailEditStatus';
import QADetailEditDescription from './QADetailEditDescription';
import QADetailEditRoom from './QADetailEditRoom';
import QADetailEditFloor from './QADetailEditFloor';
import {QA, TQAStatus} from '../../../../Models/qa';
import {TDateISODate} from '../../../../Models/dateFormat';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

type Props = {
  edittedQA: QA;
  handleQADescriptionChange: (value: string) => void;
  handleDueDateChange: (newDate: TDateISODate | null) => void;
  handleAssigneeChange: (props: {
    assignee: string | null;
    assigneeName: string;
  }) => void;

  handleSetIsProcessingImage: (value: boolean) => void;
  isFetchingQAImage: boolean;
  handleStatusChange: (status: TQAStatus) => void;

  mode?: 'full' | 'landscapeComment' | 'landscapeImg';
};

const QADetailHeader: React.FC<Props> = ({
  edittedQA,
  handleQADescriptionChange,
  handleDueDateChange,
  handleAssigneeChange,

  handleSetIsProcessingImage,
  isFetchingQAImage,
  handleStatusChange,
  mode = 'full',
}: Props) => {
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();
  return (
    <StyledQADetailHeader>
      {mode === 'full' && (
        <>
          <QADetailEditDescription
            qaItem={edittedQA}
            handleQADescriptionChange={handleQADescriptionChange}
          />
          <QADetailEditAssignee
            qaItem={edittedQA}
            handleAssigneeChange={handleAssigneeChange}
          />
          <Animated.View style={styles.floorAndRoomWrapper}>
            <QADetailEditFloor />

            <QADetailEditRoom />
          </Animated.View>

          <Animated.View style={styles.dueDateAndStatusWrapper}>
            <QADetailEditDueDate
              qaItem={edittedQA}
              handleDueDateChange={handleDueDateChange}
            />

            <QADetailEditStatus qaItem={edittedQA} />
          </Animated.View>

          <QADetailEditComment qaItem={edittedQA} />

          <QAImageMenuSection
            qaItem={edittedQA}
            handleSetIsProcessingImage={handleSetIsProcessingImage}
          />

          {isFetchingQAImage && (
            <Animated.View
              style={styles.headerWrapper}
              layout={LinearTransition.springify().damping(16)}
              entering={FadeInUp}
              exiting={FadeOut}>
              <ActivityIndicator
                size={doxleFontSize.headTitleTextSize}
                color={THEME_COLOR.primaryFontColor}
              />
            </Animated.View>
          )}
        </>
      )}

      {mode === 'landscapeComment' && (
        <>
          <QADetailEditDescription
            qaItem={edittedQA}
            handleQADescriptionChange={handleQADescriptionChange}
          />

          <QADetailEditAssignee
            qaItem={edittedQA}
            handleAssigneeChange={handleAssigneeChange}
          />
          <Animated.View style={styles.dueDateAndStatusWrapper}>
            <QADetailEditDueDate
              qaItem={edittedQA}
              handleDueDateChange={handleDueDateChange}
            />

            <QADetailEditStatus qaItem={edittedQA} />
          </Animated.View>

          <StyledQADetailLabelText>Comment</StyledQADetailLabelText>
        </>
      )}

      {mode === 'landscapeImg' && (
        <>
          <QAImageMenuSection
            qaItem={edittedQA}
            handleSetIsProcessingImage={handleSetIsProcessingImage}
          />

          {isFetchingQAImage && (
            <Animated.View
              style={styles.headerWrapper}
              layout={LinearTransition.springify().damping(16)}
              entering={FadeInUp}
              exiting={FadeOut}>
              <ActivityIndicator
                size={doxleFontSize.headTitleTextSize}
                color={THEME_COLOR.primaryFontColor}
              />
            </Animated.View>
          )}
        </>
      )}
    </StyledQADetailHeader>
  );
};

export default QADetailHeader;

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 14,
  },
  dueDateAndStatusWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  floorAndRoomWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
