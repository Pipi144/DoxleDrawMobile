import {StyleSheet} from 'react-native';
import React, {useCallback} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TProjectFileTabStack} from './ProjectFileRouteTypes';

import ProjectFileDisplayer from '../Components/ProjectFileDisplayer/ProjectFileDisplayer';
import ProjectFileInsideFolderScreen from '../Components/ProjectFileInsideFolderScreen/ProjectFileInsideFolderScreen';
import ProjectNewFolderScreen from '../Components/ProjectNewFolderScreen/ProjectNewFolderScreen';

import ProjectFileRenameScreen from '../Components/ProjectFileRenameScreen/ProjectFileRenameScreen';
import ProjectFileViewerScreen from '../Components/ProjectFileViewerScreen/ProjectFileViewerScreen';
import ProjectFileHistoryScreen from '../Components/ProjectFileHistoryScreen/ProjectFileHistoryScreen';

import {useShallow} from 'zustand/react/shallow';
import {useFocusEffect} from '@react-navigation/native';
import {useDOXLETheme} from '../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {useAppModalHeaderStore} from '../../../GeneralStore/useAppModalHeaderStore';

type Props = {};
const FileStack = createNativeStackNavigator<TProjectFileTabStack>();
const ProjectFilesRoute = (props: Props) => {
  const {THEME_COLOR} = useDOXLETheme();
  const {setCustomisedPopupMenu, setOveridenRouteName, setBackBtn} =
    useAppModalHeaderStore(
      useShallow(state => ({
        setCustomisedPopupMenu: state.setCustomisedPopupMenu,
        setOveridenRouteName: state.setOveridenRouteName,
        setBackBtn: state.setBackBtn,
      })),
    );

  useFocusEffect(
    useCallback(() => {
      return () => {
        setCustomisedPopupMenu(null);
        setOveridenRouteName(undefined);
        setBackBtn(null);
      };
    }, []),
  );
  return (
    <FileStack.Navigator
      initialRouteName={'RootProjectFile'}
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: THEME_COLOR.primaryContainerColor,
        },
        freezeOnBlur: true,
      }}>
      <FileStack.Screen
        name="RootProjectFile"
        component={ProjectFileDisplayer}
        options={{
          freezeOnBlur: true,
        }}
      />

      <FileStack.Group
        screenOptions={{
          headerShown: false,
          presentation: 'card',
          gestureEnabled: false,
          freezeOnBlur: true,
        }}>
        <FileStack.Screen
          name="ProjectFolderFileScreen"
          component={ProjectFileInsideFolderScreen}
        />

        <FileStack.Screen
          name="ProjectNewFolderScreen"
          component={ProjectNewFolderScreen}
        />

        <FileStack.Screen
          name="ProjectFileHistoryScreen"
          component={ProjectFileHistoryScreen}
        />

        <FileStack.Screen
          name="ProjectFileRenameScreen"
          component={ProjectFileRenameScreen}
        />
      </FileStack.Group>
      <FileStack.Group
        screenOptions={{
          headerShown: false,
          presentation: 'containedModal',

          animation: 'fade',
        }}>
        <FileStack.Screen
          name="ProjectFileViewerScreen"
          component={ProjectFileViewerScreen}
        />
      </FileStack.Group>
    </FileStack.Navigator>
  );
};

export default ProjectFilesRoute;

const styles = StyleSheet.create({});
