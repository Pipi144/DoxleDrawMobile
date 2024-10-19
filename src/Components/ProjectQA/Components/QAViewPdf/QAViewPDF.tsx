import {StyleSheet, View} from 'react-native';
import React, {createContext, useContext, useMemo, useRef} from 'react';
import Pdf from 'react-native-pdf';
import {ActivityIndicator} from 'react-native-paper';

import {useRoute} from '@react-navigation/native';

import {LinearTransition} from 'react-native-reanimated';
import {useDOXLETheme} from '../../../../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import useQAViewPDFPage from '../../Hooks/useQAViewPDFPage';
import {
  StyledPDFContentWrapper,
  StyledPdfWrapper,
  StyledQAViewPDFPageContainer,
} from './StyledComponentQAViewPdf';
import UploadingPrompt from './UploadingPrompt';
import PdfTopSection from './PdfTopSection';
import ListLoadingMoreBottom from '../../../../../../../Utilities/AnimationScreens/ListLoadingMoreBottom/ListLoadingMoreBottom';
import PdfThumbnailList from './PdfThumbnailList';
import PdfPageSkeleton from './PdfPageSkeleton';
import QATopNavSection from '../QATopNavSection';
import {useOrientation} from '../../../../../../../Providers/OrientationContext';
import DoxleEmptyPlaceholder from '../../../../../../DesignPattern/DoxleEmptyPlaceholder/DoxleEmptyPlaceholder';
import {TQATabStack} from '../../Routes/QARouteType';

type Props = {
  navigation: any;
};

interface IQAViewPDFContextValue {
  serverGeneratedURL: string | undefined;
  setServerGeneratedURL: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  pdfViewerRef: React.RefObject<Pdf>;
  displayedPdfPath: string | undefined;
  currentViewedPage: number;
  setCurrentViewedPage: React.Dispatch<React.SetStateAction<number>>;
}
const QAViewPDFContext = createContext<IQAViewPDFContextValue | null>(null);
const QAViewPDF = (props: Props) => {
  const router = useRoute();
  const {qaListItem, selectedAssignee, selectedStatus} =
    router.params as TQATabStack['QAExportPDF'];
  const {isPortraitMode, deviceType} = useOrientation();
  const {THEME_COLOR} = useDOXLETheme();
  const pdfViewerRef = useRef<Pdf>(null);
  const {
    displayedPdfPath,
    isGeneratingPdf,
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
  } = useQAViewPDFPage({
    qaListItem,
    pdfViewerRef,
    initialAssignee: selectedAssignee,
    initialStatus: selectedStatus,
  });

  const contextValue: IQAViewPDFContextValue = useMemo(
    () => ({
      serverGeneratedURL,
      setServerGeneratedURL,

      pdfViewerRef,
      currentViewedPage,
      setCurrentViewedPage,
      displayedPdfPath,
    }),
    [
      serverGeneratedURL,
      pdfViewerRef.current,
      currentViewedPage,
      displayedPdfPath,
    ],
  );
  return (
    <QAViewPDFContext.Provider value={contextValue}>
      <StyledQAViewPDFPageContainer>
        <View style={styles.navWrapper}>
          <QATopNavSection />
        </View>

        {showPromtPendingUpload && (
          <UploadingPrompt
            initialCountUploadItemsInProgress={
              initialCountUploadItemsInProgress
            }
            setShowPromtPendingUpload={setShowPromtPendingUpload}
          />
        )}

        <View
          style={{
            ...styles.contentWrapper,
            flexDirection: isPortraitMode ? 'column' : 'row',
          }}>
          {!isPortraitMode && displayedPdfPath && !isGeneratingPdf && (
            <PdfThumbnailList
              pdfPath={displayedPdfPath}
              currentViewedPage={currentViewedPage}
            />
          )}
          <StyledPDFContentWrapper
            $isPortraitMode={isPortraitMode}
            layout={LinearTransition.springify().damping(16)}>
            <PdfTopSection
              qaListItem={qaListItem}
              setDisplayedPdfPath={setDisplayedPdfPath}
              countUploadItemsInProgress={countUploadItemsInProgress}
              initialCountUploadItemsInProgress={
                initialCountUploadItemsInProgress
              }
              initialAssignee={selectedAssignee}
              initialStatus={selectedStatus}
            />

            {!isGeneratingPdf && (
              <StyledPdfWrapper
                layout={LinearTransition.springify().damping(14)}>
                {displayedPdfPath ? (
                  <Pdf
                    ref={pdfViewerRef}
                    source={{
                      uri: displayedPdfPath,
                      cache: false,
                      expiration: 0,
                    }}
                    onPageChanged={page => {
                      setCurrentViewedPage(page - 1);
                    }}
                    style={{
                      backgroundColor: THEME_COLOR.primaryContainerColor,
                      width: '100%',
                      height: '100%',
                      paddingVertical: 10,
                      zIndex: 0,
                    }}
                    renderActivityIndicator={() => (
                      <ActivityIndicator
                        animating
                        hidesWhenStopped
                        size={deviceType === 'Smartphone' ? 16 : 19}
                      />
                    )}
                    enablePaging={true}
                  />
                ) : (
                  <DoxleEmptyPlaceholder
                    headTitleText="PDF QA Report!"
                    subTitleText="Generate a report with a selected user or a full report!"
                  />
                )}
              </StyledPdfWrapper>
            )}

            {isRegeneratingPdf && (
              <ListLoadingMoreBottom
                size={40}
                containerStyle={{
                  width: '100%',
                  marginVertical: 14,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            )}

            {isGeneratingPdf && <PdfPageSkeleton />}
          </StyledPDFContentWrapper>

          {isPortraitMode && displayedPdfPath && !isGeneratingPdf && (
            <PdfThumbnailList
              pdfPath={displayedPdfPath!}
              currentViewedPage={currentViewedPage}
            />
          )}
        </View>
      </StyledQAViewPDFPageContainer>
    </QAViewPDFContext.Provider>
  );
};

export const useQAViewPDFContext = () =>
  useContext(QAViewPDFContext) as IQAViewPDFContextValue;
export default QAViewPDF;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    backgroundColor: 'green',
  },
  navWrapper: {
    width: '100%',
    display: 'flex',
    paddingHorizontal: 14,
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    display: 'flex',
    position: 'relative',
  },
});
