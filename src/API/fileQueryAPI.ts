//!-------- > QUERY KEYS < -----------
//* ["FILES-QUERY-KEY", companyId] => Files Query Key
//* ["FOLDERS-QUERY-KEY", companyId] => Folders Query Key
//!-----------------------------------

import {
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import axios, {AxiosResponse} from 'axios';
import {Company} from '../Models/company';
import {baseAddress} from './settings';
import {BaseAPIProps} from '../Models/basedAPIProps';
import {DoxleFile, DoxleFolder} from '../Models/files';
import {AxiosInfiniteReturn} from '../Models/axiosReturn';
import useSetRootFolderQueryData from '../QueryDataHooks/useSetRootFolderQueryData';
import useSetFileQueryData from '../QueryDataHooks/useSetFileQueryData';
import {useCallback, useRef, useState} from 'react';
import {TAPIServerFile} from '../Models/utilityType';
import useUploadFileState from '../CustomHooks/useUploadFileState';

export interface IFilterGetFolderQueryFilter {
  projectId?: string;
  docketId?: string;
}
export interface IFilterGetFileQueryFilter {
  projectId?: string;
  docketId?: string;
  folderId?: string;
}

interface GetFolderQueryProps extends BaseAPIProps {
  filter: IFilterGetFolderQueryFilter;
  getFolderOnSuccessCallback?: (folderList: DoxleFolder[]) => void;
  enable?: boolean;
}

const useGetFolderQuery = ({
  company,
  accessToken,
  showNotification,
  getFolderOnSuccessCallback,
  filter,
  enable,
}: GetFolderQueryProps) => {
  const queryKey = getFolderQKey(filter, company);
  const {projectId, docketId} = filter;
  const getParam: any = {};
  if (projectId) getParam.project = projectId;
  else if (docketId) getParam.docket = docketId;
  else if (!projectId && !docketId) getParam.company = company?.companyId;

  const folderQuery = useQuery({
    queryKey,
    queryFn: async ({queryKey, meta}) => {
      try {
        const response = await axios.get<DoxleFolder[]>(
          baseAddress + '/storage/folder/',
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'User-Company': company?.companyId,
            },
            params: getParam,
          },
        );
        if (getFolderOnSuccessCallback) {
          getFolderOnSuccessCallback(response.data);
        }

        return response;
      } catch (error) {
        console.log('Error in Fetching Folders:', error);
      }
    },
    enabled:
      company !== undefined && accessToken !== undefined && (enable ?? true),
    retry: 1,
    gcTime: 6 * 10 * 1000,
    staleTime: 5 * 60 * 1000,

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: true,
  });
  return folderQuery;
};

interface GetFileQueryProps extends BaseAPIProps {
  filter: IFilterGetFileQueryFilter;
  onSuccessCallback?: (files: DoxleFile[]) => void;
  enable?: boolean;
}
const useGetFilesQuery = ({
  company,
  accessToken,
  filter,
  enable,
  onSuccessCallback,
}: GetFileQueryProps) => {
  const queryKey = getFileQKey(filter, company);
  const {projectId, docketId} = filter;
  const getParam: any = {};
  if (projectId) getParam.project = projectId;
  else if (docketId) getParam.docket = docketId;
  else if (!projectId && !docketId) getParam.company = company?.companyId;

  const initialUrl = baseAddress + '/storage/file/?page=1';
  const filesQuery = useInfiniteQuery({
    queryKey,
    initialPageParam: initialUrl,
    queryFn: async ({pageParam, signal}) => {
      try {
        const response = await axios.get<AxiosInfiniteReturn<DoxleFile>>(
          pageParam,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'User-Company': company?.companyId,
            },

            params: getParam,
            signal,
          },
        );
        if (onSuccessCallback) onSuccessCallback(response.data.results);
        return response;
      } catch (error) {
        return;
      }
    },
    getNextPageParam: prev => {
      return prev?.data.next;
    },

    enabled:
      company !== undefined && accessToken !== undefined && (enable || true),

    retry: 1,

    gcTime: 6 * 60 * 1000,

    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,

    refetchOnWindowFocus: false,

    refetchInterval: 6 * 60 * 1000,
    // refetchInterval:2000,
    refetchIntervalInBackground: true,
  });
  return filesQuery;
};

//* USE QUERY TO RETRIEVE ALL THE FILES
const useGetFilesInsideFolderQuery = ({
  company,
  accessToken,
  onSuccessCallback,
  filter,
  onErrorCb,
}: GetFileQueryProps) => {
  let queryKey = getFileQKey(filter, company);
  const getParams: any = {
    company: company?.companyId,
  };
  if (filter.folderId) getParams.folderId = filter.folderId;
  console.log('QKEY', queryKey);
  // console.log('%cGET-FILES-INSIDE-FOLDER-QUERY = FOLDER-ID: ', 'background:red; color:white;', currentFolderName, )
  const url = baseAddress + '/storage/file/';
  const filesQuery = useInfiniteQuery({
    queryKey,
    initialPageParam: url,
    queryFn: async ({pageParam, signal}) => {
      try {
        const response = await axios.get<AxiosInfiniteReturn<DoxleFile>>(
          pageParam,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'User-Company': company?.companyId,
            },

            params: getParams,
            signal,
          },
        );
        if (onSuccessCallback) onSuccessCallback(response.data.results);

        return response;
      } catch (error) {
        if (onErrorCb) onErrorCb(error);
      }
    },
    getNextPageParam: prev => {
      return prev?.data.next;
    },

    enabled:
      company !== undefined &&
      accessToken !== undefined &&
      filter.folderId !== undefined,

    retry: 1,

    gcTime: 4 * 60 * 1000,
    staleTime: 3 * 60 * 1000,

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 4 * 60 * 1000,
    // refetchInterval:2000,
    refetchIntervalInBackground: true,
  });

  return filesQuery;
};

// *********************************************ADD FOLDER ***********************************//
interface AddFolderQueryProps extends BaseAPIProps {
  onAddFolderSuccessCallback?: Function;
}

const useAddFolder = ({
  accessToken,
  company,
  showNotification,
  onAddFolderSuccessCallback,
}: AddFolderQueryProps) => {
  const {handleAddFolder} = useSetRootFolderQueryData({});
  const addFolderMutation = useMutation({
    mutationKey: getFolderMutationKey('add'),
    mutationFn: async (newFolder: DoxleFolder) =>
      axios.post<DoxleFolder>(baseAddress + '/storage/folder/', newFolder, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId,
        },
      }),
    onSuccess(response, request, context) {
      if (response?.data) handleAddFolder(response?.data);
      if (onAddFolderSuccessCallback) {
        onAddFolderSuccessCallback(response?.data);
      }
      // if (showNotification){
      //   showNotification('Its a success', 'success')
      // }
    },
    onError(error, variables, context) {
      if (showNotification) {
        showNotification('Error', 'error');
      }
    },
  });

  const mutate = (data: DoxleFolder) => addFolderMutation.mutate(data);

  return {...addFolderMutation, mutate: mutate};
};

interface AddFileQueryProps extends BaseAPIProps {
  addFileCallback?: Function;
  uploadProgressCallback?: (percentComplete: number) => void;
}

export interface AddFileMutateProps {
  docketId?: string;
  projectId?: string;
  folderId?: string;
  files: TAPIServerFile[];
}

const useAddFilesQuery = ({
  accessToken,
  company,
  showNotification,
  addFileCallback,
  uploadProgressCallback,
}: AddFileQueryProps) => {
  const {handleAddMultipleFile} = useSetFileQueryData({});
  //* CURRENT FOLDER ID IS PASSED AS A PARAM BUT ALSO IN THE DATA OBJECT

  const addFileMutation = useMutation({
    mutationKey: getFileMutationKey('add'),
    mutationFn: async ({
      files,
      docketId,
      projectId,
      folderId,
    }: AddFileMutateProps) => {
      const formData = new FormData();

      if (projectId) formData.append('projectId', projectId);
      if (docketId) formData.append('docketId', docketId);
      if (folderId) formData.append('folderId', folderId);
      //* LOOP THROUGH EACH FILE AND PASS IT TO THE BACK END VIA FORM DATA
      files.forEach(file => {
        const {fileId, ...rest} = file;
        formData.append('files', rest);
        formData.append('fileIds', fileId);
      });
      return axios.post<{
        files: DoxleFile[];
        errors: any;
      }>(baseAddress + '/storage/file/', formData, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId,
          'Content-Type': 'multipart/form-data',
        },

        onUploadProgress: progressEvent => {
          if (progressEvent.total) {
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total * 1.1),
            );

            if (uploadProgressCallback)
              uploadProgressCallback(percentCompleted);
          }
        },
      });
    },

    onSuccess(response, request, context) {
      if (addFileCallback) {
        addFileCallback();
      }
      handleAddMultipleFile(response.data.files);
    },

    onError(error, variables, context) {
      if (showNotification) {
        showNotification('Error', 'error');
      }
    },
  });
  // * OVERRIDE MUTATE Function
  const mutate = (props: AddFileMutateProps) => addFileMutation.mutate(props);

  // * CUSTOM HOOK ALWAYS NEEDS A RETURN THE HOOK
  return {...addFileMutation, mutate: mutate};
};
interface IAddSingleFileQueryProps extends BaseAPIProps {
  onCancelUpload?: () => void;
  onSuccessUpload?: (files: DoxleFile[]) => void;
  onErrorUpload?: (payload: IAddSingleFileMutateProps, error?: Error) => void;
}
export interface IAddSingleFileMutateProps {
  docketId?: string;
  projectId?: string;
  folderId?: string;
  file: TAPIServerFile;
}
const useBgUpoadSingleFileQuery = ({
  company,
  onCancelUpload,
  onSuccessUpload,
  onErrorUpload,

  accessToken,
}: IAddSingleFileQueryProps) => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const lastLoadedRef = useRef<number | null>(null);

  const {updateFileUploadState, destroyState} = useUploadFileState({});
  const addFileMutation = useMutation({
    mutationKey: getFileMutationKey('bg-upload-single'),
    mutationFn: async ({
      file,
      docketId,
      projectId,
      folderId,
    }: IAddSingleFileMutateProps) => {
      const formData = new FormData();
      if (projectId) formData.append('projectId', projectId);
      if (docketId) formData.append('docketId', docketId);
      if (folderId) formData.append('folderId', folderId);
      const {fileId, size, ...rest} = file;
      formData.append('files', rest);
      formData.append('fileIds', fileId);
      lastTimeRef.current = Date.now();
      lastLoadedRef.current = 0;
      abortControllerRef.current = new AbortController();
      return axios.post<{
        files: DoxleFile[];
        errors: any;
      }>(baseAddress + '/storage/file/', formData, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId,
          'Content-Type': 'multipart/form-data',
        },

        onUploadProgress: progressEvent => {
          const currentTime = Date.now();
          const currentLoaded = progressEvent.loaded;
          const total = progressEvent.total || (file.size ?? 1);
          let estimateTimeLeft = 0;
          if (lastTimeRef.current && lastLoadedRef.current !== null) {
            const timeDiff = (currentTime - lastTimeRef.current) / 1000; // in seconds
            const bytesDiff = currentLoaded - lastLoadedRef.current;
            const uploadSpeed = bytesDiff / timeDiff; // bytes per second

            estimateTimeLeft = Math.round(
              (total - currentLoaded) / uploadSpeed,
            ); // in seconds
          }

          const percentage = Math.round((currentLoaded / total) * 100);

          updateFileUploadState({
            fileId,
            progress: percentage,
            estimatedTime: estimateTimeLeft,
          });

          lastTimeRef.current = currentTime;
          lastLoadedRef.current = currentLoaded;
        },
        signal: abortControllerRef.current?.signal,
      });
    },

    onSuccess(response, variables, context) {
      if (onSuccessUpload) {
        onSuccessUpload(response.data.files);
      }
    },

    onError(error, variables, context) {
      console.log('ERROR UPLOADING FILE ', error);

      if (onErrorUpload) onErrorUpload(variables, error);
    },
    onSettled(data, error, variable) {
      if (abortControllerRef.current) {
        abortControllerRef.current = null;
      }
      if (variable.file.fileId) {
        destroyState(variable.file.fileId);
      }
    },
    retry: false,
  });
  const reset = useCallback(() => {
    if (onCancelUpload) onCancelUpload();
    abortControllerRef.current?.abort();
    addFileMutation.reset();
  }, [addFileMutation.reset, onCancelUpload]);
  return {
    ...addFileMutation,
    mutate: (params: IAddSingleFileMutateProps) =>
      addFileMutation.mutate(params),
    reset,
  };
};

interface UpdateFolderQueryProps extends BaseAPIProps {
  onUpdateFolderSuccessCallback?: (folder: DoxleFolder) => void;
}

export type TUpdateFolderParams = {
  folderId: string;
  folderName: string;
};

const useUpdateFolder = ({
  accessToken,
  company,
  showNotification,
  onUpdateFolderSuccessCallback,
}: UpdateFolderQueryProps) => {
  const {handleEditFolder} = useSetRootFolderQueryData({});
  const updateFolderMutation = useMutation({
    mutationKey: getFolderMutationKey('update'),
    mutationFn: async (props: TUpdateFolderParams) => {
      const {folderId, folderName} = props;
      return axios.patch<DoxleFolder>(
        baseAddress + '/storage/folder/' + folderId + '/',
        {
          folderName: folderName,
        },
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company?.companyId,
          },
        },
      );
    },
    onSuccess(response, request, context) {
      // const currentFolderId = request.folderId;
      // const queryKey = ["FOLDERS-QUERY-KEY", company?.companyId];
      if (onUpdateFolderSuccessCallback) {
        onUpdateFolderSuccessCallback(response.data);
      }

      handleEditFolder(response.data);
    },
    onError(error, variables, context) {
      if (showNotification) {
        showNotification('Error', 'error');
      }
      console.error(`Cannot Update File ${error}`);
    },
  });

  // * OVERRIDE MUTATE Function
  const mutate = (props: TUpdateFolderParams) =>
    updateFolderMutation.mutate(props);

  // * CUSTOM HOOK ALWAYS NEEDS A RETURN THE HOOK
  return {...updateFolderMutation, mutate: mutate};
};

interface UpdateFileQueryProps extends BaseAPIProps {
  onUpdateFileCallback?: Function;
}

export type TUpdateFileParams = {
  fileId: string;
  fileName: string;
  currentFolderId?: string;
  currentFolderName?: string;
};

const useUpdateFileQuery = ({
  accessToken,
  company,
  showNotification,
  onUpdateFileCallback,
}: UpdateFileQueryProps) => {
  const {handleUpdateFile} = useSetFileQueryData({});

  const updateFileMutation = useMutation({
    mutationKey: getFileMutationKey('update'),
    mutationFn: async (props: TUpdateFileParams) => {
      const {fileId, fileName, currentFolderId, currentFolderName} = props;
      return axios.patch<DoxleFile>(
        baseAddress + '/storage/file/' + fileId + '/',
        {
          fileName: fileName,
          currentFolderId: currentFolderId,
          currentFolderName: currentFolderName,
        },
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company?.companyId,
          },
        },
      );
    },
    //* VARIABLE IS WHAT WE PASS IN MUTATE FUNCTION
    //* DATA IS SERVER RESPONSE

    onSuccess(response, request, context) {
      handleUpdateFile(response.data);
      if (onUpdateFileCallback) {
        onUpdateFileCallback();
      }
    },
    onError(error, variables, context) {
      if (showNotification) {
        showNotification('Error', 'error');
      }
      console.error(`Cannot Update File ${error}`);
    },
  });

  // * OVERRIDE MUTATE Function
  const mutate = (props: {
    fileId: string;
    fileName: string;
    currentFolderId?: string;
    currentFolderName?: string;
  }) => updateFileMutation.mutate(props);

  // * CUSTOM HOOK ALWAYS NEEDS A RETURN THE HOOK
  return {...updateFileMutation, mutate: mutate};
};

interface DeleteFolderQueryProps extends BaseAPIProps {
  onDeleteFolderCallback?: Function;
}

const useDeleteFolder = ({
  accessToken,
  company,
  showNotification,
  onDeleteFolderCallback,
}: DeleteFolderQueryProps) => {
  const deleteFolderMutation = useMutation({
    mutationKey: getFolderMutationKey('delete'),
    mutationFn: async (data: DoxleFolder[]) => {
      const delete_folders_url = baseAddress + '/storage/folder/delete/';
      const params = {
        // docketId: 'cd4cb4da-090f-453b-979c-fc58fb65f229',
        // docketId:null,
        projectId: null,
        companyId: company?.companyId,
        folders: data.map(folder => folder.folderId),
      };
      return axios.post(delete_folders_url, params, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId,
        },
      });
    },
    onSuccess(response, request, context) {
      if (onDeleteFolderCallback) {
        onDeleteFolderCallback();
      }
    },
    onError(error, variables, context) {
      if (showNotification) {
        showNotification('Error', 'error');
      }
      console.error(`Cannot Delete Folder ${error}`);
    },
  });

  // * OVERRIDE MUTATE Function
  const mutate = (data: DoxleFolder[]) => deleteFolderMutation.mutate(data);

  // * CUSTOM HOOK ALWAYS NEEDS A RETURN THE HOOK
  return {...deleteFolderMutation, mutate: mutate};
};

interface DeleteFileQueryProps extends BaseAPIProps {
  onDeleteFileCallback: Function;
}

export interface DeleteFileParams {
  files: DoxleFile[];
}
const useDeleteFileQuery = ({
  company,
  accessToken,
  showNotification,
  onDeleteFileCallback,
}: DeleteFileQueryProps) => {
  const deleteFileMutation = useMutation({
    mutationKey: getFileMutationKey('delete'),
    mutationFn: async (props: DeleteFileParams) => {
      const {files} = props;

      // if (currentFolderId)
      //   deleteFile(accessToken, company, files, currentFolderId);
      // else deleteFile(accessToken, company, files);
      return axios.post(
        baseAddress + '/storage/file/delete_multiple/',
        {
          files: files,
        },
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'User-Company': company?.companyId,
          },
        },
      );
    },
    onSuccess(response, request, context) {
      if (onDeleteFileCallback) onDeleteFileCallback();
    },
    onError(error, variables, context) {
      if (showNotification) {
        showNotification('Error', 'error');
      }
      console.error(`Cannot Delete File ${error}`);
    },
  });

  // * OVERRIDE MUTATE Function
  const mutate = (props: DeleteFileParams) => deleteFileMutation.mutate(props);

  // * CUSTOM HOOK ALWAYS NEEDS A RETURN THE HOOK
  return {...deleteFileMutation, mutate: mutate};
};

// *********************************************DELETE FILE ***********************************//

//# HELPER FUNCTIONS
export const getFolderQKey = (
  filter: IFilterGetFolderQueryFilter,
  company: Company | undefined,
) => {
  let queryKey = ['FOLDERS-QUERY-KEY', company?.companyId];
  const {projectId, docketId} = filter;
  if (docketId) queryKey.push(docketId);
  else if (projectId) queryKey.push(projectId);

  return queryKey;
};

export const getFileQKey = (
  filter: IFilterGetFileQueryFilter,
  company: Company | undefined,
) => {
  let queryKey = [
    filter.folderId ? 'FILES-INSIDE-FOLDER-QUERY-KEY' : 'FILES-QUERY-KEY',
    company?.companyId,
  ];
  const {projectId, docketId, folderId} = filter;
  if (folderId) queryKey.push(folderId);
  else if (docketId) queryKey.push(docketId);
  else if (projectId) queryKey.push(projectId);

  return queryKey;
};

export const getFolderMutationKey = (action: 'add' | 'update' | 'delete') => {
  return [`${action}-folder-mutation`];
};
export const getFileMutationKey = (
  action: 'add' | 'update' | 'delete' | 'bg-upload-single',
) => {
  return [`${action}-file-mutation`];
};
const FilesAPI = {
  useGetFilesQuery,
  useGetFilesInsideFolderQuery,
  useAddFilesQuery,
  useUpdateFileQuery,
  useDeleteFileQuery,

  useGetFolderQuery,
  useAddFolder,
  useUpdateFolder,
  useDeleteFolder,
  useBgUpoadSingleFileQuery,
};

export default FilesAPI;
