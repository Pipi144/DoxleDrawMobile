import {StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';

import {shallow} from 'zustand/shallow';
import Share from 'react-native-share';
import {QAList, TQAStatus} from '../../../../../../Models/qa';
import {Contact} from '../../../../../../Models/contacts';
import {useAuth} from '../../../../../../Providers/AuthProvider';
import {useCompany} from '../../../../../../Providers/CompanyProvider';
import {useNotification} from '../../../../../../Providers/NotificationProvider';
import {useCacheQAContext} from '../../../../../../Providers/CacheQAProvider/CacheQAProvider';
import {useProjectStore} from '../../../Store/useProjectStore';
import QAQueryAPI from '../../../../../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';
import {useQAViewPDFContext} from '../Components/QAViewPdf/QAViewPDF';
import {readFile} from 'react-native-fs';
type Props = {
  qaListItem: QAList;
  setDisplayedPdfPath: React.Dispatch<React.SetStateAction<string | undefined>>;

  initialAssignee?: Contact;
  initialStatus?: TQAStatus;
};

interface PdfTopSection {
  selectedAssignee: Contact | undefined;
  handleGenerateQAReportForAssignee: (assignee?: Contact) => void;
  isCreatingPdf: boolean;
  shareFilePath: string | undefined;
  handleShareFile: () => Promise<void>;
}

const usePdfTopSection = ({
  qaListItem,
  setDisplayedPdfPath,

  initialAssignee,
  initialStatus,
}: Props): PdfTopSection => {
  const [selectedAssignee, setSelectedAssignee] = useState<Contact | undefined>(
    undefined,
  );
  const [shareFilePath, setShareFilePath] = useState<string | undefined>(
    undefined,
  );
  const {accessToken} = useAuth();
  const {company} = useCompany();
  const {serverGeneratedURL, setServerGeneratedURL, displayedPdfPath} =
    useQAViewPDFContext();
  const {showNotification} = useNotification();
  //handle show notification

  const {handleCreateTempPdf} = useCacheQAContext();

  const {selectedProject} = useProjectStore(
    state => ({
      selectedProject: state.selectedProject,
    }),
    shallow,
  );

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

  useEffect(() => {
    if (initialAssignee || initialStatus) {
      console.log(
        'GENERATE PDF WHEN ASSIGNNEE OR STATUS PASSED IN:',
        'ASSIGNEE/',
        initialAssignee?.firstName,
        '-STATUS:',
        initialStatus,
      );
      if (initialAssignee)
        handleGenerateQAReportForAssignee(initialAssignee, undefined);
      else handleGenerateQAReportForAssignee(undefined, initialStatus);
    }
  }, []);
  return {
    selectedAssignee,
    handleGenerateQAReportForAssignee,
    isCreatingPdf: sharePdfQuery.isLoading,
    shareFilePath,
    handleShareFile,
  };
};

export default usePdfTopSection;

const styles = StyleSheet.create({});
