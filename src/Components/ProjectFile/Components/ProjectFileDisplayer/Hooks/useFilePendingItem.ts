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
import {View, Text, Easing} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import useUploadFileState from '../../../../../CustomHooks/useUploadFileState';
import {TFileBgUploadData} from '../../../Provider/StorageModels';
import {useMutationState} from '@tanstack/react-query';
import {
  getFileMutationKey,
  IAddSingleFileMutateProps,
} from '../../../../../API/fileQueryAPI';
import {useFileBgUploadStore} from '../../../Store/useFileBgUploadStore';
import {useShallow} from 'zustand/shallow';

type Props = {item: TFileBgUploadData};

const useFilePendingItem = ({item}: Props) => {
  const {fileState} = useUploadFileState({fileId: item.file.fileId});
  const circularRef = useRef<AnimatedCircularProgress>(null);
  const {updateStatusSingleCachedFile} = useFileBgUploadStore(
    useShallow(state => ({
      updateStatusSingleCachedFile: state.updateStatusSingleCachedFile,
    })),
  );

  const mutationFile = useMutationState({
    filters: {
      exact: true,
      mutationKey: getFileMutationKey('bg-upload-single'),
      predicate: query =>
        query.state.variables &&
        query.state.variables.file &&
        (query.state.variables as IAddSingleFileMutateProps).file.fileId ===
          item.file.fileId &&
        query.state.status === 'pending',
    },
    select(mutation) {
      return mutation.destroy;
    },
  });

  const handlePressProgress = () => {
    if (item.status === 'pending') {
      if (mutationFile.length > 0) {
        mutationFile[0]();
      }
    } else if (item.status === 'error') {
      updateStatusSingleCachedFile(item.file.fileId, 'pending');
    }
  };
  useEffect(() => {
    circularRef.current?.animate(
      Math.floor(fileState.progress),
      500,
      Easing.quad,
    );
  }, [fileState.progress]);
  return {circularRef, fileState, handlePressProgress};
};

export default useFilePendingItem;
