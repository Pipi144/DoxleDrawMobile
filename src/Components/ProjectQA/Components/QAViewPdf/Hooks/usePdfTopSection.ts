import {Easing, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import Share from 'react-native-share';

import {useQAViewPDFContext} from '../QAViewPDF';
import {QAList, TQAStatus} from '../../../../../Models/qa';
import {Contact} from '../../../../../Models/contacts';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import {useCacheQAContext} from '../../../Provider/CacheQAProvider';
import QAQueryAPI from '../../../../../API/qaQueryAPI';
import {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useOrientation} from '../../../../../Providers/OrientationContext';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
type Props = {
  qaListItem: QAList;
  setDisplayedPdfPath: React.Dispatch<React.SetStateAction<string | undefined>>;

  initialAssignee?: Contact;
  initialStatus?: TQAStatus;
  countUploadItemsInProgress: number;
  initialCountUploadItemsInProgress: number;
};

const usePdfTopSection = ({
  qaListItem,
  setDisplayedPdfPath,

  initialAssignee,
  initialStatus,
  countUploadItemsInProgress,
  initialCountUploadItemsInProgress,
}: Props) => {
  const [selectedAssignee, setSelectedAssignee] = useState<Contact | undefined>(
    undefined,
  );
  const [shareFilePath, setShareFilePath] = useState<string | undefined>(
    undefined,
  );
  const [openAssigneeModal, setOpenAssigneeModal] = useState(false);
  const {accessToken} = useAuth();
  const {deviceType} = useOrientation();
  const {company, selectedProject} = useCompany();
  const {serverGeneratedURL, setServerGeneratedURL, displayedPdfPath} =
    useQAViewPDFContext();
  const {showNotification} = useNotification();
  //handle show notification

  const {handleCreateTempPdf} = useCacheQAContext();

  const onSuccessGetFile = async (response: string) => {
    setServerGeneratedURL(response);

    try {
      if (response) {
        const resultWriteFile = await handleCreateTempPdf({
          data64: response,
          nameFile: selectedAssignee
            ? `${selectedAssignee.firstName}${
                selectedAssignee.lastName
              }-QAReport-${new Date().getMilliseconds()}.pdf`.replace(
                /\//g,
                '-',
              )
            : `${
                qaListItem.defectListTitle
              }-${new Date().getTime()}.pdf`.replace(/\//g, '-'),
        });
        if (resultWriteFile) {
          setDisplayedPdfPath('file://' + resultWriteFile);
        }
      }
    } catch (error) {
      console.log('ERROR onSuccessGetFile:', error);
    }
  };
  const sharePdfQuery = QAQueryAPI.useCreateQAPdfForAssigneeQuery({
    accessToken,
    company,
    showNotification,
    onSuccessCb: onSuccessGetFile,
  });

  const handleShareFile = async () => {
    try {
      if (serverGeneratedURL && displayedPdfPath) {
        // const base64Data = await readFile(
        //   decodeURIComponent(displayedPdfPath),
        //   'base64',
        // );
        const result = await Share.open({
          message: `${
            selectedProject ? selectedProject.siteAddress + '-' : ''
          }Works Required - Powered by Doxle`,
          url: displayedPdfPath,
          title: `Doxle QA`,
          type: 'application/pdf',
          filename: `${qaListItem.defectListTitle}`,

          email: selectedAssignee ? selectedAssignee.email : undefined,
          recipient: selectedAssignee ? selectedAssignee.phone : undefined,
          subject: `${
            selectedProject ? selectedProject.siteAddress + '-' : ''
          }Required QA Action`,
        });
        if (result.success) {
          console.log('SUCCESS ');
        }
        if (result.message) console.log('RESULT MESSAGE:', result.message);
      }
    } catch (error) {
      console.log('error handleShareFile:', error);
    }
  };

  const handleGenerateQAReportForAssignee = (
    assignee?: Contact,
    status?: TQAStatus,
  ) => {
    setSelectedAssignee(assignee);
    setShareFilePath(undefined);
    sharePdfQuery.mutate({
      qaListId: qaListItem.defectListId,
      assigneeId: assignee ? assignee.contactId : null,
      status,
    });
  };
  //* animation
  const dropdownIconAnimatedValue = useRef<SharedValue<number>>(
    useSharedValue(0),
  ).current;
  const dropdownIconAnimatedStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(
      dropdownIconAnimatedValue.value,
      [0, 1],
      [0, 180],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      },
    );
    return {
      transform: [
        {
          rotateZ: `${rotateZ}deg`,
        },
      ],
    };
  }, []);
  useEffect(() => {
    if (openAssigneeModal)
      dropdownIconAnimatedValue.value = withSpring(1, {damping: 16});
    else dropdownIconAnimatedValue.value = withSpring(0, {damping: 16});
  }, [openAssigneeModal]);
  const circularSize = deviceType === 'Smartphone' ? 30 : 40;
  const circularThickness = circularSize / 10;
  const circularRef = useRef<AnimatedCircularProgress>(null);
  useEffect(() => {
    circularRef.current?.animate(
      Math.floor(
        ((initialCountUploadItemsInProgress - countUploadItemsInProgress) /
          initialCountUploadItemsInProgress) *
          100,
      ),
      500,
      Easing.quad,
    );
  }, [countUploadItemsInProgress, initialCountUploadItemsInProgress]);
  useEffect(() => {
    if (initialAssignee || initialStatus) {
      if (initialAssignee)
        handleGenerateQAReportForAssignee(initialAssignee, undefined);
      else handleGenerateQAReportForAssignee(undefined, initialStatus);
    }
  }, []);
  return {
    selectedAssignee,
    handleGenerateQAReportForAssignee,
    isCreatingPdf: sharePdfQuery.isPending,
    shareFilePath,
    handleShareFile,
    openAssigneeModal,
    setOpenAssigneeModal,
    dropdownIconAnimatedStyle,
    displayedPdfPath,
    circularSize,
    circularThickness,
    circularRef,
  };
};

export default usePdfTopSection;

const styles = StyleSheet.create({});
