import React from 'react';
import Modal from 'react-native-modal/dist/modal';

import {StyleSheet} from 'react-native';

import {StyledEditProjectFileModal} from './StyledComponentEditProjectFileModal';
import ProjectFileModalContent from './ProjectFileModalContent';
import {useProjectFileStore} from '../../Store/useProjectFileStore';
import {useShallow} from 'zustand/react/shallow';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

type Props = {};

const EditProjectFileModal = ({}: Props) => {
  const {THEME_COLOR} = useDOXLETheme();

  const {showModal, setCurrentFile, setShowModal, setEdittedFolder} =
    useProjectFileStore(
      useShallow(state => ({
        currentFile: state.currentFile,
        showModal: state.showModal,
        currentFolder: state.currentFolder,
        setCurrentFile: state.setCurrentFile,
        setShowModal: state.setShowModal,
        setEdittedFolder: state.setEdittedFolder,
      })),
    );

  const onCloseModal = () => {
    setShowModal(false);
    setCurrentFile(undefined);
    setEdittedFolder(undefined);
  };

  return (
    <Modal
      isVisible={showModal}
      hasBackdrop={showModal}
      backdropColor={THEME_COLOR.primaryReverseBackdropColor}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      supportedOrientations={['portrait', 'landscape']}
      onBackdropPress={onCloseModal}
      animationIn="bounceInUp"
      animationOut="bounceOutDown"
      animationInTiming={200}
      animationOutTiming={100}
      style={styles.modalStyle}>
      <StyledEditProjectFileModal>
        <ProjectFileModalContent />
      </StyledEditProjectFileModal>
    </Modal>
  );
};

export default EditProjectFileModal;
const styles = StyleSheet.create({
  modalStyle: {
    justifyContent: 'flex-end',
    margin: 0,
    height: '100%',
    width: '100%',
  },
});
