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
import {View, Text, Easing, Alert} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import useUploadFileState from '../../../../../CustomHooks/useUploadFileState';
import {TFileBgUploadData} from '../../../Provider/StorageModels';
import {useMutationState, useQueryClient} from '@tanstack/react-query';
import {
  getFileMutationKey,
  IAddSingleFileMutateProps,
  TBgUploadSingleFileContext,
} from '../../../../../API/fileQueryAPI';
import {useFileBgUploadStore} from '../../../Store/useFileBgUploadStore';
import {useShallow} from 'zustand/shallow';

type Props = {item: TFileBgUploadData};

const useFilePendingItem = ({item}: Props) => {
  const {fileState} = useUploadFileState({fileId: item.file.fileId});
  const queryClient = useQueryClient();
  const {updateStatusSingleCachedFile, destroyCacheFile} = useFileBgUploadStore(
    useShallow(state => ({
      updateStatusSingleCachedFile: state.updateStatusSingleCachedFile,
      destroyCacheFile: state.destroyCacheFile,
    })),
  );

  const mutationFile = queryClient.getMutationCache().find({
    mutationKey: getFileMutationKey('bg-upload-single'),
    predicate: mutation =>
      mutation.state.variables &&
      (mutation.state.variables as any).file.fileId === item.file.fileId &&
      mutation.state.status === 'pending',
  });

  const mutationState = useMutationState({
    filters: {
      mutationKey: getFileMutationKey('bg-upload-single'),
      predicate: mutation =>
        mutation.state.variables &&
        (mutation.state.variables as any).file.fileId === item.file.fileId &&
        mutation.state.status === 'pending',
    },
    select: mutation => mutation.state.context,
  });
  const handlePressProgress = () => {
    if (item.status === 'pending') {
      if (mutationFile) {
        console.log('mutationFile', mutationFile);
        destroyCacheFile(item);
        mutationFile.destroy();
        const contextMutate = mutationFile.state
          .context as TBgUploadSingleFileContext;
        if (contextMutate.cancelUpload) {
          contextMutate.cancelUpload();
        }
      }
    } else if (item.status === 'error') {
      // updateStatusSingleCachedFile(item.file.fileId, 'pending');
      Alert.alert('Retry upload', item.errorMessage ?? 'Unknown Error', [
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => destroyCacheFile(item),
        },
        {
          text: 'Retry',
          onPress: () =>
            updateStatusSingleCachedFile(item.file.fileId, 'pending'),
        },
      ]);
    }
  };

  return {fileState, handlePressProgress};
};

export default useFilePendingItem;
