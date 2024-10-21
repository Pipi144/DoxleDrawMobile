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
import React, {useEffect} from 'react';
import Modal from 'react-native-modal/dist/modal';
import {LinearTransition} from 'react-native-reanimated';
import {
  StyledQAListMenuBtn,
  StyledQAListMenuBtnText,
  StyledQAListMenuModal,
  StyledQAListMenuTitleText,
  StyledQAListMenuTopSection,
} from './StyledComponentsProjectQAList';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {QAList} from '../../../../Models/qa';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../../../Providers/OrientationContext';
import {DoxlePDFIcon} from '../../../DesignPattern/DoxleIcons';

type Props = {
  editedQAList: QAList | undefined;
  setEditedQAList: React.Dispatch<React.SetStateAction<QAList | undefined>>;
};

const QAListMenuModal = ({editedQAList, setEditedQAList}: Props) => {
  const {staticMenuColor, THEME_COLOR} = useDOXLETheme();
  const {deviceSize} = useOrientation();

  return (
    <Modal
      isVisible={editedQAList !== undefined}
      hasBackdrop={true}
      backdropColor={staticMenuColor.staticBackdrop}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      onBackdropPress={() => setEditedQAList(undefined)}
      animationIn="slideInUp"
      animationOut="fadeOutDownBig"
      deviceHeight={deviceSize.deviceHeight}
      deviceWidth={deviceSize.deviceWidth}
      animationInTiming={200}
      animationOutTiming={300}
      style={{
        position: 'relative',
        margin: 0,
        padding: 0,
        width: '100%',
        height: '100%',
      }}>
      <StyledQAListMenuModal
        layout={LinearTransition.springify()
          .damping(16)
          .mass(0.7)
          .stiffness(144)}>
        <StyledQAListMenuTopSection>
          <StyledQAListMenuTitleText>
            {editedQAList?.defectListTitle ?? ''}
          </StyledQAListMenuTitleText>
        </StyledQAListMenuTopSection>

        <StyledQAListMenuBtn>
          <FeatherIcon
            name="edit"
            color={staticMenuColor.staticWhiteFontColor}
            size={25}
          />
          <StyledQAListMenuBtnText>Edit</StyledQAListMenuBtnText>
        </StyledQAListMenuBtn>

        <StyledQAListMenuBtn>
          <FA5Icon
            name="signature"
            color={staticMenuColor.staticWhiteFontColor}
            size={20}
          />
          <StyledQAListMenuBtnText>Add Signature</StyledQAListMenuBtnText>
        </StyledQAListMenuBtn>

        <StyledQAListMenuBtn>
          <DoxlePDFIcon containerStyle={{width: 25}} />
          <StyledQAListMenuBtnText>Add Signature</StyledQAListMenuBtnText>
        </StyledQAListMenuBtn>
      </StyledQAListMenuModal>
    </Modal>
  );
};

export default QAListMenuModal;

const styles = StyleSheet.create({});
