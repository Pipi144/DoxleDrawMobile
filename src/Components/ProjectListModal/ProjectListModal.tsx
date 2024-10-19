import {
  Platform,
  RefreshControl,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import Modal from 'react-native-modal';

import {NotifierRoot} from 'react-native-notifier';
import {useShallow} from 'zustand/react/shallow';
import Animated, {LinearTransition} from 'react-native-reanimated';
import {IFullProject, Project} from '../../Models/project';

import {useDOXLETheme} from '../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useOrientation} from '../../Providers/OrientationContext';
import ProjectListItem from './ProjectListItem';
import {useCompany} from '../../Providers/CompanyProvider';
import DoxleEmptyPlaceholder from '../DesignPattern/DoxleEmptyPlaceholder/DoxleEmptyPlaceholder';
import {
  EmptyProjectListBanner,
  ErrorFetchingBanner,
} from '../DesignPattern/DoxleBanners';
import {
  RootProjectListBottomModal,
  StyledProjectListTitleContainer,
  StyledProjectListTitleText,
  StyledProjectSectionHeaderText,
} from './StyledComponents';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import DoxleAnimatedButton from '../DesignPattern/DoxleButton/DoxleAnimatedButton';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {editRgbaAlpha} from '../../Utilities/FunctionUtilities';
import AddProjectSection from './AddProjectSection';
import useGetProjectList, {
  IProjectGroup,
} from '../../CustomHooks/GetQueryDataHooks/useGetProjectList';

type Props = {
  showModal: boolean;
  closeModal: () => void;
};
const AnimatedSectionList = Animated.createAnimatedComponent(
  SectionList<IFullProject, IProjectGroup>,
);
const ProjectListBottomModal = ({showModal, closeModal}: Props) => {
  const {THEME_COLOR, DOXLE_FONT} = useDOXLETheme();
  const {deviceSize, deviceType} = useOrientation();
  const {
    projectList,
    refetchProjectList,
    isRefetchingProjectList,
    isErrorFetchingProject,
    groupedProjectByStatus,
    handleFetchNextPageProject,
  } = useGetProjectList({});
  const {handleSelectProject} = useCompany();
  const listRef = useRef<Animated.FlatList<IFullProject>>(null);
  const groupListRef = useRef<SectionList<IFullProject, IProjectGroup>>(null);
  const handlePressProjectListItem = useCallback((project: Project) => {
    closeModal();

    //!TEMP: have to put set timeout to trigger the state due to heavy rerender causing lag! The modal will be closed first then trigger set state
    setTimeout(async () => {
      handleSelectProject(project);
    }, 400);
  }, []);
  const projectListModalNotifier = useRef<NotifierRoot>(null);
  //*render list
  const renderItem = useCallback(
    (props: {item: IFullProject; index: number}) => (
      <ProjectListItem
        project={props.item}
        handlePressProjectListItem={handlePressProjectListItem}
        projectListModalNotifier={projectListModalNotifier}
      />
    ),
    [handlePressProjectListItem],
  );
  const keyExtractor = useCallback(
    (item: IFullProject, index: number) => `${item.projectId}`,
    [],
  );
  const listEmptyComponent = useMemo(
    () => (
      <DoxleEmptyPlaceholder
        illustrationComponent={
          isErrorFetchingProject ? (
            <ErrorFetchingBanner themeColor={THEME_COLOR} />
          ) : (
            <EmptyProjectListBanner themeColor={THEME_COLOR} />
          )
        }
        headTitleText={
          isErrorFetchingProject ? 'Something wrong!' : 'No Projects found'
        }
        subTitleText={
          isErrorFetchingProject
            ? 'Failed to get projects, please pull down to refresh!'
            : 'Add a project to start your management...'
        }
      />
    ),
    [isErrorFetchingProject, THEME_COLOR],
  );

  const renderProjectSectionHeader = useCallback(
    (info: {section: IProjectGroup}) => (
      <StyledProjectSectionHeaderText>
        {info.section.projectStatusName}
      </StyledProjectSectionHeaderText>
    ),
    [],
  );
  const layout = LinearTransition.springify().damping(16);
  return (
    <Modal
      isVisible={showModal}
      hasBackdrop={true}
      backdropColor={THEME_COLOR.primaryBackdropColor}
      onBackdropPress={closeModal}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      animationInTiming={400}
      animationOutTiming={300}
      propagateSwipe={true}
      supportedOrientations={['landscape', 'portrait']}
      backdropTransitionOutTiming={0}
      // avoidKeyboard={Platform.OS === 'android' ? true : false}
      style={{
        justifyContent: 'flex-end',
        margin: 0,
        // position: 'absolute',
        flex: 1,

        display: 'flex',
      }}>
      <GestureHandlerRootView style={{flex: 1}}>
        <RootProjectListBottomModal>
          <StyledProjectListTitleContainer>
            <View
              style={{
                paddingHorizontal: 14,
                height: '80%',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'flex-start',
                backgroundColor: THEME_COLOR.doxleColor,

                borderRadius: 4,
              }}>
              <StyledProjectListTitleText>
                Project Menu
              </StyledProjectListTitleText>
            </View>

            <DoxleAnimatedButton
              onPress={closeModal}
              style={{
                height: '80%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              hitSlop={14}>
              <AntIcon
                name="close"
                color={editRgbaAlpha({
                  rgbaColor: THEME_COLOR.primaryFontColor,
                  alpha: '0.5',
                })}
                size={deviceType === 'Smartphone' ? 30 : 34}
              />
            </DoxleAnimatedButton>
          </StyledProjectListTitleContainer>
          <AddProjectSection
            // setShowProjectList={setShowProjectList}
            listRef={listRef}
            projectListModalNotifier={projectListModalNotifier}
            closeModal={closeModal}
          />
          <AnimatedSectionList
            style={styles.listStyle}
            showsVerticalScrollIndicator={false}
            ref={groupListRef}
            sections={groupedProjectByStatus}
            layout={layout}
            contentContainerStyle={{flexGrow: 1}}
            refreshControl={
              <RefreshControl
                refreshing={isRefetchingProjectList}
                onRefresh={refetchProjectList}
                tintColor={
                  Platform.OS === 'ios'
                    ? THEME_COLOR.primaryFontColor
                    : undefined
                }
                colors={
                  Platform.OS === 'android'
                    ? [THEME_COLOR.primaryFontColor]
                    : undefined
                }
                progressBackgroundColor={THEME_COLOR.primaryContainerColor}
              />
            }
            renderSectionHeader={renderProjectSectionHeader}
            removeClippedSubviews={false}
            onEndReached={handleFetchNextPageProject}
            initialNumToRender={10}
            windowSize={5}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={listEmptyComponent}
            automaticallyAdjustKeyboardInsets
            automaticallyAdjustsScrollIndicatorInsets
            automaticallyAdjustContentInsets
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        </RootProjectListBottomModal>
      </GestureHandlerRootView>

      <NotifierRoot ref={projectListModalNotifier} />
    </Modal>
  );
};

export default ProjectListBottomModal;
const styles = StyleSheet.create({
  listStyle: {flex: 1, width: '100%'},
});
