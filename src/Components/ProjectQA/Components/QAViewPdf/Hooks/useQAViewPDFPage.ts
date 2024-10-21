import {Platform, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {useFocusEffect} from '@react-navigation/native';

import Pdf from 'react-native-pdf';
import {useProjectQAStore} from '../../../Store/useProjectQAStore';

import {useIsMutating} from '@tanstack/react-query';
import {useShallow} from 'zustand/react/shallow';
import {QAList, TQAStatus} from '../../../../../Models/qa';
import {Contact} from '../../../../../Models/contacts';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import {useCacheQAContext} from '../../../Provider/CacheQAProvider';
import QAQueryAPI, {
  CreatePdfForAssigneeParam,
  getPDFWithAssigneeMutationKey,
} from '../../../../../API/qaQueryAPI';

type Props = {
  qaListItem: QAList;
  pdfViewerRef: React.RefObject<Pdf>;
  initialAssignee?: Contact;
  initialStatus?: TQAStatus;
};

const useQAViewPDFPage = ({
  qaListItem,
  pdfViewerRef,
  initialAssignee,
  initialStatus,
}: Props) => {
  const [displayedPdfPath, setDisplayedPdfPath] = useState<string | undefined>(
    qaListItem.pdfPath,
  );
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

  const [showPromtPendingUpload, setShowPromtPendingUpload] = useState(false);

  const [serverGeneratedURL, setServerGeneratedURL] = useState<
    string | undefined
  >(qaListItem.pdfPath);

  const [currentViewedPage, setCurrentViewedPage] = useState(0);

  const {accessToken} = useAuth();
  const {company} = useCompany();

  const {showNotification} = useNotification();

  const {
    handleDownloadPdfFile,
    handleDeleteTempCachePdfFolder,
    uploadPendingFiles,
  } = useCacheQAContext();

  const onSuccessGeneratePdf = async (serverPath: string) => {
    setServerGeneratedURL(serverPath);

    try {
      const resultDownload = await handleDownloadPdfFile({
        qaList: qaListItem,
        pdfUrl: serverPath,
      });
      if (resultDownload) {
        setDisplayedPdfPath(undefined); //!due to the target path for the new pdf is downloaded and overwrite in the same file path, the state not triggering change
        setDisplayedPdfPath('file://' + resultDownload);
        // if (pdfViewerRef.current) pdfViewerRef.current.forceUpdate();
      }
    } catch (error) {
      setDisplayedPdfPath(serverPath);
      return;
    }
  };

  const generatePdfQuery = QAQueryAPI.useGenerateDefectListPdfQuery({
    company,
    showNotification,
    accessToken,

    onSuccessCb: onSuccessGeneratePdf,
  });
  const {handleGetCachedQAListPDFFile} = useCacheQAContext();

  const handleGetLocalPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      const result = await handleGetCachedQAListPDFFile(qaListItem);
      if (result) {
        setDisplayedPdfPath(
          Platform.OS === 'ios' ? 'file://' + result : result,
        );
      }
      // when there is no assignee or initial status
      else if (!initialAssignee && !initialStatus) {
        console.log('GENERATE PDF WHEN NO ASSIGNEE OR STATUS PASSED IN');
        generatePdfQuery.mutate(qaListItem.defectListId);
      }
    } catch (error) {
      console.log('ERROR GET PDF FILE IN SHARE PDF SCREEN');
      return;
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const {addQANavItem} = useProjectQAStore(
    useShallow(state => ({addQANavItem: state.addQANavItem})),
  );
  useFocusEffect(
    useCallback(() => {
      handleGetLocalPdf();
      // generatePdfQuery.refetch();
      addQANavItem({
        routeKey: 'projectQaExportPDFScreen',
        routeName: 'Export PDF',
        routeParams: {qaListItem},
      });

      return () => {
        handleDeleteTempCachePdfFolder();
      };
    }, []),
  );
  useEffect(() => {
    if (displayedPdfPath && pdfViewerRef.current) {
      console.log('displayedPdfPath:', displayedPdfPath);
      pdfViewerRef.current.forceUpdate();
    }
  }, [displayedPdfPath, pdfViewerRef.current]);

  const shouldDisplayError = useMemo(
    () => !displayedPdfPath && generatePdfQuery.isError,
    [displayedPdfPath, generatePdfQuery.isError],
  );
  const isGettingPDFWithQuery =
    useIsMutating({
      mutationKey: getPDFWithAssigneeMutationKey,
      predicate: query =>
        Boolean(
          (query.state.variables as CreatePdfForAssigneeParam).qaListId ===
            qaListItem.defectListId,
        ),
    }) > 0;
  const isRegeneratingPdf = Boolean(
    displayedPdfPath && (generatePdfQuery.isPending || isDownloadingPdf),
  );

  const countUploadItemsInProgress = useMemo(
    () =>
      uploadPendingFiles.reduce((acc, batch) => {
        return batch.qa.defectList === qaListItem.defectListId
          ? acc + batch.qaImages.length
          : acc;
      }, 0),
    [uploadPendingFiles],
  );

  const initialCountUploadItemsInProgress = useMemo(
    () =>
      uploadPendingFiles.reduce((acc, batch) => {
        return batch.qa.defectList === qaListItem.defectListId
          ? acc + batch.qaImages.length
          : acc;
      }, 0),
    [],
  );
  useEffect(() => {
    if (initialCountUploadItemsInProgress > 0) setShowPromtPendingUpload(true);
  }, [initialCountUploadItemsInProgress]);

  useEffect(() => {
    if (showPromtPendingUpload) {
      const timeout = setTimeout(() => {
        setShowPromtPendingUpload(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [showPromtPendingUpload]);

  return {
    displayedPdfPath,
    isGeneratingPdf:
      generatePdfQuery.isPending ||
      (isGettingPDFWithQuery && !displayedPdfPath),
    isErrorGeneratingPdf: generatePdfQuery.isError,
    shouldDisplayError,
    setDisplayedPdfPath,
    isRegeneratingPdf,
    showPromtPendingUpload,
    setShowPromtPendingUpload,
    countUploadItemsInProgress,
    initialCountUploadItemsInProgress,
    serverGeneratedURL,
    setServerGeneratedURL,

    currentViewedPage,
    setCurrentViewedPage,
  };
};

export default useQAViewPDFPage;

const styles = StyleSheet.create({});
