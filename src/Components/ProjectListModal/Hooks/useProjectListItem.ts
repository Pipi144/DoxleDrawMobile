import {GestureResponderEvent, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useShallow} from 'zustand/react/shallow';
import {IFullProject, Project} from '../../../Models/project';
import {NotifierRoot} from 'react-native-notifier';
import {useCompany} from '../../../Providers/CompanyProvider';
import {useAuth} from '../../../Providers/AuthProvider';
import Notification, {
  getContainerStyleWithTranslateY,
} from '../../DesignPattern/Notification/Notification';
import useGetProjectList from '../../../GetQueryDataHooks/useGetProjectList';
import ProjectQueryAPI, {
  getProjectMutationKey,
  IUpdateProjectQueryProps,
} from '../../../API/projectQueryAPI';
import {useIsMutating} from '@tanstack/react-query';

type Props = {
  project: Project;
  projectListModalNotifier: React.RefObject<NotifierRoot>;
};

const useProjectListItem = ({project, projectListModalNotifier}: Props) => {
  const [onEditProject, setOnEditProject] = useState(false);
  const [newAddressText, setnewAddressText] = useState('');
  const {company, selectedProject, handleSelectProject} = useCompany();
  const {accessToken} = useAuth();
  const {projectList} = useGetProjectList({});
  //handle show notification
  const showNotification = useCallback(
    (
      message: string,
      messageType: 'success' | 'error',
      extraMessage?: string,
      duration?: number,
    ) => {
      projectListModalNotifier.current?.showNotification({
        title: message,
        description: extraMessage,
        Component: Notification,
        queueMode: 'immediate',
        duration: duration ?? 1200,
        hideAnimationDuration: 1000,
        componentProps: {
          type: messageType,
        },
        containerStyle: getContainerStyleWithTranslateY,
      });
    },
    [],
  );

  const onSuccessDelete = (deletedId?: string) => {
    if (
      deletedId &&
      selectedProject &&
      selectedProject.projectId === deletedId
    ) {
      if (projectList.length > 1) handleSelectProject(projectList[0]);
      else handleSelectProject(undefined);
    } else if (projectList.length === 1) {
      handleSelectProject(undefined);
    }
  };
  const deleteProjectQuery = ProjectQueryAPI.useDeleteProjectQuery({
    showNotification,
    company,
    accessToken,
    onSuccessCb: onSuccessDelete,
  });

  const onSuccessUpdate = (newProject?: IFullProject) => {
    if (newProject) setnewAddressText(newProject.siteAddress);
  };
  const updateProjectQuery = ProjectQueryAPI.useUpdateProjectQuery({
    showNotification,
    company,
    accessToken,
    onSuccessUpdateCb: onSuccessUpdate,
  });
  const handleDeleteProject = () => {
    deleteProjectQuery.mutate(project.projectId);
  };

  const isDeletingProject =
    useIsMutating({
      mutationKey: getProjectMutationKey('delete'),
      predicate: query => query.state.variables === project.projectId,
    }) > 0;
  const isUpdatingProject =
    useIsMutating({
      mutationKey: getProjectMutationKey('update'),
      predicate: query =>
        (query.state.variables as IUpdateProjectQueryProps).projectId ===
        project.projectId,
    }) > 0;

  const handleLongPressAddressText = (e: GestureResponderEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setOnEditProject(true);
  };
  const handleEditAddress = () => {
    if (newAddressText) {
      updateProjectQuery.mutate({
        projectId: project.projectId,
        updateData: {
          siteAddress: newAddressText,
        },
      });
    }

    setOnEditProject(false);
  };
  return {
    handleDeleteProject,
    isDeletingProject,
    isUpdatingProject,
    onEditProject,
    newAddressText,
    setnewAddressText,
    handleLongPressAddressText,
    handleEditAddress,
    setOnEditProject,
  };
};

export default useProjectListItem;

const styles = StyleSheet.create({});
