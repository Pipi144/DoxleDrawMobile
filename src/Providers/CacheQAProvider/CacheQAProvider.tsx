import {Platform, StyleSheet} from 'react-native';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  QAStore,
  createQAStore,
} from '../../components/content/Projects/Store/useQAStore';

import {
  ExpiredQAFile,
  ExpiredQAListFile,
  IStorageInfo,
  LocalQA,
  LocalQAImage,
  LocalQAList,
  QABatchPendingUpload,
  QAPendingUploadImageFile,
} from './CacheQAType';
import {Project} from '../../Models/project';
import {
  DELETED_QA_IMAGE_FILE_PATH,
  EXPIRED_QA_FILE_PATH,
  EXPIRED_QA_LIST_FILE_PATH,
  PATH_TO_TEMP_PDF_FOLDER,
  createFolder,
  createRootQAFolder,
  getDeletedQAImageFolder,
  getExpiredProjectFile,
  getExpiredQAFile,
  getExpiredQAListFile,
  getPathToQAProjectFolder,
  getPathToQaFolder,
  getPathToQaImageFile,
  getPathToQaImageFolder,
  getPathToQaImageInfoFile,
  getPathToQaImageMarkupFile,
  getPathToQaListFolder,
  getBasePathToQaListPdfFile,
  getPathToQaListSignatureFile,
  handleCollectExpiredProjectFolder,
  handleCreateQAFolder,
  handleCreateQAListFolder,
  handleCreateQAProjectFolder,
  handleDownloadQAImage,
  handleSaveProjectInfo,
  handleSaveQAInfo,
  handleSaveQAListInfo,
  getPendingUploadQAImageFile,
  handleUpdateStatusLocalQAImage,
  getPathToPendingQaImageWithMarkupFile,
  handleSavePendingUploadQAImageFile,
  handleSaveDeletePendingQAImageFile,
  getDeletePendingQAImageFile,
  getPathToQAItemThumbNailWithQAImg,
  getPathToQaItemThumbnail,
  getPathToQaImageThumbnailFile,
  handleDownloadQAThumbImage,
  generatePathToQaItemThumbnailWithQAImg,
  generatePathToQaItemThumbnail,
  ROOT_LOCAL_QA_FOLDER_PATH,
} from './CacheQAHelperFunctions';
import {
  QA,
  QAMedia,
  QAList,
  QAMarkupArrow,
  QAMarkupCircle,
  QAMarkupLabel,
  QAMarkupRectangle,
  QAMarkupStraightLine,
  QAWithFirstImg,
  QAMarkupPath,
} from '../../Models/qa';

import {authContextInterface, useAuth} from '../AuthProvider';
import {
  PATH_TO_PENDING_UPLOAD_QA,
  getLocalQAImageInfo,
} from './CacheQAHelperFunctions';
import {ICompanyProviderContextValue, useCompany} from '../CompanyProvider';
import QAQueryAPI, {
  UpdateQAImageWithMarkupProps,
} from '../../service/DoxleAPI/QueryHookAPI/qaQueryAPI';
import {produce} from 'immer';
import {useConnection} from '../InternetConnectionProvider';
import {generatePathToQaImageThumbnailFile} from './CacheQAHelperFunctions';
import {
  checkPathExist,
  deleteFileSystemWithPath,
} from '../../Utilities/FunctionUtilities';
import {
  copyFile,
  downloadFile,
  getFSInfo,
  moveFile,
  readDir,
  readFile,
  unlink,
  writeFile,
  ReadDirItem,
} from 'react-native-fs';

interface CacheQAContextValue {
  qaStore: QAStore;
  handleCachingQAProject: (project: Project) => Promise<void>;
  handleDeleteExpiredProjectFolder: () => Promise<void>;
  handleCachingQAList: (qaList: QAList) => Promise<void>;
  handleCollectExpiredQAListFolder: (project: Project) => Promise<void>;
  handleDeleteExpiredQAListFolder: () => Promise<void>;
  handleCollectExpiredQAFolder: (qaList: QAList) => Promise<void>;
  handleDeleteExpiredQAFolder: () => Promise<void>;
  handleCachingQA: (qa: QA) => Promise<void>;
  handleGetLocalQAImages: (qa: QA) => Promise<LocalQAImage[]>;
  handleDownloadQAThumb: (qa: QAWithFirstImg) => Promise<string | undefined>;
  handleCacheQAImageList: (qaImageList: QAMedia[]) => Promise<LocalQAImage[]>;
  handleCollectDeletedQAImages: (props: {
    qaItem: QA;
    qaImageList: QAMedia[];
  }) => Promise<LocalQAImage[]>;
  handleDeleteQAImageFolder: () => Promise<void>;
  handleDeleteSingleQAImageFolder: (qaImage: LocalQAImage) => Promise<void>;
  handleSaveLocalQAMarkupList: (props: {
    qaImage: QAMedia;
    markupList: Array<
      | QAMarkupRectangle
      | QAMarkupCircle
      | QAMarkupStraightLine
      | QAMarkupLabel
      | QAMarkupArrow
      | QAMarkupPath
    >;
  }) => Promise<
    (
      | QAMarkupRectangle
      | QAMarkupCircle
      | QAMarkupStraightLine
      | QAMarkupLabel
      | QAMarkupArrow
      | QAMarkupPath
    )[]
  >;
  handleGetCachedQAMarkupList: (
    qaImage: QAMedia,
  ) => Promise<
    (
      | QAMarkupRectangle
      | QAMarkupCircle
      | QAMarkupStraightLine
      | QAMarkupLabel
      | QAMarkupArrow
      | QAMarkupPath
    )[]
  >;
  handleRemoveCachedQAMarkup: (
    qaImage: QAMedia,
  ) => Promise<never[] | undefined>;
  handleDeleteSingleQAFolder: (qa: QA) => Promise<void>;
  handleCreateSignatureFile: (props: {
    qaList: QAList;
    signatureData: string;
  }) => Promise<string | undefined>;
  handleGetCachedQAListSignatureFile: (
    qaList: QAList,
  ) => Promise<string | undefined>;
  handleDeleteCachedQAListSignatureFile: (qaList: QAList) => Promise<void>;
  handleGetCachedQAListPDFFile: (qaList: QAList) => Promise<string | undefined>;
  handleCacheSingleQAImage: (
    qaImage: QAMedia,
  ) => Promise<LocalQAImage | undefined>;
  handleDownloadPdfFile: (props: {
    qaList: QAList;
    pdfUrl: string;
  }) => Promise<string | undefined>;
  handleCreateTempPdf: (props: {
    data64: string;
    nameFile: string;
  }) => Promise<string | undefined>;
  handleDeleteTempCachePdfFolder: () => Promise<void>;
  handleCreateMultiQAImageFolder: (
    newQaImageList: QAMedia[],
    qa: QA,
  ) => Promise<LocalQAImage[]>;
  uploadPendingFiles: QAPendingUploadImageFile;
  setUploadPendingFiles: React.Dispatch<
    React.SetStateAction<QAPendingUploadImageFile>
  >;
  handleSaveScreenShotQAImageWithMarkup: (props: {
    qaImg: LocalQAImage;
    screenShotUri: string;
  }) => Promise<string | undefined>;
  handleCreateSingleQAImageFolder: (
    newQaImage: QAMedia,
    qa: QA,
  ) => Promise<LocalQAImage | undefined>;
  setDeletedQAImageStack: React.Dispatch<React.SetStateAction<LocalQAImage[]>>;
  handleGetThumbnailLocalQA: (
    qa: QAWithFirstImg,
  ) => Promise<string | undefined>;
  handleSaveQAThumbnailMarkup: (props: {
    qaImage: QAMedia;
    thumbUri: string;
  }) => Promise<void>;
  handleGetFullSizeImgForMarkup: (
    qaImage: LocalQAImage,
  ) => Promise<string | undefined>;
  handleSaveLocalQAImgWithMarkupAsThumbnail: (props: {
    qaImage: QAMedia;
    imgWithMarkupPath: string;
  }) => Promise<string | undefined>;

  handleGetCachedQAImageInfo: (qaImage: QAMedia) => Promise<LocalQAImage>;
  handleUpdateThumbQA: (qa: QA) => Promise<void>;
  deleteThumbnailLocalQA: (qa: QA) => Promise<void>;
  handleSyncQAImageThumb: (qaImage: QAMedia) => Promise<string | false>;
}

const CacheQAContext = createContext<CacheQAContextValue | null>(null);

const CacheQAProvider = (children: any) => {
  const [storageInfo, setstorageInfo] = useState<IStorageInfo | undefined>(
    undefined,
  );
  const [uploadPendingFiles, setUploadPendingFiles] =
    useState<QAPendingUploadImageFile>([]);

  const [deletedQAImageStack, setDeletedQAImageStack] = useState<
    LocalQAImage[]
  >([]);
  const [isHandlingPostUpload, setIsHandlingPostUpload] = useState(false);
  const {isConnected, isConnectionWeak} = useConnection();
  useEffect(() => {
    getInfoStorage();
    createRootQAFolder();
    handleCollectExpiredProjectFolder();

    // //!THIS ONE IS TO CLEAR CACHE THE FIRST TIME WHEN UPDATING TO THE NEW VERSION
    // checkCacheClearForNewUpdate();
    // deleteFileSystemWithPath(ROOT_LOCAL_QA_FOLDER_PATH);
  }, []);

  //### HELPER FUNCTIONS ###
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

  //### END HELPER FUNCTIONS ###

  //!----> UPLOAD BACKGROUND <----
  const {loggedIn, accessToken} = useAuth();
  const {company} = useCompany();

  const onSuccessUploadImgWithMarkupCB = async (
    prevData?: UpdateQAImageWithMarkupProps,
  ) => {
    try {
      if (prevData) {
        await deleteFileSystemWithPath(prevData.newUriPath);
      }
    } catch (error) {
      console.log('ERROR onSuccessUploadImgWithMarkupCB:', error);
    }
  };
  const updateQAImageWithMarkupQuery =
    QAQueryAPI.useUpdateQAImageWithMarkupQuery({
      accessToken,
      company,
      onSuccessCB: onSuccessUploadImgWithMarkupCB,
    });

  const updateMarkupQuery = QAQueryAPI.useUpdateQAImageMarkupQuery({
    accessToken,
    company,
  });
  const onSuccessBackgroundAdd = async (returnedData: QAMedia[]) => {
    try {
      setIsHandlingPostUpload(true);
      for await (const successFile of returnedData) {
        //update the local file status to "success" as it uploaded to server
        const updatedLocalImg = await handleUpdateStatusLocalQAImage(
          successFile,
          'success',
        );

        if (updatedLocalImg) {
          // console.log('SUCCESS FULLY UPDATED STATUS:', updatedLocalImg);
          //* check if has any markup, upload markup
          if (updatedLocalImg.markup && updatedLocalImg.markup.length > 0) {
            // console.log('MARKUP EXIST, upload markup');
            updateMarkupQuery.mutate({
              qaImage: updatedLocalImg,
              markupList: updatedLocalImg.markup,
            });
          }
          //* check if is there any image with markup file=>upload to server to handle generate pdf
          const imageWithMarkupShotLocalPath =
            getPathToPendingQaImageWithMarkupFile(updatedLocalImg);

          if (await checkPathExist(imageWithMarkupShotLocalPath)) {
            // console.log(
            //   'image with markup short exist, upload markup shot image',
            // );
            updateQAImageWithMarkupQuery.mutate({
              qaImage: updatedLocalImg,
              newUriPath: imageWithMarkupShotLocalPath,
            });
          }
        }
      }
    } catch (error) {
      console.log('ERROR onSuccessBackgroundAdd:', error);
    } finally {
      console.log('FINALLY SUCCESS SAVE PENDING FILE TO LOCAL');
      await handleSavePendingUploadQAImageFile(
        uploadPendingFiles.filter((_, idx) => idx !== 0),
      );
      setUploadPendingFiles(prev => prev.filter((_, idx) => idx !== 0));
      setIsHandlingPostUpload(false);
    }
  };

  const onErrorBackgroundAdd = async (errorImages?: LocalQAImage[]) => {
    try {
      setIsHandlingPostUpload(true);
      //delete the files
      if (errorImages) {
        setDeletedQAImageStack(prev => [...prev, ...errorImages]);
        //* save to local
        await handleSaveDeletePendingQAImageFile([
          ...deletedQAImageStack,
          ...errorImages,
        ]);
      }
    } catch (error) {
      console.log('ERROR onErrorBackgroundAdd:', error);
    } finally {
      await handleSavePendingUploadQAImageFile(
        uploadPendingFiles.filter((_, idx) => idx !== 0),
      );
      //remove it out of the uploading file
      setUploadPendingFiles(prev =>
        prev.length > 0 ? prev.filter((_, idx) => idx !== 0) : [],
      );
      setIsHandlingPostUpload(false);
    }
  };
  const addBackgroundMultiQAImageQuery =
    QAQueryAPI.useBackgroundAddMultiQAImageQuery({
      accessToken,
      company,
      onSuccessCB: onSuccessBackgroundAdd,
      onErrorCb: onErrorBackgroundAdd,
    });

  const handleGetInitialPendingUploadFiles = async () => {
    try {
      const uploadPendingFile = await getPendingUploadQAImageFile();
      const deletedPendingFiles = await getDeletePendingQAImageFile();
      if (uploadPendingFile.length > 0 && isConnected) {
        setUploadPendingFiles(prev => [...prev, ...uploadPendingFile]);
      }
      if (deletedPendingFiles.length > 0)
        setDeletedQAImageStack(prev => [...prev, ...deletedPendingFiles]);
    } catch (error) {
      console.log('ERROR handleBackgroundUpload:', error);
    }
  };

  //* useefect to trigger get initial upload pending files, only when app is logged in and we get current company
  useEffect(() => {
    if (loggedIn && company) handleGetInitialPendingUploadFiles();
  }, [loggedIn, company]);

  useEffect(() => {
    if (uploadPendingFiles.length > 0) {
      if (!addBackgroundMultiQAImageQuery.isLoading && !isHandlingPostUpload) {
        console.log(
          'TRIGGER UPLOAD, pending file length:',
          uploadPendingFiles.length,
        );
        addBackgroundMultiQAImageQuery.mutate(uploadPendingFiles[0]);
      }
    }
  }, [
    uploadPendingFiles,
    addBackgroundMultiQAImageQuery.isLoading,
    isHandlingPostUpload,
  ]);

  //!<----------------------

  //!---> HANDLING DELETE PENDING FILES <---
  //*useEfect save pending delete files  to local

  const onSuccessDeleteQAImage = async () => {
    try {
      await handleSaveDeletePendingQAImageFile(
        deletedQAImageStack.filter((_, idx) => idx !== 0),
      );
      setDeletedQAImageStack(prev => prev.filter((_, idx) => idx !== 0));
    } catch (error) {
      console.log('ERROR onSuccessDeleteQAImage:', error);
    }
  };
  const deleteImgQuery = QAQueryAPI.useDeleteQAImageQuery({
    accessToken,
    company,
    onSuccessCb: onSuccessDeleteQAImage,
  });

  const handleDeleteStackedQAImage = async (image: LocalQAImage) => {
    try {
      const localQAImageInfoPath = getPathToQaImageInfoFile(image);
      if (await checkPathExist(localQAImageInfoPath)) {
        const localInfo = JSON.parse(
          await readFile(localQAImageInfoPath),
        ) as LocalQAImage;
        if (localInfo.status === 'success') {
          deleteImgQuery.mutate(localInfo);

          await handleDeleteSingleQAImageFolder(localInfo);
        } else {
          await handleDeleteSingleQAImageFolder(localInfo);
          await handleSaveDeletePendingQAImageFile(
            deletedQAImageStack.filter((_, idx) => idx !== 0),
          );
          setDeletedQAImageStack(prev => prev.filter((_, idx) => idx !== 0));
        }
      }
    } catch (error) {
      console.log('ERROR handleDeleteStackedQAImage:', error);
    }
  };

  useEffect(() => {
    if (uploadPendingFiles.length === 0 && deletedQAImageStack.length > 0) {
      //! always delete from first item to last item
      handleDeleteStackedQAImage(deletedQAImageStack[0]);
    }
  }, [uploadPendingFiles, deletedQAImageStack]);

  //* handle cache project folder info
  const handleCachingQAProject = useCallback(async (project: Project) => {
    try {
      const pathToProjectFolder = getPathToQAProjectFolder(project.projectId);
      if (await checkPathExist(pathToProjectFolder))
        await handleSaveProjectInfo(project);
      else await handleCreateQAProjectFolder(project);
    } catch (error) {
      console.log('ERROR handleCachingQAProject:', error);
    }
  }, []);

  //* handle delete all expired project folder
  const handleDeleteExpiredProjectFolder = useCallback(async () => {
    try {
      const expiredProjectFile = await getExpiredProjectFile();
      if (expiredProjectFile.length > 0) {
        for (const expiredProject of expiredProjectFile) {
          await deleteFileSystemWithPath(expiredProject.pathToProjectFolder);
        }
      }
    } catch (error) {
      console.log('ERROR handleDeleteExpiredProjectFolder:', error);
    }
  }, []);

  //* handle caching qa list
  const handleCachingQAList = useCallback(async (qaList: QAList) => {
    try {
      const pathToQaListFolder = getPathToQaListFolder(qaList);
      if (!(await checkPathExist(pathToQaListFolder)))
        handleCreateQAListFolder(qaList);
      else handleSaveQAListInfo(qaList);
    } catch (error) {
      console.log('ERROR handleCachingQAList:', error);
    }
  }, []);

  //* handle save signature qa list
  const handleCreateSignatureFile = useCallback(
    async (props: {
      qaList: QAList;
      //base64
      signatureData: string;
    }) => {
      try {
        const pathToQAList = getPathToQaListFolder(props.qaList);
        if (!(await checkPathExist(pathToQAList))) createFolder(pathToQAList);
        const pathToQaListSignature = getPathToQaListSignatureFile(
          props.qaList,
        );

        await writeFile(
          pathToQaListSignature,
          props.signatureData.replace('data:image/jpeg;base64,', ''),
          'base64',
        );
        if (await checkPathExist(pathToQaListSignature)) {
          const returnData = await readFile(pathToQaListSignature, 'base64');

          return pathToQaListSignature;
        }
      } catch (error) {
        console.log('ERROR pathToQaListSignature:', error);
      }
    },
    [],
  );

  //* handle get local cache signature qa list
  const handleGetCachedQAListSignatureFile = useCallback(
    async (qaList: QAList) => {
      try {
        const pathToQaListSignature = getPathToQaListSignatureFile(qaList);
        if (await checkPathExist(pathToQaListSignature)) {
          return Platform.OS === 'ios'
            ? pathToQaListSignature
            : 'file://' + pathToQaListSignature;
        }
      } catch (error) {
        console.log('ERROR handleGetCachedQAListSignatureFile:', error);
      }
    },
    [],
  );
  //* handle caching qa list
  const handleDownloadPdfFile = useCallback(
    async (props: {qaList: QAList; pdfUrl: string}) => {
      const {qaList, pdfUrl} = props;
      try {
        const pathToQAListFolder = getPathToQaListFolder(qaList);
        if (!(await checkPathExist(pathToQAListFolder)))
          createFolder(pathToQAListFolder);
        const pathToQAListPdfFile = getBasePathToQaListPdfFile(qaList);
        const resultDownload = await downloadFile({
          fromUrl: pdfUrl,
          toFile: pathToQAListPdfFile,
          background: Platform.OS === 'ios' ? true : undefined,
          discretionary: Platform.OS === 'ios' ? true : undefined,
          cacheable: Platform.OS === 'ios' ? false : undefined,
        }).promise;

        if (resultDownload.statusCode) {
          console.log(
            'BYTES WRITTEN DOWNLOAD PDF:',
            resultDownload.bytesWritten * 0.000001,
            ' Mb',
          );
        }
        if (resultDownload.statusCode === 200) {
          console.log('DOWNLOAD PDF SUCCESSFULL');
          return pathToQAListPdfFile;
        }
      } catch (error) {
        console.log('ERROR handleDownloadPdfFile:', error);
      }
    },
    [],
  );

  //* handle get local cache signature qa list
  const handleGetCachedQAListPDFFile = useCallback(async (qaList: QAList) => {
    try {
      const pathToQaListPdf = getBasePathToQaListPdfFile(qaList);
      if (await checkPathExist(pathToQaListPdf)) {
        return pathToQaListPdf;
      }
    } catch (error) {
      console.log('ERROR handleGetCachedQAListSignatureFile:', error);
    }
  }, []);
  //* handle delete local cache signature qa list
  const handleDeleteCachedQAListSignatureFile = useCallback(
    async (qaList: QAList) => {
      try {
        const pathToQaListSignature = getPathToQaListSignatureFile(qaList);

        await deleteFileSystemWithPath(pathToQaListSignature);
      } catch (error) {
        console.log('ERROR handleDeleteCachedQAListSignatureFile:', error);
      }
    },
    [],
  );

  //* handle collect expired qa list folders
  const handleCollectExpiredQAListFolder = useCallback(
    async (project: Project) => {
      try {
        const qaProjectFolderPath = getPathToQAProjectFolder(project.projectId);
        // only proceed further if the qa folder is exist
        if (!(await checkPathExist(qaProjectFolderPath))) return;
        const localQAProjectFolderData: ReadDirItem[] = await readDir(
          qaProjectFolderPath,
        );
        const currentTime = new Date().getTime() / 1000;
        let expiredQaList: ExpiredQAListFile = [];
        if (localQAProjectFolderData.length > 0) {
          for (const localQAProjectFile of localQAProjectFolderData) {
            const filePath = localQAProjectFile.path;
            //which file is folder=> project id folder
            if (localQAProjectFile.isDirectory()) {
              const pathToQAListInfoFile = filePath + '/qaListInfo';

              if (await checkPathExist(pathToQAListInfoFile)) {
                const localQAProjectInfo: LocalQAList = JSON.parse(
                  await readFile(pathToQAListInfoFile),
                );

                if (localQAProjectInfo.expired < currentTime) {
                  expiredQaList.push({
                    qaListId: localQAProjectInfo.defectListId,
                    pathToQAListFolder: filePath, //get the qa list folder path
                  });
                  console.log('EXPIRED QA LIST:', filePath);
                }
              }
            }
          }
        }

        await writeFile(
          EXPIRED_QA_LIST_FILE_PATH,
          JSON.stringify(expiredQaList),
        );
      } catch (error) {
        console.log('ERROR handleCollectExpiredQAListFolder:', error);
      }
    },
    [],
  );

  //* handle delete expired qa list folder
  const handleDeleteExpiredQAListFolder = useCallback(async () => {
    try {
      const expiredQaListFile = await getExpiredQAListFile();
      // console.log('TRIGGER DELETE QA LIST EXPIRED:', expiredQaListFile);
      if (expiredQaListFile.length > 0) {
        for (const expiredQAList of expiredQaListFile) {
          await deleteFileSystemWithPath(expiredQAList.pathToQAListFolder);
        }
      }
    } catch (error) {
      console.log('ERROR handleDeleteExpiredProjectFolder:', error);
    }
  }, []);

  //* handle collect all expired qa item folder
  const handleCollectExpiredQAFolder = useCallback(async (qaList: QAList) => {
    try {
      const qaListFolderPath = getPathToQaListFolder(qaList);
      // only proceed further if the qa list folder is exist
      if (!(await checkPathExist(qaListFolderPath))) return;
      const localQAListFolderData: ReadDirItem[] = await readDir(
        qaListFolderPath,
      );
      const currentTime = new Date().getTime() / 1000;
      let expiredQaList: ExpiredQAFile = [];
      if (localQAListFolderData.length > 0) {
        for (const localQAFile of localQAListFolderData) {
          const filePath = localQAFile.path;
          //which file is folder=> project id folder
          if (localQAFile.isDirectory()) {
            const pathToQAInfoFile = filePath + '/qaInfo';

            if (await checkPathExist(pathToQAInfoFile)) {
              const localQAInfo: LocalQA = JSON.parse(
                await readFile(pathToQAInfoFile),
              );

              if (localQAInfo.expired < currentTime) {
                expiredQaList.push({
                  qaId: localQAInfo.defectId,
                  pathToQAFolder: filePath, //get the qa folder path
                });
                console.log('EXPIRED QA LIST:', filePath);
              }
            }
          }
        }
      }

      await writeFile(EXPIRED_QA_FILE_PATH, JSON.stringify(expiredQaList));
    } catch (error) {
      console.log('ERROR handleCollectExpiredQAListFolder:', error);
    }
  }, []);

  //* handle delete expired qa folder
  const handleDeleteExpiredQAFolder = useCallback(async () => {
    try {
      const expiredQaListFile = await getExpiredQAFile();
      // console.log('TRIGGER DELETE QA EXPIRED:', expiredQaListFile);
      if (expiredQaListFile.length > 0) {
        for (const expiredQA of expiredQaListFile) {
          await deleteFileSystemWithPath(expiredQA.pathToQAFolder);
        }
      }
    } catch (error) {
      console.log('ERROR handleDeleteExpiredProjectFolder:', error);
    }
  }, []);

  //* handle caching qa
  const handleCachingQA = useCallback(async (qa: QA) => {
    try {
      const pathToQaFolder = getPathToQaFolder(qa);
      if (!(await checkPathExist(pathToQaFolder))) handleCreateQAFolder(qa);
      else handleSaveQAInfo(qa);
    } catch (error) {
      console.log('ERROR handleCachingQAList:', error);
    }
  }, []);

  //* handle delete single qa folder
  const handleDeleteSingleQAFolder = useCallback(
    async (qa: QA) => {
      try {
        const pathToQAFolder = getPathToQaFolder(qa);
        const allQAImages = await handleGetLocalQAImages(qa);
        if (uploadPendingFiles.length > 0)
          setUploadPendingFiles(prev =>
            produce(prev, draft => {
              draft = draft.map(batch => ({
                ...batch,
                qaImages: batch.qaImages.filter(
                  pendingImg =>
                    !allQAImages.some(
                      localImg => pendingImg.imageId === localImg.imageId,
                    ),
                ),
              }));
            }),
          );
        else await deleteFileSystemWithPath(pathToQAFolder);
      } catch (error) {
        console.log('ERROR handleDeleteSingleQAFolder:', error);
      }
    },
    [uploadPendingFiles],
  );

  //* handle get all qa image
  const handleGetLocalQAImages = useCallback(
    async (qa: QA) => {
      try {
        const pathToQaFolder = getPathToQaFolder(qa);
        // qa folder not existed return empty array
        if (!(await checkPathExist(pathToQaFolder))) return [];

        let localQAImages: LocalQAImage[] = [];
        const localQAFolderData: ReadDirItem[] = await readDir(pathToQaFolder);

        if (localQAFolderData.length > 0) {
          for (const localQAData of localQAFolderData) {
            const filePath = localQAData.path;
            //which file is folder=> qa image folder
            if (localQAData.isDirectory()) {
              const pathToQAImageInfoFile = filePath + '/imageInfo';
              // if image info existed, read content and add to final list
              if (await checkPathExist(pathToQAImageInfoFile)) {
                const localQAImageInfo: LocalQAImage = JSON.parse(
                  await readFile(pathToQAImageInfoFile),
                );

                localQAImages.push({
                  ...localQAImageInfo,
                  imagePath:
                    Platform.OS === 'ios'
                      ? localQAImageInfo.imagePath
                      : 'file://' + localQAImageInfo.imagePath,
                  thumbPath:
                    Platform.OS === 'ios'
                      ? localQAImageInfo.thumbPath
                      : 'file://' + localQAImageInfo.thumbPath,
                });
              }
              // image info not existed, delete the directory
              else {
                console.log(
                  'FOLDER QA IMAGE IS EXISTED, BUT IMAGE INFO FILE NOT EXISTED=> DELETE FOLDER',
                );
                // await deleteFileSystemWithPath(filePath);
              }
            }
          }
        }

        return localQAImages.filter(
          qaImages =>
            !deletedQAImageStack.some(
              deletedItem => deletedItem.imageId === qaImages.imageId,
            ),
        ); //! only get items not in the deleted stack file
      } catch (error) {
        console.log('ERROR handleGetLocalQAImages:', error);

        return [];
      }
    },
    [deletedQAImageStack],
  );

  //* handle get thumb qa
  const handleGetThumbnailLocalQA = useCallback(
    async (qa: QAWithFirstImg) => {
      try {
        const pathToQaFolder = getPathToQaFolder(qa);
        // qa folder not existed return empty array
        if (!(await checkPathExist(pathToQaFolder))) {
          await createFolder(pathToQaFolder);
          return undefined;
        }
        // get the thumbnail path of qa item
        const pathToThumbNail = await getPathToQaItemThumbnail(qa);
        // if thumbnail path existed=> return the path
        if (pathToThumbNail && (await checkPathExist(pathToThumbNail))) {
          return pathToThumbNail;
        }

        let thumbnailItem: LocalQAImage | undefined = undefined;

        let initialLoop: number = 0;
        const localQAFolderData: ReadDirItem[] = await readDir(pathToQaFolder);

        if (localQAFolderData.length > 0) {
          while (initialLoop < localQAFolderData.length && !thumbnailItem) {
            const localQAData = localQAFolderData[initialLoop];

            //which file is folder=> qa image folder
            if (localQAData && localQAData.isDirectory()) {
              const filePath = localQAData.path;
              const pathToQAImageInfoFile = filePath + '/imageInfo';
              // if image info existed, read content and check thumb image path
              if (await checkPathExist(pathToQAImageInfoFile)) {
                const localQAImageInfo: LocalQAImage = JSON.parse(
                  await readFile(pathToQAImageInfoFile),
                );

                if (await checkPathExist(localQAImageInfo.thumbPath)) {
                  if (
                    !deletedQAImageStack.find(
                      deletedItem =>
                        deletedItem.imageId === localQAImageInfo.imageId,
                    )
                  )
                    thumbnailItem = localQAImageInfo;
                }
              }
              // image info not existed, delete the directory
              else {
                console.log(
                  'FOLDER QA IMAGE IS EXISTED, BUT IMAGE INFO FILE NOT EXISTED=> DELETE FOLDER',
                );
                // await deleteFileSystemWithPath(filePath);
              }
            }
            initialLoop++;
          }
        }

        //* if thumbnail item is valid/ exist => copy the thumbnail of qa image item to the new generated thumb image for qa item
        if (thumbnailItem) {
          const newQAThumbPath = generatePathToQaItemThumbnail(qa);
          await copyFile(thumbnailItem.imagePath, newQAThumbPath);
          // overwrite the new path to the image info file
          const pathToQAImageInfo = getPathToQaImageInfoFile(thumbnailItem);
          await writeFile(
            pathToQAImageInfo,
            JSON.stringify({
              ...thumbnailItem,
              thumbPath: thumbnailItem.imagePath,
            } as LocalQAImage),
          );
          return newQAThumbPath;
        }
      } catch (error) {
        console.log('ERROR handleGetThumbnailLocalQA:', error);

        return undefined;
      }
    },
    [deletedQAImageStack],
  );

  const deleteThumbnailLocalQA = useCallback(async (qa: QA) => {
    try {
      const pathToQaFolder = getPathToQaFolder(qa);
      // qa folder not existed return empty array
      if (!(await checkPathExist(pathToQaFolder))) {
        await createFolder(pathToQaFolder);
        return;
      }
      const pendingFiles = uploadPendingFiles.filter(
        pending => pending.qa.defectId === qa.defectId,
      );
      // get the thumbnail path of qa item
      const pathToThumbNail = await getPathToQaItemThumbnail(qa);
      // if thumbnail path existed=> return the path
      if (
        pathToThumbNail &&
        (await checkPathExist(pathToThumbNail)) &&
        pendingFiles.length === 0
      ) {
        await deleteFileSystemWithPath(pathToThumbNail);
      }
    } catch (error) {
      console.log('ERROR deleteThumbnailLocalQA:', error);
    }
  }, []);
  //*handle download thumb path for qa item
  const handleDownloadQAThumb = async (qa: QAWithFirstImg) => {
    try {
      if (qa.firstImage) {
        const pathToQaFolder = getPathToQaFolder(qa);
        if (!(await checkPathExist(pathToQaFolder))) {
          await createFolder(pathToQaFolder);
        }
        console.log(
          'QA THUMBNAIL NOT FOUND, TRIGGER DOWNLOAD THUMBNAIL FOR QA',
        );
        const newQAThumbPath = generatePathToQaItemThumbnail(qa);
        console.log(
          'NEW PATH CREATED FOR DOWNLOADING THUMB QA:',
          newQAThumbPath,
        );
        const resultDownload = await downloadFile({
          fromUrl: qa.firstImage,
          toFile: newQAThumbPath,
          background: Platform.OS === 'ios' ? true : undefined,
          discretionary: Platform.OS === 'ios' ? true : undefined,
          cacheable: Platform.OS === 'ios' ? false : undefined,
          backgroundTimeout: 10000,
        }).promise;
        if (resultDownload.statusCode) {
          console.log(
            'BYTES WRITTEN:',
            resultDownload.bytesWritten * 0.000001,
            ' Mb',
          );
        }
        if (resultDownload.statusCode === 200) {
          return newQAThumbPath;
        } else {
          console.log('DELETE QA THUMB WHEN STATUS FAILED');
          await deleteFileSystemWithPath(newQAThumbPath);
        }
      } else throw 'NO IMAGE URL';
    } catch (error) {
      console.log('ERROR handleDownloadQAThumb:', error);
    }
  };
  //* handle cache QA Image List
  const handleCacheQAImageList = useCallback(async (qaImageList: QAMedia[]) => {
    console.log(
      'START CACHING QA IMAGE LIST FROM SERVER,qaImageList:',
      qaImageList,
    );
    let finalDownloadedQAImageList: LocalQAImage[] = [];
    try {
      for (const qaImage of qaImageList) {
        const pathToQAImageFolder = getPathToQaImageFolder(qaImage);
        const pathToQAImageInfo = getPathToQaImageInfoFile(qaImage);
        const pathToQAImageFile = getPathToQaImageFile(qaImage);
        if (!(await checkPathExist(pathToQAImageFolder)))
          await createFolder(pathToQAImageFolder);

        // if image info and image file exist => dont need to download and add to the final downloaded list
        if (
          (await checkPathExist(pathToQAImageInfo)) &&
          (await checkPathExist(pathToQAImageFile)) &&
          (await checkPathExist(pathToQAImageFile))
        ) {
          console.log('QA IMAGE AND INFO ALREADY DOWNLOADED');
          finalDownloadedQAImageList.push({
            ...qaImage,
            imagePath: pathToQAImageFile,
            thumbPath: pathToQAImageFile,
            status: 'success',
          });
        }
        // download the image
        else {
          const downloadResult = await handleDownloadQAImage(qaImage);

          //download successful=> replace image path with local image file path
          if (downloadResult) {
            const savedQAImage: LocalQAImage = {
              ...qaImage,
              imagePath: pathToQAImageFile,
              thumbPath: pathToQAImageFile,
              status: 'success',
            };

            await writeFile(pathToQAImageInfo, JSON.stringify(savedQAImage));

            console.log('DOWNLOAD IMAGE SUCCESSFULLY, ADD TO FINAL LIST');
            finalDownloadedQAImageList.push(savedQAImage);
          }
          //download failed
          else {
            console.log('DOWNLOAD FAILED');
            if (qaImage.url)
              finalDownloadedQAImageList.push({
                ...qaImage,
                imagePath: qaImage.url,
                thumbPath: qaImage.url,
                status: 'success',
              });
          }
        }
      }
    } catch (error) {
      console.log('ERROR handleCacheQAImage:', error);
    } finally {
      console.log('finalDownloadedQAImageList:', finalDownloadedQAImageList);
      return finalDownloadedQAImageList;
    }
  }, []);

  //* handle cache single qa image
  const handleCacheSingleQAImage = useCallback(async (qaImage: QAMedia) => {
    try {
      const pathToQAImageFolder = getPathToQaImageFolder(qaImage);
      const pathToQAImageInfo = getPathToQaImageInfoFile(qaImage);
      const pathToQAImageFile = getPathToQaImageFile(qaImage);
      const pathToThumbImgFile = await getPathToQaImageThumbnailFile(qaImage);
      if (!(await checkPathExist(pathToQAImageFolder)))
        await createFolder(pathToQAImageFolder);

      // if image info and image file exist => dont need to download and add to the final downloaded list
      if (
        (await checkPathExist(pathToQAImageInfo)) &&
        ((await checkPathExist(pathToThumbImgFile)) ||
          (await checkPathExist(pathToQAImageFile)))
      ) {
        console.log('QA IMAGE AND INFO ALREADY DOWNLOADED');

        // overwrite local info
        let savedQAImage: LocalQAImage = {
          ...qaImage,
          imagePath: (await checkPathExist(pathToQAImageFile))
            ? pathToQAImageFile
            : pathToThumbImgFile,
          thumbPath: pathToThumbImgFile,
          status: 'success',
        };
        if (await checkPathExist(pathToQAImageFile)) {
          savedQAImage.imagePath = pathToQAImageFile;
          if (await checkPathExist(pathToThumbImgFile))
            savedQAImage.thumbPath = pathToThumbImgFile;
          else savedQAImage.thumbPath = pathToQAImageFile;
        } else {
          savedQAImage.imagePath = pathToThumbImgFile;
          savedQAImage.thumbPath = pathToThumbImgFile;
        }
        await writeFile(pathToQAImageInfo, JSON.stringify(savedQAImage));

        return {
          ...savedQAImage,
          imagePath:
            Platform.OS === 'ios'
              ? savedQAImage.imagePath
              : 'file://' + savedQAImage.imagePath,
          thumbPath:
            Platform.OS === 'ios'
              ? savedQAImage.thumbPath
              : 'file://' + savedQAImage.thumbPath,
        };
      }
      // download qa image item thumb image
      else {
        const targetThumbPathResult = await handleDownloadQAThumbImage(qaImage);

        //download successful=> replace image path with the success downloaded image thumb path
        if (targetThumbPathResult) {
          const savedQAImage: LocalQAImage = {
            ...qaImage,
            imagePath: targetThumbPathResult,
            thumbPath: targetThumbPathResult,
            status: 'success',
          };

          await writeFile(pathToQAImageInfo, JSON.stringify(savedQAImage));

          return {
            ...savedQAImage,
            imagePath:
              Platform.OS === 'ios'
                ? savedQAImage.imagePath
                : 'file://' + savedQAImage.imagePath,
            thumbPath:
              Platform.OS === 'ios'
                ? savedQAImage.thumbPath
                : 'file://' + savedQAImage.thumbPath,
          };
        }
        //download failed
        else {
          console.log('DOWNLOAD FAILED');
          if (qaImage.url)
            return {
              ...qaImage,
              imagePath: qaImage.url,
              thumbPath: qaImage.thumbUrl ?? qaImage.url,
              status: 'success',
            } as LocalQAImage;
        }
      }
    } catch (error) {
      console.log('ERROR handleCacheQAImage:', error);
    }
  }, []);

  const handleSyncQAImageThumb = useCallback(async (qaImage: QAMedia) => {
    try {
      if (qaImage.thumbUrl || qaImage.urlWithMarkup) {
        const pathToQAImageInfo = getPathToQaImageInfoFile(qaImage);
        const localQAImage: LocalQAImage = JSON.parse(
          await readFile(pathToQAImageInfo),
        );

        // generate path to thumb image file
        const pathToQAThumbImageFile =
          generatePathToQaImageThumbnailFile(qaImage);

        const resultDownload = await downloadFile({
          fromUrl: qaImage.urlWithMarkup ?? qaImage.thumbUrl!,
          toFile: pathToQAThumbImageFile,
          background: Platform.OS === 'ios' ? true : undefined,
          discretionary: Platform.OS === 'ios' ? true : undefined,
          cacheable: Platform.OS === 'ios' ? false : undefined,
          backgroundTimeout: 10000,
        }).promise;
        console.log(
          'BYTES WRITTEN:',
          resultDownload.bytesWritten * 0.000001,
          ' Mb',
        );

        // if donwload success=> save to the local qa image info
        if (resultDownload.statusCode === 200) {
          // save to the qa image info

          await writeFile(
            pathToQAImageInfo,
            JSON.stringify({
              ...localQAImage,
              thumbPath: pathToQAThumbImageFile,
            }),
          );
          return pathToQAThumbImageFile;
        } else {
          await deleteFileSystemWithPath(pathToQAThumbImageFile);
          return false;
        }
      } else return false;
    } catch (error) {
      console.log('ERROR handleSyncQAImageThumb:', error);
      return false;
    }
  }, []);
  //* handle collect deleted qa images
  const handleCollectDeletedQAImages = useCallback(
    async (props: {qaItem: QA; qaImageList: QAMedia[]}) => {
      let removedQAImageItems: LocalQAImage[] = [];
      try {
        const {qaImageList, qaItem} = props;
        let deletedQAImageFolderPath = await getDeletedQAImageFolder();

        const localQAImageList = await handleGetLocalQAImages(qaItem);

        //only collect the deleted ones which are already uploaded to server
        localQAImageList
          .filter(localImg => localImg.status === 'success')
          .forEach(localImage => {
            if (
              !qaImageList.find(
                serverImg => localImage.imageId === serverImg.imageId,
              )
            ) {
              const pathToQAImageFolder = getPathToQaImageFolder(localImage);
              deletedQAImageFolderPath.push(pathToQAImageFolder);
              removedQAImageItems.push(localImage);
            }
          });

        console.log('COLLECTED DELETED QA IMAGES:', deletedQAImageFolderPath);
        await writeFile(
          DELETED_QA_IMAGE_FILE_PATH,
          JSON.stringify(deletedQAImageFolderPath),
        );
      } catch (error) {
        console.log('ERROR handleCollectDeletedQAImages:', error);
      } finally {
        return removedQAImageItems;
      }
    },
    [],
  );

  //* handle create multi new qa image folder with new image added
  const handleCreateMultiQAImageFolder = useCallback(
    async (newQaImageList: QAMedia[], qa: QA) => {
      let finalAddedList: LocalQAImage[] = [];
      let finalAddedBatchList: QABatchPendingUpload[] = [];
      try {
        let addedQAImgBatch: LocalQAImage[] = [];
        for await (const newQaImage of newQaImageList) {
          const pathToQAImageFolder = getPathToQaImageFolder(newQaImage);
          const pathToQAImageInfo = getPathToQaImageInfoFile(newQaImage);
          const pathToQAImageFile = getPathToQaImageFile(newQaImage);
          const pathToQAImageThumbFile =
            generatePathToQaImageThumbnailFile(newQaImage);

          // create qa image folder first
          await createFolder(pathToQAImageFolder);

          //*copy the file to thumbnail part
          await copyFile(newQaImage.imagePath, pathToQAImageThumbFile);

          //* move the file to original image
          await moveFile(newQaImage.imagePath, pathToQAImageFile);

          //save the file with pending status
          const savedQAImage: LocalQAImage = {
            ...newQaImage,
            imagePath: pathToQAImageFile,
            thumbPath: pathToQAImageThumbFile,
            imagePathWithMarkup: pathToQAImageFile,
            status: 'pending',
          };

          await writeFile(pathToQAImageInfo, JSON.stringify(savedQAImage));

          // add to the final list to return back to the function to add to global state management
          finalAddedList.push({
            ...savedQAImage,
            imagePath:
              Platform.OS === 'ios'
                ? savedQAImage.imagePath
                : 'file://' + savedQAImage.imagePath,
            thumbPath:
              Platform.OS === 'ios'
                ? savedQAImage.thumbPath
                : 'file://' + savedQAImage.thumbPath,
            imagePathWithMarkup:
              Platform.OS === 'ios'
                ? savedQAImage.imagePathWithMarkup
                : 'file://' + savedQAImage.imagePathWithMarkup,
          });
          //batching every 4 items to avoid upload too much data to server
          addedQAImgBatch.push(savedQAImage);
          if (addedQAImgBatch.length === 4) {
            finalAddedBatchList.push({qa, qaImages: addedQAImgBatch});
            addedQAImgBatch = [];
          }
        }

        if (addedQAImgBatch.length > 0)
          finalAddedBatchList.push({qa, qaImages: addedQAImgBatch});
        //! add the file to the pending file to handling background upload
        const uploadedFiles = [...uploadPendingFiles, ...finalAddedBatchList];
        await writeFile(
          PATH_TO_PENDING_UPLOAD_QA,
          JSON.stringify(uploadedFiles),
        );

        //save to local the pending files
        await handleSavePendingUploadQAImageFile(uploadedFiles);
        setUploadPendingFiles([...uploadedFiles]);
      } catch (error) {
        console.log('ERROR handleCreateNewQAImageFolder:', error);
      } finally {
        return finalAddedList;
      }
    },
    [uploadPendingFiles, setUploadPendingFiles],
  );

  // //* handle create single new qa image folder with new image
  const handleCreateSingleQAImageFolder = useCallback(
    async (newQaImage: QAMedia, qa: QA) => {
      try {
        const pathToQAImageFolder = getPathToQaImageFolder(newQaImage);
        const pathToQAImageInfo = getPathToQaImageInfoFile(newQaImage);
        const pathToQAImageFile = getPathToQaImageFile(newQaImage);

        // create qa image folder first
        await createFolder(pathToQAImageFolder);
        if (await checkPathExist(newQaImage.imagePath)) {
          await moveFile(newQaImage.imagePath, pathToQAImageFile);
          const savedQAImage: LocalQAImage = {
            ...newQaImage,
            imagePath: pathToQAImageFile,
            thumbPath: pathToQAImageFile,
            imagePathWithMarkup: pathToQAImageFile,
            status: 'pending',
          };
          console.log('SAVED FILE:', savedQAImage);
          await writeFile(pathToQAImageInfo, JSON.stringify(savedQAImage));

          const uploadedFiles: QAPendingUploadImageFile = [
            ...uploadPendingFiles,
            {qa, qaImages: [savedQAImage]},
          ];
          console.log('UPLOADED FILES:', uploadedFiles.length);
          await writeFile(
            PATH_TO_PENDING_UPLOAD_QA,
            JSON.stringify(uploadedFiles),
          );

          setUploadPendingFiles(prev => [
            ...prev,
            {qa, qaImages: [savedQAImage]},
          ]);
          return savedQAImage;
        }

        //save the file with pending status
      } catch (error) {
        console.log('ERROR handleCreateNewQAImageFolder:', error);
      }
    },
    [uploadPendingFiles, setUploadPendingFiles],
  );
  //* handle delete qa images folder
  const handleDeleteQAImageFolder = useCallback(async () => {
    try {
      const deletedFolderList = await getDeletedQAImageFolder();
      if (deletedFolderList.length > 0) {
        for (const folder of deletedFolderList) {
          console.log('TRIGGER DELETE QA IMAGE FOLDER:', folder);
          await deleteFileSystemWithPath(folder);
        }
        await unlink(DELETED_QA_IMAGE_FILE_PATH);
      }
    } catch (error) {
      console.log('ERROR handleDeleteQAImageFolder:', error);
    }
  }, []);

  //* handle cache markup
  const handleGetCachedQAImageInfo = useCallback(
    async (qaImage: QAMedia): Promise<LocalQAImage> => {
      try {
        const localQAImgInfo = await getLocalQAImageInfo(qaImage);
        if (localQAImgInfo) return localQAImgInfo;
        else return {...qaImage, status: 'pending'};
      } catch (error) {
        console.log('ERROR handleGetCachedQAImageInfo:', error);
        return {...qaImage, status: 'pending'};
      }
    },
    [],
  );

  //* handle delete single qa image folder
  const handleDeleteSingleQAImageFolder = useCallback(
    async (qaImage: LocalQAImage) => {
      try {
        const pathToQAImageFolder = getPathToQaImageFolder(qaImage);
        await deleteFileSystemWithPath(pathToQAImageFolder);
      } catch (error) {
        console.log('ERROR handleDeleteSingleQAImageFolder:', error);
      }
    },
    [],
  );

  //* handle get all qa image
  const handleUpdateThumbQA = useCallback(
    async (qa: QA) => {
      try {
        const pathToQaFolder = getPathToQaFolder(qa);
        const pathToThumbNail = await getPathToQaItemThumbnail(qa);
        // qa folder not existed => delete the thumb image
        if (!(await checkPathExist(pathToQaFolder))) {
          if (pathToThumbNail) await deleteFileSystemWithPath(pathToThumbNail);
          return;
        }

        let localQAImages: LocalQAImage[] = [];
        const localQAFolderData: ReadDirItem[] = await readDir(pathToQaFolder);

        if (localQAFolderData.length > 0) {
          for (const localQAData of localQAFolderData) {
            const filePath = localQAData.path;
            //which file is folder=> qa image folder
            if (localQAData.isDirectory()) {
              const pathToQAImageInfoFile = filePath + '/imageInfo';
              // if image info existed, read content and add to final list
              if (await checkPathExist(pathToQAImageInfoFile)) {
                const localQAImageInfo: LocalQAImage = JSON.parse(
                  await readFile(pathToQAImageInfoFile),
                );

                localQAImages.push({
                  ...localQAImageInfo,
                  imagePath:
                    Platform.OS === 'ios'
                      ? localQAImageInfo.imagePath
                      : 'file://' + localQAImageInfo.imagePath,
                  thumbPath:
                    Platform.OS === 'ios'
                      ? localQAImageInfo.thumbPath
                      : 'file://' + localQAImageInfo.thumbPath,
                });
              }
              // image info not existed, delete the directory
              else {
                console.log(
                  'FOLDER QA IMAGE IS EXISTED, BUT IMAGE INFO FILE NOT EXISTED=> DELETE FOLDER',
                );
                // await deleteFileSystemWithPath(filePath);
              }
            }
          }
        }

        const validImages = localQAImages.filter(
          qaImages =>
            !deletedQAImageStack.some(
              deletedItem => deletedItem.imageId === qaImages.imageId,
            ),
        );
        // if no image found=> delete thumb image of qa item
        if (validImages.length === 0) {
          if (pathToThumbNail) await deleteFileSystemWithPath(pathToThumbNail);
        } else {
          const pathToThumbNail = await getPathToQaItemThumbnail(qa);

          let thumbnailItem: LocalQAImage | undefined = undefined;

          let initialLoop: number = validImages.length - 1;
          while (initialLoop >= 0 && !thumbnailItem) {
            const localImgItem = validImages[initialLoop];

            if (await checkPathExist(localImgItem.imagePathWithMarkup)) {
              thumbnailItem = localImgItem;
            } else if (await checkPathExist(localImgItem.thumbPath))
              thumbnailItem = {
                ...localImgItem,
                imagePathWithMarkup: localImgItem.thumbPath,
              };
            else if (await checkPathExist(localImgItem.imagePath))
              thumbnailItem = {
                ...localImgItem,
                imagePathWithMarkup: localImgItem.imagePath,
              };

            initialLoop--;
          }

          //* if thumbnail item is valid/ exist => copy the thumbnail of qa image item to the new generated thumb image for qa item
          if (thumbnailItem) {
            // delete the old thumb image
            if (pathToThumbNail)
              await deleteFileSystemWithPath(pathToThumbNail);
            const newQAThumbPath = generatePathToQaItemThumbnail(qa);
            await copyFile(thumbnailItem.imagePathWithMarkup, newQAThumbPath);
          }
        }
      } catch (error) {
        console.log('ERROR handleUpdateThumbQA:', error);
      }
    },
    [deletedQAImageStack],
  );

  //* handle cache markup
  const handleSaveLocalQAMarkupList = useCallback(
    async (props: {
      qaImage: QAMedia;
      markupList: Array<
        | QAMarkupRectangle
        | QAMarkupCircle
        | QAMarkupStraightLine
        | QAMarkupLabel
        | QAMarkupArrow
        | QAMarkupPath
      >;
    }) => {
      const {qaImage, markupList} = props;
      try {
        const pathToQAImageInfo = getPathToQaImageInfoFile(qaImage);

        const localQAImgInfo = await getLocalQAImageInfo(qaImage);
        if (localQAImgInfo)
          await writeFile(
            pathToQAImageInfo,
            JSON.stringify({
              ...localQAImgInfo,
              markup: markupList,
            } as LocalQAImage),
          );

        return markupList;
      } catch (error) {
        console.log('ERROR handleSaveLocalQAMarkupList:', error);
        return [];
      }
    },
    [],
  );

  const handleSaveLocalQAImgWithMarkupAsThumbnail = useCallback(
    async (props: {qaImage: QAMedia; imgWithMarkupPath: string}) => {
      const {qaImage, imgWithMarkupPath} = props;

      try {
        const pathToQAImageThumb = await getPathToQaImageThumbnailFile(qaImage);
        const pathToQAImageInfo = getPathToQaImageInfoFile(qaImage);

        if (await checkPathExist(pathToQAImageThumb))
          await deleteFileSystemWithPath(pathToQAImageThumb);
        const newThumbPath = generatePathToQaImageThumbnailFile(qaImage);
        await copyFile(imgWithMarkupPath, newThumbPath);
        const localQAImgInfo = await getLocalQAImageInfo(qaImage);
        if (localQAImgInfo) {
          console.log(
            'handleSaveLocalQAImgWithMarkupAsThumbnail, LOCAL DETECTED AND SAVE IMG PATH WITH THUMB',
          );
          await writeFile(
            pathToQAImageInfo,
            JSON.stringify({
              ...localQAImgInfo,
              thumbPath: newThumbPath,
            } as LocalQAImage),
          );

          return Platform.OS === 'ios'
            ? newThumbPath
            : 'file://' + newThumbPath;
        }
      } catch (error) {
        console.log('ERROR handleSaveLocalQAImgWithMarkupAsThumbnail:', error);
      }
    },
    [],
  );

  //* handle save screenshot qaImg with markup
  const handleSaveScreenShotQAImageWithMarkup = async (props: {
    qaImg: LocalQAImage;
    screenShotUri: string;
  }) => {
    try {
      const pathToMarkupPendingFile = getPathToPendingQaImageWithMarkupFile(
        props.qaImg,
      );
      const pathToQAImageThumb = await getPathToQaImageThumbnailFile(
        props.qaImg,
      );

      const pathToQAImageInfo = getPathToQaImageInfoFile(props.qaImg);
      if (await checkPathExist(pathToQAImageThumb))
        await deleteFileSystemWithPath(pathToQAImageThumb);

      const newThumbPath = generatePathToQaImageThumbnailFile(props.qaImg);

      // copy the screenshot to the thumb path
      await copyFile(props.screenShotUri, newThumbPath);

      // move the screenshot to the path of pending image with markup to upload
      await moveFile(props.screenShotUri, pathToMarkupPendingFile);
      const localQAImgInfo = await getLocalQAImageInfo(props.qaImg);
      if (localQAImgInfo) {
        console.log(
          'handleSaveLocalQAImgWithMarkupAsThumbnail, LOCAL DETECTED AND SAVE IMG PATH WITH THUMB',
        );
        await writeFile(
          pathToQAImageInfo,
          JSON.stringify({
            ...localQAImgInfo,
            thumbPath: newThumbPath,
          } as LocalQAImage),
        );

        return Platform.OS === 'ios' ? newThumbPath : 'file://' + newThumbPath;
      }
    } catch (error) {
      console.log('ERROR handleSaveScreenShotQAImageWithMarkup: ', error);
    }
  };
  //* handle get markup image
  const handleGetCachedQAMarkupList = useCallback(async (qaImage: QAMedia) => {
    try {
      const pathToQAImageFolder = getPathToQaImageFolder(qaImage);
      const pathToQAMarkupFile = getPathToQaImageMarkupFile(qaImage);
      if (
        !(await checkPathExist(pathToQAImageFolder)) ||
        !(await checkPathExist(pathToQAMarkupFile))
      ) {
        console.log('IMAGE FOLDER OR MARKUP FILE NOT NOT EXISTED, RETURN');
        return [];
      }
      const resultCacheMarkup = JSON.parse(
        await readFile(pathToQAMarkupFile),
      ) as Array<
        | QAMarkupRectangle
        | QAMarkupCircle
        | QAMarkupStraightLine
        | QAMarkupLabel
        | QAMarkupArrow
        | QAMarkupPath
      >;
      return resultCacheMarkup;
    } catch (error) {
      console.log('ERROR handleSaveLocalQAMarkupList:', error);
      return [];
    }
  }, []);

  //* handle Remove Cache markup image
  const handleRemoveCachedQAMarkup = useCallback(async (qaImage: QAMedia) => {
    try {
      const pathToQAImageInfoFile = getPathToQaImageInfoFile(qaImage);
      if (await checkPathExist(pathToQAImageInfoFile)) {
        const localQAImageInfo = JSON.parse(
          await readFile(pathToQAImageInfoFile),
        ) as LocalQAImage;
        await writeFile(
          pathToQAImageInfoFile,
          JSON.stringify({...localQAImageInfo, markup: []} as LocalQAImage),
        );
      }
    } catch (error) {
      console.log('ERROR handleRemoveCachedQAMarkup:', error);
      return [];
    }
  }, []);

  const handleSaveQAThumbnailMarkup = useCallback(
    async (props: {qaImage: QAMedia; thumbUri: string}) => {
      try {
        const {qaImage, thumbUri} = props;
        const pathToQAThumbNail = await getPathToQAItemThumbNailWithQAImg(
          qaImage,
        );

        if (await checkPathExist(pathToQAThumbNail))
          await deleteFileSystemWithPath(pathToQAThumbNail);
        const newQAThumbPath = generatePathToQaItemThumbnailWithQAImg(qaImage);
        //* replace the markup thumbnail file in qa folder by the new thumb
        await copyFile(thumbUri, newQAThumbPath);
      } catch (error) {
        console.log('ERROR handleSaveQAThumbnailMarkup:', error);
      }
    },
    [],
  );

  const handleCreateTempPdf = async (props: {
    data64: string;
    nameFile: string;
  }) => {
    const {data64, nameFile} = props;
    console.log('DATA 64 PDF:', data64);
    console.log('NAME FILE PDF:', nameFile);
    try {
      if (!(await checkPathExist(PATH_TO_TEMP_PDF_FOLDER)))
        await createFolder(PATH_TO_TEMP_PDF_FOLDER);

      const pathToTempQaPdf = PATH_TO_TEMP_PDF_FOLDER + `/${nameFile}`;

      const resultDownload = await downloadFile({
        fromUrl: data64,
        toFile: pathToTempQaPdf,
        background: Platform.OS === 'ios' ? true : undefined,
        discretionary: Platform.OS === 'ios' ? true : undefined,
        cacheable: Platform.OS === 'ios' ? false : undefined,
      }).promise;
      console.log(resultDownload);
      if (resultDownload.statusCode) {
        console.log(
          'BYTES WRITTEN DOWNLOAD PDF:',
          resultDownload.bytesWritten * 0.000001,
          ' Mb',
        );
      }
      if (resultDownload.statusCode === 200) {
        return pathToTempQaPdf;
      }
    } catch (error) {
      console.log('error handleCreateTempPdf:', error);
      return undefined;
    }
  };

  const handleDeleteTempCachePdfFolder = async () => {
    try {
      await deleteFileSystemWithPath(PATH_TO_TEMP_PDF_FOLDER);
    } catch (error) {
      console.log('ERROR handleDeleteTempCachePdfFolder:', error);
    }
  };

  const handleGetFullSizeImgForMarkup = useCallback(
    async (qaImage: LocalQAImage) => {
      try {
        const pathToQAImageFile = getPathToQaImageFile(qaImage);

        if (await checkPathExist(pathToQAImageFile)) {
          console.log('IMG FULL SIZE ALREADY DOWNLOADED');
          return Platform.OS === 'ios'
            ? pathToQAImageFile
            : 'file://' + pathToQAImageFile;
        } else {
          const resultDownload = await handleDownloadQAImage(qaImage);
          if (resultDownload) {
            console.log('SUCCESS DOWNLOADED IMG ');
            const localQAImageInfo = await getLocalQAImageInfo(qaImage);
            const savedQAImage: LocalQAImage = localQAImageInfo
              ? {
                  ...localQAImageInfo,
                  imagePath: pathToQAImageFile,

                  status: 'success',
                }
              : {
                  ...qaImage,
                  imagePath: pathToQAImageFile,

                  status: 'success',
                };
            const pathToQAImageInfo = getPathToQaImageInfoFile(qaImage);
            await writeFile(pathToQAImageInfo, JSON.stringify(savedQAImage));

            return Platform.OS === 'ios'
              ? pathToQAImageFile
              : 'file://' + pathToQAImageFile;
          }
        }
      } catch (error) {
        console.log('ERROR handleGetFullSizeImgForMarkup:', error);
        return undefined;
      }
    },
    [],
  );
  const qaStore = useRef(createQAStore({})).current;
  const cacheQAContext: CacheQAContextValue = useMemo(
    () => ({
      qaStore,
      handleCachingQAProject,
      handleDeleteExpiredProjectFolder,
      handleCachingQAList,
      handleCollectExpiredQAListFolder,
      handleDeleteExpiredQAListFolder,
      handleCollectExpiredQAFolder,
      handleDeleteExpiredQAFolder,
      handleCachingQA,
      handleGetLocalQAImages,

      handleCacheQAImageList,
      handleCollectDeletedQAImages,
      handleDeleteQAImageFolder,
      handleDeleteSingleQAImageFolder,
      handleSaveLocalQAMarkupList,
      handleGetCachedQAMarkupList,
      handleRemoveCachedQAMarkup,
      handleDeleteSingleQAFolder,
      handleCreateSignatureFile,
      handleGetCachedQAListSignatureFile,
      handleDeleteCachedQAListSignatureFile,
      handleGetCachedQAListPDFFile,
      handleDownloadPdfFile,
      handleCreateTempPdf,
      handleDeleteTempCachePdfFolder,
      handleCacheSingleQAImage,
      handleCreateMultiQAImageFolder,
      uploadPendingFiles,
      setUploadPendingFiles,
      handleSaveScreenShotQAImageWithMarkup,
      handleCreateSingleQAImageFolder,
      setDeletedQAImageStack,
      handleGetThumbnailLocalQA,
      handleSaveQAThumbnailMarkup,
      handleGetFullSizeImgForMarkup,
      handleSaveLocalQAImgWithMarkupAsThumbnail,
      handleGetCachedQAImageInfo,
      handleDownloadQAThumb,
      handleUpdateThumbQA,
      deleteThumbnailLocalQA,
      handleSyncQAImageThumb,
    }),
    [
      qaStore,
      handleCachingQAProject,
      handleDeleteExpiredProjectFolder,
      handleCachingQAList,
      handleCollectExpiredQAListFolder,
      handleDeleteExpiredQAListFolder,
      handleCollectExpiredQAFolder,
      handleDeleteExpiredQAFolder,
      handleGetLocalQAImages,

      handleCacheQAImageList,
      handleCollectDeletedQAImages,
      handleDeleteQAImageFolder,
      handleDeleteSingleQAImageFolder,
      handleSaveLocalQAMarkupList,
      handleGetCachedQAMarkupList,
      handleRemoveCachedQAMarkup,
      handleDeleteSingleQAFolder,
      handleCreateSignatureFile,
      handleGetCachedQAListSignatureFile,
      handleDeleteCachedQAListSignatureFile,
      handleGetCachedQAListPDFFile,
      handleDownloadPdfFile,
      handleCreateTempPdf,
      handleDeleteTempCachePdfFolder,
      handleCacheSingleQAImage,
      handleCreateMultiQAImageFolder,
      uploadPendingFiles,
      setUploadPendingFiles,
      handleSaveScreenShotQAImageWithMarkup,
      handleCreateSingleQAImageFolder,
      setDeletedQAImageStack,
      handleGetThumbnailLocalQA,
      handleSaveQAThumbnailMarkup,
      handleGetFullSizeImgForMarkup,
      handleSaveLocalQAImgWithMarkupAsThumbnail,
      handleGetCachedQAImageInfo,
      handleDownloadQAThumb,
      handleUpdateThumbQA,
      deleteThumbnailLocalQA,
      handleSyncQAImageThumb,
    ],
  );
  return <CacheQAContext.Provider {...children} value={cacheQAContext} />;
};
export const useCacheQAContext = () =>
  useContext(CacheQAContext) as CacheQAContextValue;
export default CacheQAProvider;

const styles = StyleSheet.create({});
