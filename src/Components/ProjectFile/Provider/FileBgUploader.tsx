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
import {StyleSheet} from 'react-native';
import React, {createContext, PropsWithChildren, useEffect} from 'react';
import {useAuth} from '../../../Providers/AuthProvider';
import {useCompany} from '../../../Providers/CompanyProvider';
import {useConnection} from '../../../Providers/InternetConnectionProvider';
import {NetInfoStateType} from '@react-native-community/netinfo';
import {useFileBgUploadStore} from '../Store/useFileBgUploadStore';
import {useShallow} from 'zustand/shallow';
import FilesAPI, {getFileMutationKey} from '../../../API/fileQueryAPI';
import {useQueryClient} from '@tanstack/react-query';
import useSetFileQueryData from '../../../CustomHooks/QueryDataHooks/useSetFileQueryData';

type Props = PropsWithChildren & {};

const FileBgUploaderContext = createContext({});
const FileBgUploader = ({children}: Props) => {
  const {accessToken, loggedIn} = useAuth();
  const {company} = useCompany();
  const {isConnectionWeak, networkType, isConnected} = useConnection();
  const queryClient = useQueryClient();
  const isConnectionNotSatisfy =
    networkType === NetInfoStateType.cellular ||
    isConnectionWeak ||
    !isConnected;
  const {handleAddMultipleFile} = useSetFileQueryData({
    appendPos: 'start',
  });
  const {cachedFiles, updateStatusMultipleCachedFile, getInitialCachedFiles} =
    useFileBgUploadStore(
      useShallow(state => ({
        cachedFiles: state.cachedFiles,
        updateStatusMultipleCachedFile: state.updateStatusMultipleCachedFile,
        getInitialCachedFiles: state.getInitialCachedFiles,
      })),
    );

  interface IFailedUploadFileError {
    errors: Array<{
      errors: string;
      fileName: string;
    }>;
    files: any[];
  }
  const {mutate} = FilesAPI.useBgUpoadSingleFileQuery({
    company,
    accessToken,
    onSuccessUpload(files) {
      console.log('SUCCESS:', files);
      updateStatusMultipleCachedFile(
        files.map(file => file.fileId),
        'success',
      );
      handleAddMultipleFile(files);
    },
    onErrorUpload(data, error) {
      console.log('CALL ON ERROR UPLOAD', data, error);
      const errorText = [error?.message ?? 'Unknown error'];
      console.log('ERROR:', errorText);
      updateStatusMultipleCachedFile([data.file.fileId], 'error', errorText);
    },
  });

  useEffect(() => {
    const pendingFiles = cachedFiles.filter(file => file.status === 'pending');

    if (pendingFiles.length > 0 && accessToken && company) {
      pendingFiles.forEach(pendingFile => {
        const {file, hostId, uploadVariant} = pendingFile;
        const isUploading = queryClient.getMutationCache().find({
          mutationKey: getFileMutationKey('bg-upload-single'),
          predicate: mutation =>
            mutation.state.variables &&
            (mutation.state.variables as any).file.fileId === file.fileId &&
            mutation.state.status === 'pending',
        });
        if (!isUploading)
          mutate({
            file: file,
            projectId: uploadVariant === 'Project' ? hostId : undefined,
            docketId: uploadVariant === 'Docket' ? hostId : undefined,
            folderId: uploadVariant === 'Folder' ? hostId : undefined,
          });
      });
    }
  }, [cachedFiles, accessToken, company]);

  useEffect(() => {
    getInitialCachedFiles();
  }, []);

  return (
    <FileBgUploaderContext.Provider value={{}}>
      {children}
    </FileBgUploaderContext.Provider>
  );
};

export default FileBgUploader;

const styles = StyleSheet.create({});
