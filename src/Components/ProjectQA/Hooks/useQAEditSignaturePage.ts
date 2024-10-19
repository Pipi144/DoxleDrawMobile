import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {SignatureViewRef} from 'react-native-signature-canvas';

import {shallow} from 'zustand/shallow';
import {QAList} from '../../../../../../Models/qa';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../../Providers/NotificationProvider';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../../../GeneralComponents/Notification/Notification';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useCacheQAContext} from '../../../../../../Providers/CacheQAProvider/CacheQAProvider';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import QAQueryAPI from '../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';
import {useDOXLETheme} from '../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useProjectQAStore} from '../Store/useProjectQAStore';
import {useNavigationMenuStore} from '../../../../../../GeneralStore/useNavigationMenuStore';

type Props = {
  signatureScreenRef: React.RefObject<SignatureViewRef>;
  qaListItem: QAList;
};
interface QAEditSignaturePage {
  onEndDrawing: () => void;
  handleCaptureSignature: (signature: any) => Promise<void>;
  handleClearSignature: () => void;
  finalSignaturePath: string | undefined;
  handleSaveSignature: () => Promise<void>;
  isUpdatingSignature: boolean;
}
const useQAEditSignaturePage = ({
  signatureScreenRef,
  qaListItem,
}: Props): QAEditSignaturePage => {
  const [finalSignaturePath, setFinalSignaturePath] = useState<
    string | undefined
  >(undefined);
  const {accessToken, user} = useAuth();
  const {notifierRootAppRef} = useNotification();
  //handle show notification
  const showNotification = useCallback(
    (
      message: string,
      messageType: 'success' | 'error',
      extraMessage?: string,
    ) => {
      notifierRootAppRef.current?.showNotification({
        title: message,
        description: extraMessage,
        Component: Notification,
        queueMode: 'immediate',
        duration: 800,
        componentProps: {
          type: messageType,
        },
        containerStyle: getContainerStyleWithTranslateY,
      });
    },
    [],
  );

  const {company} = useCompany();
  const {
    handleCreateSignatureFile,
    handleGetCachedQAListSignatureFile,
    handleDeleteCachedQAListSignatureFile,
  } = useCacheQAContext();
  const navigation = useNavigation();
  const onErrorSaveSignatureCb = () => {
    handleDeleteCachedQAListSignatureFile(qaListItem);
  };
  const onSuccessSaveSignatureCb = () => {
    setFinalSignaturePath(undefined);
    if (navigation.canGoBack()) navigation.goBack();
  };
  const updateQAListsignature = QAQueryAPI.useUpdateQAListSignatureQuery({
    showNotification,
    accessToken,
    company,
    onErrorCb: onErrorSaveSignatureCb,
    onSuccessCB: onSuccessSaveSignatureCb,
  });

  const handleGetInitialSignature = async () => {
    try {
      const cachedSignature = await handleGetCachedQAListSignatureFile(
        qaListItem,
      );
      if (cachedSignature) setFinalSignaturePath(cachedSignature);
    } catch (error) {
      console.log('ERROR handleGetInitialSignature:', error);
    }
  };

  const {addQANavItem} = useProjectQAStore(
    state => ({addQANavItem: state.addQANavItem}),
    shallow,
  );
  useFocusEffect(
    useCallback(() => {
      handleGetInitialSignature();
      addQANavItem({
        routeKey: 'projectQaEditSignatureScreen',
        routeName: 'Add Signature',
        routeParams: {qaListItem},
      });

      return () => {
        setTimeout(() => {}, 200);
      };
    }, []),
  );

  const onEndDrawing = () => {
    if (signatureScreenRef.current) {
      signatureScreenRef.current.readSignature();

      signatureScreenRef.current.getData();
    }
  };

  const handleCaptureSignature = async (signature: any) => {
    try {
      setFinalSignaturePath(signature);
    } catch (error) {
      console.log('ERROR SAVE SIGNATURE');
      return;
    }
  };
  const {THEME_COLOR} = useDOXLETheme();
  const handleClearSignature = () => {
    setFinalSignaturePath(undefined);
    if (signatureScreenRef.current) {
      signatureScreenRef.current.undo();
      signatureScreenRef.current.changePenColor(THEME_COLOR.primaryFontColor);
    }
  };

  const handleSaveSignature = async () => {
    try {
      if (finalSignaturePath) {
        console.log('finalSignaturePath:', finalSignaturePath);
        const saveLocalSignatureResult = await handleCreateSignatureFile({
          qaList: qaListItem,
          signatureData: finalSignaturePath,
        });
        console.log('saveLocalSignatureResult:', saveLocalSignatureResult);
        if (saveLocalSignatureResult)
          updateQAListsignature.mutate({
            qaList: qaListItem,
            signaturePath: saveLocalSignatureResult,
          });
        else showNotification('Unable To Process File!', 'error');
      }
    } catch (error) {
      console.log('ERROR handleSaveSignature:', error);
    }
  };
  return {
    onEndDrawing,
    handleCaptureSignature,
    handleClearSignature,
    finalSignaturePath,
    handleSaveSignature,
    isUpdatingSignature: updateQAListsignature.isLoading,
  };
};

export default useQAEditSignaturePage;

const styles = StyleSheet.create({});
