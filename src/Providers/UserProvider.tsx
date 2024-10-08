import {Platform} from 'react-native';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {ICompanyProviderContextValue, useCompany} from './CompanyProvider';
import {authContextInterface, useAuth} from './AuthProvider';
import {INotificationContext, useNotification} from './NotificationProvider';
import {User} from '../Models/user';
import {IStorageInfo} from './CacheQAProvider/CacheQAType';
import {
  DocumentDirectoryPath,
  downloadFile,
  exists,
  getFSInfo,
  mkdir,
  moveFile,
  unlink,
} from 'react-native-fs';
import UserQueryAPI from '../API/userQueryAPI';
import Notification from '../Components/DesignPattern/Notification/Notification';

export interface SaveSignatureFileParams {
  signaturePath: string;
  userId: string;
}
export interface UserContextValue {
  createLocalUserFolderWithUserId: (userId: string) => Promise<boolean>;

  saveSignatureFile: ({
    signaturePath,
    userId,
  }: SaveSignatureFileParams) => Promise<string | undefined>;
  downloadSignatureFile: (prop: {
    serverPath: string;
    userId: string;
  }) => Promise<string>;
  getLocalSignatureFile: (userId: string) => Promise<string | undefined>;
}

//!PATH TO LOCAL USER FOLDER
const PATH_TO_ROOT_LOCAL_USER_FOLDER = DocumentDirectoryPath + '/LocalUser';

const UserContext = createContext({});
const UserProvider = (children: any) => {
  //####################### STATES #####################
  const [storageInfo, setstorageInfo] = useState<IStorageInfo | undefined>(
    undefined,
  );

  //####################################################

  useEffect(() => {
    getInfoStorage();
    createRootLocalUserFolder();

    // deleteFileSystemWithPath(PATH_TO_ROOT_LOCAL_USER_FOLDER);
  }, []);
  const {accessToken, user} = useAuth();

  const {company} = useCompany();

  //retrieve storage capacity info
  const getInfoStorage = async () => {
    try {
      const result = await getFSInfo();
      if (result) {
        setstorageInfo({
          totalSpace: result.totalSpace,
          freeSpace: result.freeSpace,
        });
      }
    } catch (error) {
      console.error('FAILED TO RETIEVE STORAGE INFO');
      return;
    }
  };

  //*check if a path exist
  const checkPathExist = async (path: string) => {
    try {
      const resultCheck = await exists(path);
      return resultCheck;
    } catch (error) {
      console.error('FAILED TO CHECK PATH EXISTED');
      return false;
    }
  };

  //*create a folder with a given path
  const createFolder = async (dirPath: string) => {
    try {
      await mkdir(dirPath, {
        NSURLIsExcludedFromBackupKey: Platform.OS === 'ios' ? false : undefined,
      });
      console.log('CREATED PATH:', dirPath);
      return true;
    } catch (error) {
      console.error('FAILED TO CREATE DIRECTORY');
      return false;
    }
  };

  //*delete a file or folder with path
  const deleteFileSystemWithPath = async (filePath: string) => {
    try {
      if (await checkPathExist(filePath)) {
        const deleteResult = await unlink(filePath);
      }

      return true;
    } catch (error) {
      console.log('FAILED TO DELETE ASSET FOLDER');
      return false;
    }
  };

  //* create root summary folder, get called when first initialize the provider
  const createRootLocalUserFolder = async () => {
    try {
      const isExistedDefectPhotoFolder: boolean = await checkPathExist(
        PATH_TO_ROOT_LOCAL_USER_FOLDER,
      );
      if (!isExistedDefectPhotoFolder)
        return await createFolder(PATH_TO_ROOT_LOCAL_USER_FOLDER);
      // else
      //   console.log(
      //     'ALREADY CREATED LOCAL USER FOLDER/',
      //     PATH_TO_ROOT_LOCAL_USER_FOLDER,
      //   );
    } catch (error) {
      console.error('FAILED TO CREATE LOCAL USER FOLDER');
      return false;
    }
  };

  const createLocalUserFolderWithUserId = async (userId: string) => {
    try {
      const pathToLocalUserFolder =
        PATH_TO_ROOT_LOCAL_USER_FOLDER + `/${userId}`;
      if (await checkPathExist(pathToLocalUserFolder)) return true;
      await createFolder(pathToLocalUserFolder);
      return true;
    } catch (error) {
      console.log('ERROR CREATE USER FOLDER WITH ID', error);
      return false;
    }
  };

  const onSuccessRetrieveCB = (userServer: User) => {
    if (userServer.signature)
      downloadSignatureFile({
        serverPath: userServer.signature,
        userId: userServer.userId as string,
      });
  };
  const getUserInfo = UserQueryAPI.userRetrieveUserInfo({
    accessToken,
    company,
    userId: user?.userId || '',
    onSuccessCB: onSuccessRetrieveCB,
  });
  const saveSignatureFile = async ({
    signaturePath,
    userId,
  }: SaveSignatureFileParams) => {
    try {
      const pathToLocalUserFolder =
        PATH_TO_ROOT_LOCAL_USER_FOLDER + `/${userId}`;
      if (!(await checkPathExist(pathToLocalUserFolder)))
        await createFolder(pathToLocalUserFolder);
      const targetPathToUserSignatureFile =
        pathToLocalUserFolder + '/signature.jpg';
      if (await checkPathExist(targetPathToUserSignatureFile))
        await deleteFileSystemWithPath(targetPathToUserSignatureFile);
      await moveFile(signaturePath, targetPathToUserSignatureFile);

      return targetPathToUserSignatureFile;
    } catch (error) {
      console.log('FAILED TO SAVE SIGNATURE FILE');
      return undefined;
    }
  };

  const downloadSignatureFile = async (prop: {
    serverPath: string;
    userId: string;
  }) => {
    const {serverPath, userId} = prop;
    try {
      const pathToLocalUserFolder =
        PATH_TO_ROOT_LOCAL_USER_FOLDER + `/${userId}`;
      if (!(await checkPathExist(pathToLocalUserFolder)))
        await createFolder(pathToLocalUserFolder);
      const pathToSignatureFile = pathToLocalUserFolder + '/signature.jpeg';
      if (await checkPathExist(pathToSignatureFile))
        await deleteFileSystemWithPath(pathToSignatureFile);
      const resultDownload = await downloadFile({
        fromUrl: serverPath,
        toFile: pathToSignatureFile,
        background: Platform.OS === 'ios' ? true : undefined,
        discretionary: Platform.OS === 'ios' ? true : undefined,
        cacheable: Platform.OS === 'ios' ? false : undefined,
      }).promise;
      if (resultDownload.statusCode === 200) {
        return pathToSignatureFile;
      } else return serverPath;
    } catch (error) {
      console.error('ERROR DOWNLOAD SERVER SIGNATURE FILE');
      return serverPath;
    }
  };

  const getLocalSignatureFile = async (userId: string) => {
    try {
      const pathToSignatureFile =
        PATH_TO_ROOT_LOCAL_USER_FOLDER + `/${userId}/signature.jpeg`;
      if (await checkPathExist(pathToSignatureFile)) return pathToSignatureFile;
      else return undefined;
    } catch (error) {
      console.log('ERROR GET LOCAL SIGNATURE FILE');
      return undefined;
    }
  };
  const userContextValue: UserContextValue = {
    createLocalUserFolderWithUserId,
    saveSignatureFile,
    downloadSignatureFile,
    getLocalSignatureFile,
  };
  return <UserContext.Provider value={userContextValue} {...children} />;
};

const useUser = () => useContext(UserContext);
export {UserProvider, useUser};
