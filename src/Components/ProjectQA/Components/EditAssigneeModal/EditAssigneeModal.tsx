import {Platform, StyleSheet, View} from 'react-native';
import React, {createContext, useContext, useRef} from 'react';
import Modal from 'react-native-modal';

import {
  StyledEditAssigneeHeadTitleText,
  StyledEditAssigneeModalContainer,
  StyledSaveDocketBtnText,
} from './StyledComponentEditAssigneeModal';

import Icon from 'react-native-vector-icons/AntDesign';

import AssigneeSearchSection from './AssigneeSearchSection';
import {NotifierRoot} from 'react-native-notifier';
import AssigneeList from './AssigneeList';

import SelectedAssigneeDisplayer from '../QADetail/SelectedAssigneeDisplayer';
import useEditAssigneeModal, {
  QASelectedAssignee,
} from './Hooks/useEditAssigneeModal';
import Animated, {
  FadeInUp,
  FadeOutUp,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import {QA, QAList} from '../../../../Models/qa';
import {Contact} from '../../../../Models/contacts';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import DoxleAnimatedButton from '../../../DesignPattern/DoxleButton/DoxleAnimatedButton';
import {editRgbaAlpha} from '../../../../Utilities/FunctionUtilities';

type Props = {
  showModal: boolean;
  handleCloseModal: () => void;
  qaItem?: QA | QAList;
  handleUpdateAssignee: (
    selectedAssignee: QASelectedAssignee | undefined,
  ) => void;
};
interface EditAssigneeModalContext {
  handleCloseAddContactForm: () => void;
  notifierEditAssigneModalRef: React.RefObject<NotifierRoot>;
  selectedAssignee: QASelectedAssignee | undefined;
  handleSelectAssignee: (item: Contact) => void;
  handleRemoveAssignee: () => void;
}
const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const EditAssigneeModalContext = createContext({});
const EditAssigneeModal = ({
  showModal,
  handleCloseModal,
  handleUpdateAssignee,
  qaItem,
}: Props) => {
  const {THEME_COLOR} = useDOXLETheme();

  const {deviceSize} = useOrientation();

  const {
    searchAssigneeText,
    showAddAssigneeForm,
    handleSearchAssigneeTextChange,
    handleToggleAssigneeForm,
    handleCloseAddContactForm,

    handleSelectAssignee,
    selectedAssignee,
    handleRemoveAssignee,
    isAssigneeChanged,
    handlePressSaveBtn,
    handlePressCloseBtn,
  } = useEditAssigneeModal({
    qaItem,
    handleUpdateAssignee,
    handleCloseModal,
    showModal,
  });
  const notifierEditAssigneModalRef = useRef<NotifierRoot>(null);
  const editAssigneeContextValue: EditAssigneeModalContext = {
    handleCloseAddContactForm,
    notifierEditAssigneModalRef,
    selectedAssignee,
    handleSelectAssignee,
    handleRemoveAssignee,
  };
  return (
    <EditAssigneeModalContext.Provider value={editAssigneeContextValue}>
      <Modal
        isVisible={showModal}
        hasBackdrop={true}
        backdropColor={THEME_COLOR.primaryBackdropColor}
        onBackdropPress={handleCloseModal}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        animationInTiming={200}
        animationOutTiming={200}
        supportedOrientations={['landscape', 'portrait']}
        backdropTransitionOutTiming={0}
        avoidKeyboard
        style={{justifyContent: 'flex-end', margin: 0}}>
        <StyledEditAssigneeModalContainer
          $insetBottom={Platform.OS === 'ios' ? deviceSize.insetBottom : 8}
          $insetTop={Platform.OS === 'ios' ? deviceSize.insetTop : 8}>
          <View style={styles.menuBtnContainer}>
            <DoxleAnimatedButton
              style={[styles.closeBtn]}
              backgroundColor={'rgba(0, 0, 0, 0)'}
              onPress={handlePressCloseBtn}
              hitSlop={14}>
              {!showAddAssigneeForm && (
                <AnimatedIcon
                  entering={ZoomIn}
                  exiting={ZoomOut}
                  name="close"
                  size={30}
                  color={THEME_COLOR.primaryFontColor}
                />
              )}
              {showAddAssigneeForm && (
                <AnimatedIcon
                  entering={ZoomIn}
                  exiting={ZoomOut}
                  name="left"
                  size={30}
                  color={THEME_COLOR.primaryFontColor}
                />
              )}
            </DoxleAnimatedButton>
          </View>

          {!showAddAssigneeForm && (
            <StyledEditAssigneeHeadTitleText
              entering={FadeInUp}
              exiting={FadeOutUp}>
              Select Assignee ...
            </StyledEditAssigneeHeadTitleText>
          )}
          <View style={styles.contentWrapper}>
            <AssigneeSearchSection
              handleSearchTextChange={handleSearchAssigneeTextChange}
              showAddAssigneeForm={showAddAssigneeForm}
              handleToggleAssigneeForm={handleToggleAssigneeForm}
            />

            {selectedAssignee && !showAddAssigneeForm && (
              <SelectedAssigneeDisplayer />
            )}
            <AssigneeList
              searchAssigneeText={searchAssigneeText}
              showAddAssigneeForm={showAddAssigneeForm}
            />
          </View>
          {!showAddAssigneeForm && (
            <DoxleAnimatedButton
              style={styles.saveBtn}
              backgroundColor={THEME_COLOR.primaryFontColor}
              disabled={!isAssigneeChanged}
              onPress={handlePressSaveBtn}
              disabledColor={editRgbaAlpha({
                rgbaColor: THEME_COLOR.primaryFontColor,
                alpha: '0.4',
              })}>
              <StyledSaveDocketBtnText
                style={{
                  color: !isAssigneeChanged
                    ? THEME_COLOR.primaryReverseFontColor
                    : 'white',
                }}>
                Save
              </StyledSaveDocketBtnText>
            </DoxleAnimatedButton>
          )}
        </StyledEditAssigneeModalContainer>
        <NotifierRoot ref={notifierEditAssigneModalRef} />
      </Modal>
    </EditAssigneeModalContext.Provider>
  );
};
export const useEditAssigneeModalContext = () =>
  useContext(EditAssigneeModalContext) as EditAssigneeModalContext;
export default EditAssigneeModal;

const styles = StyleSheet.create({
  closeBtn: {
    justifyContent: 'center',
    alignItems: 'center',

    padding: 4,
  },
  menuBtnContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveBtn: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 800,
    display: 'flex',
    minWidth: 300,
    flex: 1,
    paddingBottom: 10,
  },
});
