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

import {useIsMutating, useMutationState} from '@tanstack/react-query';

import {useShallow} from 'zustand/react/shallow';
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Directions, Gesture} from 'react-native-gesture-handler';
import {useProjectFileStore} from '../../../Store/useProjectFileStore';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {
  AddFileMutateProps,
  getFileMutationKey,
} from '../../../../../API/fileQueryAPI';
import {useEffect} from 'react';

const useUploadIndicator = () => {
  const {selectedProject} = useCompany();
  const {currentFolder} = useProjectFileStore(
    useShallow(state => ({
      currentFolder: state.currentFolder,
    })),
  );

  const translateX = useSharedValue(0);
  const skewX = useSharedValue(0);
  const fling = Gesture.Fling()
    .direction(Directions.RIGHT)

    .onStart(event => {
      translateX.value = withSpring(500, {
        damping: 16,
        stiffness: 200,
        overshootClamping: true,
      });
    })
    .runOnJS(true);
  const tap = Gesture.Tap().onStart(event => {
    skewX.value = withSequence(
      withSpring(4, {
        damping: 16,
        stiffness: 300,
        mass: 0.2,
      }),
      withTiming(
        -10,
        {
          duration: 50,
        },
        finished => {
          if (finished) {
            translateX.value = withTiming(
              500,
              {
                duration: 200,
              },
              finished => {
                if (finished) skewX.value = 0;
              },
            );
          }
        },
      ),
    );
  });

  const composed = Gesture.Race(fling, tap);
  const boxAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}, {skewX: `${skewX.value}deg`}],
  }));
  const isCurrentUploadingFiles =
    useIsMutating({
      mutationKey: getFileMutationKey('add'),
      predicate: query => {
        const postData = query.state.variables as AddFileMutateProps;
        if (currentFolder?.folderId === postData.folderId) return true;
        else if (postData.projectId === selectedProject?.projectId) {
          return true;
        }
        return false;
      },
    }) > 0;

  useEffect(() => {
    if (!isCurrentUploadingFiles) {
      translateX.value = withTiming(0, {duration: 200});
    }
  }, [isCurrentUploadingFiles]);
  return {isCurrentUploadingFiles, boxAnimatedStyles, composed};
};

export default useUploadIndicator;
