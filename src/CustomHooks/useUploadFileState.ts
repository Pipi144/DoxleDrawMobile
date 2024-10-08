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

import {useQueryClient} from '@tanstack/react-query';
import {produce} from 'immer';
import {useInterval} from './useInterval';
import {useState} from 'react';

type Props = {
  fileId?: string;
};

interface IFileUploadFileState {
  progress: number;
  estimatedTime: number;
}
const fileStateRootKey = ['upload-file-state'];
const useUploadFileState = ({fileId}: Props) => {
  const [fileState, setFileState] = useState<IFileUploadFileState>({
    progress: 0,
    estimatedTime: 0,
  });
  const queryClient = useQueryClient();

  const updateFileUploadState = (
    payload: Partial<IFileUploadFileState> & {fileId: string},
  ) => {
    const qKey = [...fileStateRootKey, payload.fileId];
    const dataActive = queryClient.getQueryCache().findAll({
      predicate: query =>
        qKey.every(key => query.queryKey.includes(key)) && query.isActive(),
    });
    if (dataActive.length > 0) {
      queryClient.setQueryData<IFileUploadFileState>(
        dataActive[0].queryKey,
        old => {
          if (old) {
            return produce(old, draft => {
              Object.assign(draft, payload);
              return draft;
            });
          } else return old;
        },
      );
    }
  };

  const destroyState = (fileId: string) => {
    queryClient.setQueryData<IFileUploadFileState>(
      [...fileStateRootKey, fileId],
      undefined,
    );
  };

  useInterval(() => {
    if (fileId) {
      const fileState = queryClient.getQueryData<IFileUploadFileState>([
        ...fileStateRootKey,
        fileId ?? '',
      ]) ?? {progress: 0, estimatedTime: 0};
      setFileState(fileState);
    }
  }, 500);
  return {
    fileState,
    updateFileUploadState,
    destroyState,
  };
};

export default useUploadFileState;
