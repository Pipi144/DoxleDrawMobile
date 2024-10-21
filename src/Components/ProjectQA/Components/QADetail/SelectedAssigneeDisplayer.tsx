import {StyleSheet} from 'react-native';
import React from 'react';
import {useEditAssigneeModalContext} from '../EditAssigneeModal/EditAssigneeModal';
import {
  StyledSelectedAssigneeDisplayer,
  StyledSelectedAssigneeNameText,
} from './StyledComponentQADetail';

import {
  FadeInLeft,
  FadeOutLeft,
  LinearTransition,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/AntDesign';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import DoxleAnimatedButton from '../../../DesignPattern/DoxleButton/DoxleAnimatedButton';

type Props = {};

const SelectedAssigneeDisplayer = (props: Props) => {
  const {selectedAssignee, handleRemoveAssignee} =
    useEditAssigneeModalContext();
  const {THEME_COLOR, doxleFontSize} = useDOXLETheme();

  return (
    <StyledSelectedAssigneeDisplayer
      entering={FadeInLeft}
      exiting={FadeOutLeft}
      layout={LinearTransition.springify().damping(16)}>
      <StyledSelectedAssigneeNameText>
        {selectedAssignee && selectedAssignee.assigneeName}
      </StyledSelectedAssigneeNameText>
      <DoxleAnimatedButton
        style={[styles.removeBtn]}
        hitSlop={20}
        onPress={handleRemoveAssignee}>
        <Icon
          name="closecircle"
          size={doxleFontSize.headTitleTextSize}
          color={THEME_COLOR.primaryFontColor}
        />
      </DoxleAnimatedButton>
    </StyledSelectedAssigneeDisplayer>
  );
};

export default SelectedAssigneeDisplayer;

const styles = StyleSheet.create({
  removeBtn: {
    marginLeft: 8,
    padding: 0,

    alignItems: 'center',
    justifyContent: 'center',
  },
});
