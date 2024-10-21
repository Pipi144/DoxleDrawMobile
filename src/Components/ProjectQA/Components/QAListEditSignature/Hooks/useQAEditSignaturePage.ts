import React, {useCallback, useState} from 'react';
import {SignatureViewRef} from 'react-native-signature-canvas';

import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {QAList} from '../../../../../Models/qa';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../../../DesignPattern/Notification/Notification';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useCacheQAContext} from '../../../Provider/CacheQAProvider';
import QAQueryAPI from '../../../../../API/qaQueryAPI';
import {useDOXLETheme} from '../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';

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

  useFocusEffect(
    useCallback(() => {
      handleGetInitialSignature();

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
        const saveLocalSignatureResult = await handleCreateSignatureFile({
          qaList: qaListItem,
          signatureData: finalSignaturePath,
        });

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
    isUpdatingSignature: updateQAListsignature.isPending,
  };
};

export default useQAEditSignaturePage;
