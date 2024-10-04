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
  enable?: boolean;
}
const useGetFilesQuery = ({
  company,
  accessToken,
  showNotification,
  filter,
  enable,
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

        return response;
      } catch (error) {
        return;
      }
    },
    getNextPageParam: prev => {
      return prev?.data.next;
    },

    enabled:
      company !== undefined && accessToken !== undefined && (enable ?? true),

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
  showNotification,
  filter,
}: GetFileQueryProps) => {
  let queryKey = getFileQKey(filter, company);
  const getParams: any = {
    company: company?.companyId,
  };
  if (filter.folderId) getParams.folderId = filter.folderId;

  // console.log('%cGET-FILES-INSIDE-FOLDER-QUERY = FOLDER-ID: ', 'background:red; color:white;', currentFolderName, )
  const url = baseAddress + '/storage/file/';
  const filesQuery = useInfiniteQuery({
    queryKey,
    initialPageParam: url,
    queryFn: ({pageParam, signal}) => {
      return axios.get<AxiosInfiniteReturn<DoxleFile>>(pageParam, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId,
        },

        params: getParams,
        signal,
      });
    },
    getNextPageParam: prev => {
      return prev.data.next;
    },
    //* FETCHING ON MOUNT WILL BE SET TO FALSE, IF ENABLED = FALSE
    enabled:
      company !== undefined &&
      accessToken !== undefined &&
      filter.folderId !== undefined,

    retry: 1,
    //* AFTER 5 MINUTES THE QUERY IS GARBAGE COLLECTED AND isLoading IS SET TO TRUE TO MAKE AND API CALL
    //* BACKGROUND REFETCH WILL BE TRIGGERED EVERY TIME BECAUSE STALE TIME = 0, WHILE isLoading=False, isFetching=True
    gcTime: 4 * 60 * 1000,

    //* WHEN AN API CALL IS MADE AND THE DATA IS fetchBundle, IT GOES STALE STRAIGHTAWAY, BY SETTING THE STALE TIME TO 30 SECS, IT REMAINS FRESH FOR 30 SECS AND
    //* THEN GOES STALE, WHICH MEANS NO BACKGROUND REQUEST IS MADE WHEN THE QUERY IS FRESH. STRENGTH = BETTER OPTIMISATION. WEAKNESS = USER MIGHT SEE ODL DATA FOR 30 SECS
    //* isFetching=False FOR 30SECS
    staleTime: 3 * 60 * 1000,

    //* IF THIS IS SET TO false, WHEN THE COMPONENT IS MOUNTED, THERE WILL BE NO API CALL, DEFAULT = TRUE
    refetchOnMount: false,

    //* DEFAULT = TRUE, WHEN THE WINDOW LOOSES AND REGAINS FOCUS, THE DATA IS REFETCHED IN THE BACKGROUND AND UPDATED
    refetchOnWindowFocus: false,

    //* POLLING DATA FROM THE BACKEND AT REGULAR INTERVALS, THINK ABOUT THE STOCK MARKET IF YOUR BACKEND CHANGES CONSTANTLY THEN POLLING IS THE BETS OPTION
    refetchInterval: 4 * 60 * 1000,
    // refetchInterval:2000,

    //* THE ABOVE WILL NOT POLL WHEN THE BROWSER LOOSES FOCUS, THE BELOW COMMAND WILL POLL IRRELEVANT OF WINDOW / BROWSER FOCUS
    refetchIntervalInBackground: true,

    onSuccess: response => {},

    onError: () => {
      // if (showNotification)
      //   showNotification(
      //     'Somthing Went Wrong',
      //     'error',
      //     'Failed to Fetch Files',
      //   );
    },
  });

  return filesQuery;
};

// *********************************************ADD FOLDER ***********************************//
interface AddFolderQueryProps extends BaseAPIProps {
  onAddFolderSuccessCallback?: Function;
  filter: IFilterGetFolderQueryFilter;
}

const useAddFolder = ({
  accessToken,
  company,
  showNotification,
  onAddFolderSuccessCallback,
  filter,
}: AddFolderQueryProps) => {
  const {handleAddFolder} = useSetRootFolderQueryData({filter});
  const addFolderMutation = useMutation({
    mutationKey: getFolderMutationKey('add'),
    mutationFn: async (data: DoxleFolder) => {
      return addFolder(accessToken, company, data);
    },
    onSuccess(response, request, context) {
      if (response?.data) handleAddFolder(response?.data);
      if (onAddFolderSuccessCallback) {
        onAddFolderSuccessCallback(response?.data);
        console.log('Success Added Folder');
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

//* ADD NEW FOLDER
const addFolder = async (
  accessToken: string | undefined,
  company: Company | undefined,
  newFolder: DoxleFolder,
) => {
  try {
    return axios.post<DoxleFolder>(
      baseAddress + '/storage/folder/',
      newFolder,
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'User-Company': company?.companyId,
        },
      },
    );
  } catch (error: any) {
    console.error('Print Error');
    console.error(error.message);
  }
};
// *********************************************END ADD FOLDER ***********************************//

// *********************************************ADD FILE ***********************************//

interface AddFileQueryProps extends BaseAPIProps {
  filter: IFilterGetFileQueryFilter;
  addFileCallback?: Function;
  uploadProgressCallback?: (percentComplete: number) => void;
}

export type TAddDoxleFile = {
  name: string | null;
  type: string | null;
  uri: string;
};
export interface AddFileMutateProps {
  docketId?: string;
  projectId?: string;
  folderId?: string;
  files: TAddDoxleFile[];
}

//*  M2 THIS IS CUSTOM HOOK THAT IS USED TO DECLARE THE USE MUTATION
const useAddFilesQuery = ({
  accessToken,
  company,
  showNotification,
  addFileCallback,
  uploadProgressCallback,
  filter,
}: AddFileQueryProps) => {
  const {handleAddMultipleFile} = useSetFileQueryData({
    filter,
    isFolderFile: Boolean(filter.folderId),
  });
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
        formData.append('files', file);
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

interface UpdateFolderQueryProps extends BaseAPIProps {
  onUpdateFolderSuccessCallback?: (folder: DoxleFolder) => void;
  filter: IFilterGetFolderQueryFilter;
}

export type TUpdateFolderParams = {
  folderId?: string;
  folderName: string;
};

const updateFolder = (
  accessToken: string | undefined,
  company: Company | undefined,
  folderId: string,
  folderName: string,
) => {
  return axios.patch(
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
};

const useUpdateFolder = ({
  accessToken,
  company,
  showNotification,
  onUpdateFolderSuccessCallback,
  filter,
}: UpdateFolderQueryProps) => {
  const {handleEditFolder} = useSetRootFolderQueryData({filter});
  const updateFolderMutation = useMutation({
    mutationKey: getFolderMutationKey('update'),
    mutationFn: async (props: TUpdateFolderParams) => {
      const {folderId, folderName} = props;
      if (folderId && folderName)
        return updateFolder(accessToken, company, folderId, folderName);
      else {
        if (showNotification) {
          showNotification('Error', 'error');
        }
        console.error(`Invalid Folder Name `);
      }
    },
    //* VARIABLE IS WHAT WEW PASS IN MUTATE FUNCTION
    //* DATA IS SERVER RESPONSE

    onSuccess(response, request, context) {
      // const currentFolderId = request.folderId;
      // const queryKey = ["FOLDERS-QUERY-KEY", company?.companyId];
      if (onUpdateFolderSuccessCallback) {
        onUpdateFolderSuccessCallback(response?.data as DoxleFolder);
      }
      handleEditFolder(response?.data);
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

// *********************************************UPDATE FOLDER ***********************************//

// *********************************************UPDATE FILE ***********************************//

interface UpdateFileQueryProps extends BaseAPIProps {
  filter: IFilterGetFileQueryFilter;
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
  filter,
}: UpdateFileQueryProps) => {
  const {handleUpdateFile} = useSetFileQueryData({
    filter,
    isFolderFile: Boolean(filter.folderId),
  });

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

// *********************************************UPDATE FILE ***********************************//

// *********************************************DELETE FOLDER ***********************************//

interface DeleteFolderQueryProps extends BaseAPIProps {
  onDeleteFolderCallback?: Function;
  filter: IFilterGetFolderQueryFilter;
}

const deleteFolder = (
  accessToken: string | undefined,
  company: Company | undefined,
  folderIds: string[],
) => {
  const delete_folders_url = baseAddress + '/storage/folder/delete/';
  const params = {
    // docketId: 'cd4cb4da-090f-453b-979c-fc58fb65f229',
    // docketId:null,
    projectId: null,
    companyId: company?.companyId,
    folders: folderIds,
  };

  return axios.post(delete_folders_url, params, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'User-Company': company?.companyId,
    },
  });
};

const useDeleteFolder = ({
  accessToken,
  company,
  showNotification,
  onDeleteFolderCallback,
  filter,
}: DeleteFolderQueryProps) => {
  const {handleDeleteMultipleFolders} = useSetRootFolderQueryData({filter});

  const deleteFolderMutation = useMutation({
    mutationKey: getFolderMutationKey('delete'),
    mutationFn: async (data: string[]) => {
      return deleteFolder(accessToken, company, data);
    },
    onSuccess(response, request, context) {
      if (onDeleteFolderCallback) {
        onDeleteFolderCallback();
      }
      handleDeleteMultipleFolders(request);
    },
    onError(error, variables, context) {
      if (showNotification) {
        showNotification('Error', 'error');
      }
      console.error(`Cannot Delete Folder ${error}`);
    },
  });

  // * OVERRIDE MUTATE Function
  const mutate = (data: string[]) => deleteFolderMutation.mutate(data);

  // * CUSTOM HOOK ALWAYS NEEDS A RETURN THE HOOK
  return {...deleteFolderMutation, mutate: mutate};
};

// *********************************************END DELETE FOLDER ***********************************//

// *********************************************DELETE FILE ***********************************//

interface DeleteFileQueryProps extends BaseAPIProps {
  onDeleteFileCallback: Function;
  filter: IFilterGetFileQueryFilter;
}

export interface DeleteFileParams {
  files: DoxleFile[];
  currentFolderId?: string;
  currentFolderName?: string;
}
const useDeleteFileQuery = ({
  company,
  accessToken,
  showNotification,
  onDeleteFileCallback,
  filter,
}: DeleteFileQueryProps) => {
  const {handleRemoveMultipleFile} = useSetFileQueryData({
    filter,
    isFolderFile: Boolean(filter.folderId),
  });
  const deleteFileMutation = useMutation({
    mutationKey: getFileMutationKey('delete'),
    mutationFn: async (props: DeleteFileParams) => {
      const {files, currentFolderId, currentFolderName} = props;

      // if (currentFolderId)
      //   deleteFile(accessToken, company, files, currentFolderId);
      // else deleteFile(accessToken, company, files);
      return axios.post(
        baseAddress + '/storage/file/delete_multiple/',
        {
          files: files,
          currentFolderId: currentFolderId,
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
      handleRemoveMultipleFile(request.files.map(file => file.fileId));
    },
    onError(error, variables, context) {
      if (showNotification) {
        showNotification('Error', 'error');
      }
      console.error(`Cannot Delete File ${error}`);
    },
  });

  // * OVERRIDE MUTATE Function
  const mutate = (props: {
    files: DoxleFile[];
    currentFolderId?: string;
    currentFolderName?: string;
  }) => deleteFileMutation.mutate(props);

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
  if (projectId) queryKey.push(projectId);
  else if (docketId) queryKey.push(docketId);
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
export const getFileMutationKey = (action: 'add' | 'update' | 'delete') => {
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
};

export default FilesAPI;
