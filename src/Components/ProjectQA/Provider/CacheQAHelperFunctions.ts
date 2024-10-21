import {Platform} from 'react-native';

import {
  ReadDirItem,
  copyFile,
  downloadFile,
  mkdir,
  readDir,
  readFile,
  writeFile,
  DocumentDirectoryPath,
  read,
} from 'react-native-fs';
import {
  checkPathExist,
  createLocalFolder,
  deleteFileSystemWithPath,
} from '../../../Utilities/FunctionUtilities';
import {
  DeletedQaImageFile,
  ExpiredProjectFile,
  ExpiredQAFile,
  ExpiredQAListFile,
  IQAVideoUploadData,
  LocalQA,
  LocalQAImage,
  LocalQAImageStatus,
  LocalQAList,
  LocalQAProject,
  QAPendingUploadImageFile,
  TQAVideoUploadStatus,
} from './CacheQAType';
import {Project} from '../../../Models/project';
import {QA, QAList, QAMedia} from '../../../Models/qa';
import {
  DELETED_QA_IMAGE_FILE_PATH,
  EXPIRED_PROJECT_FILE_PATH,
  EXPIRED_QA_FILE_PATH,
  EXPIRED_QA_LIST_FILE_PATH,
  PATH_TO_ERROR_UPLOAD_QA,
  PATH_TO_PENDING_DELETE_QA,
  PATH_TO_PENDING_UPLOAD_QA,
  ROOT_LOCAL_QA_FOLDER_PATH,
  ROOT_LOCAL_QA_IMAGE_FOLDER_PATH,
  ROOT_QA_ALL_VIDEO_INFO_FILES,
  ROOT_QA_CACHE_VIDEO_FOLDER_PATH,
} from './QAFileDirPath';

//* create root summary folder, get called when first initialize the provider
export const createRootQAFolder = async () => {
  try {
    const isExistedDefectPhotoFolder: boolean = await checkPathExist(
      ROOT_LOCAL_QA_IMAGE_FOLDER_PATH,
    );
    if (!isExistedDefectPhotoFolder)
      return await createLocalFolder(ROOT_LOCAL_QA_IMAGE_FOLDER_PATH);
    else
      console.log(
        'ALREADY CREATED ROOT QA FOLDER',
        ROOT_LOCAL_QA_IMAGE_FOLDER_PATH,
      );
    await createExpiredCollectorFiles();
  } catch (error) {
    console.error('FAILED createRootQAFolder:', error);
    return false;
  }
};

//* create expired collector files
export const createExpiredCollectorFiles = async () => {
  try {
    const expiredProjectFile: ExpiredProjectFile = [];
    const expiredQaListFile: ExpiredQAListFile = [];
    // create project expired folder
    if (!(await checkPathExist(ROOT_LOCAL_QA_IMAGE_FOLDER_PATH)))
      await createRootQAFolder();
    await writeFile(
      EXPIRED_PROJECT_FILE_PATH,
      JSON.stringify(expiredProjectFile),
    );
  } catch (error) {
    console.log('ERROR createExpiredCollectorFiles:', error);
    return false;
  }
};

//----> QA Project
//* get path to project folder
export const getPathToQAProjectFolder = (projectId: string) => {
  return ROOT_LOCAL_QA_IMAGE_FOLDER_PATH + `/${projectId}`;
};

//* handle create qa project folder
export const handleCreateQAProjectFolder = async (project: Project) => {
  try {
    const pathToProjectFolder = getPathToQAProjectFolder(project.projectId);

    const resultCreateProjectFolder = await createLocalFolder(
      pathToProjectFolder,
    );

    //! only create projectInfo if create project folder is success
    if (resultCreateProjectFolder) {
      handleSaveProjectInfo(project);
    }
  } catch (error) {
    console.log('FAILED handleCreateQAProjectFolder:', error);
    return false;
  }
};

//* handle save project info
export const handleSaveProjectInfo = async (project: Project) => {
  try {
    const pathToProjectFolder = getPathToQAProjectFolder(project.projectId);
    const pathToProjectInfo = pathToProjectFolder + '/projectInfo';
    if (await checkPathExist(pathToProjectFolder)) {
      const expiredProjectFolderTime: number =
        Math.floor(new Date().getTime() / 1000) + 2592000; //30 days

      const localProjectInfo: LocalQAProject = {
        ...project,
        expired: expiredProjectFolderTime,
      };
      await writeFile(pathToProjectInfo, JSON.stringify(localProjectInfo));

      //# check if the project folder is in the expiredProject file=>remove from the expired project file
      const expiredProjectFile = await getExpiredProjectFile();

      if (
        expiredProjectFile.length > 0 &&
        expiredProjectFile.find(
          expiredFile => expiredFile.projectId === project.projectId,
        ) !== undefined
      ) {
        const newExpiredProjectFile = expiredProjectFile.filter(
          expiredFile => expiredFile.projectId !== project.projectId,
        );

        await writeFile(
          EXPIRED_PROJECT_FILE_PATH,
          JSON.stringify(newExpiredProjectFile),
        );

        console.log('PROJECT ', project.siteAddress, ' is reset expired');
      }
      return true;
    } else {
      console.log('pathToProjectFolder not exist');
      return false;
    }
  } catch (error) {
    console.log('FAILED handleSaveProjectInfo:', error);
    return false;
  }
};

//* get expired project file
export const getExpiredProjectFile = async (): Promise<ExpiredProjectFile> => {
  try {
    if (!(await checkPathExist(EXPIRED_PROJECT_FILE_PATH))) return [];
    const expiredProjectFile = JSON.parse(
      await readFile(EXPIRED_PROJECT_FILE_PATH),
    ) as ExpiredProjectFile;
    // console.log('EXPIRED PROJECT FILE:', expiredProjectFile);

    return expiredProjectFile;
  } catch (error) {
    console.log('ERROR getExpiredProjectFile:', error);

    return [];
  }
};

//* handle collect expired project folder
export const handleCollectExpiredProjectFolder = async () => {
  try {
    // only proceed further if the qa folder is exist
    if (!(await checkPathExist(ROOT_LOCAL_QA_IMAGE_FOLDER_PATH))) return;
    const localQAFolderData: ReadDirItem[] = await readDir(
      ROOT_LOCAL_QA_IMAGE_FOLDER_PATH,
    );
    const currentTime = new Date().getTime() / 1000;
    let expiredProject: ExpiredProjectFile = [];
    if (localQAFolderData.length > 0) {
      for (const localQAFile of localQAFolderData) {
        const filePath = localQAFile.path;
        //which file is folder=> project id folder
        if (localQAFile.isDirectory()) {
          const pathToProjectInfoFile = filePath + '/projectInfo';
          if (await checkPathExist(pathToProjectInfoFile)) {
            const localQAProjectInfo: LocalQAProject = JSON.parse(
              await readFile(pathToProjectInfoFile),
            );

            if (localQAProjectInfo.expired < currentTime)
              expiredProject.push({
                projectId: localQAProjectInfo.projectId,
                pathToProjectFolder: filePath, //get the project folder path
              });
          }
        }
      }
    }

    await writeFile(EXPIRED_PROJECT_FILE_PATH, JSON.stringify(expiredProject));
  } catch (error) {
    console.log('ERROR handleCollectExpiredProjectFolder:', error);
  }
};
//<---------

//---> QA LIST
//* get path to qa list folder
export const getPathToQaListFolder = (qaList: QAList) => {
  return (
    getPathToQAProjectFolder(qaList.project ?? 'NullProject') +
    `/${qaList.defectListId}`
  );
};
//* get path to qa list info file
export const getPathToQaListInfoFile = (qaList: QAList) => {
  return (
    getPathToQAProjectFolder(qaList.project ?? 'NullProject') +
    `/${qaList.defectListId}/qaListInfo`
  );
};

//* get path to qa list signature file
export const getPathToQaListSignatureFile = (qaList: QAList) => {
  return (
    getPathToQAProjectFolder(qaList.project ?? 'NullProject') +
    `/${qaList.defectListId}/signature`
  );
};

//* get path to qa list pdf file
export const getBasePathToQaListPdfFile = (qaList: QAList) => {
  return (
    getPathToQAProjectFolder(qaList.project ?? 'NullProject') +
    `/${qaList.defectListId}/${qaList.defectListTitle.replace('/', '-')}.pdf`
  );
};

//* get expired qa list file
export const getExpiredQAListFile = async (): Promise<ExpiredQAListFile> => {
  try {
    if (!(await checkPathExist(EXPIRED_QA_LIST_FILE_PATH))) return [];
    const expiredQaListFile = JSON.parse(
      await readFile(EXPIRED_QA_LIST_FILE_PATH),
    ) as ExpiredQAListFile;
    // console.log('EXPIRED QA LIST FILE:', expiredQaListFile);

    return expiredQaListFile;
  } catch (error) {
    console.log('ERROR getExpiredProjectFile:', error);

    return [];
  }
};
//* handle save qa list info
export const handleSaveQAListInfo = async (qaList: QAList) => {
  try {
    const pathToQaListFolder = getPathToQaListFolder(qaList);
    const pathToQaListInfo = getPathToQaListInfoFile(qaList);

    //proceed if qa list folder existed
    if (await checkPathExist(pathToQaListFolder)) {
      const expiredQAListFolderTime: number =
        Math.floor(new Date().getTime() / 1000) + 2419200; //28 days

      const localQaListInfo: LocalQAList = {
        ...qaList,
        expired: expiredQAListFolderTime,
      };
      // console.log('SAVE NEW INFO QA LIST:', localQaListInfo);
      await writeFile(pathToQaListInfo, JSON.stringify(localQaListInfo));

      //cache pdf file
      if (qaList.pdfUrl) {
        const pathToQAListPdfFile = getBasePathToQaListPdfFile(qaList);
        const resultDownload = await downloadFile({
          fromUrl: qaList.pdfUrl,
          toFile: pathToQAListPdfFile,
          background: Platform.OS === 'ios' ? true : undefined,
          discretionary: Platform.OS === 'ios' ? true : undefined,
          cacheable: Platform.OS === 'ios' ? false : undefined,
        }).promise;

        if (resultDownload.statusCode) {
          // console.log(
          //   'BYTES WRITTEN DOWNLOAD PDF:',
          //   resultDownload.bytesWritten * 0.000001,
          //   ' Mb',
          // );
        }
        if (resultDownload.statusCode === 200) {
        } else deleteFileSystemWithPath(pathToQAListPdfFile);
      }

      //cache signature file
      if (qaList.signatureUrl) {
        const pathToQAListSignatureFile = getPathToQaListSignatureFile(qaList);
        const resultDownload = await downloadFile({
          fromUrl: qaList.signatureUrl,
          toFile: pathToQAListSignatureFile,
          background: Platform.OS === 'ios' ? true : undefined,
          discretionary: Platform.OS === 'ios' ? true : undefined,
          cacheable: Platform.OS === 'ios' ? false : undefined,
        }).promise;

        if (resultDownload.statusCode) {
          console
            .log
            // 'BYTES WRITTEN DOWNLOAD SIGNATURE:',
            // resultDownload.bytesWritten * 0.000001,
            // ' Mb',
            ();
        }
        if (resultDownload.statusCode === 200) {
        } else deleteFileSystemWithPath(pathToQAListSignatureFile);
      }

      //# check if the qa list folder is in the expiredQaList file=>remove from the expired qa list file
      const expiredQaListFile = await getExpiredQAListFile();

      if (
        expiredQaListFile.length > 0 &&
        expiredQaListFile.find(
          expiredFile => expiredFile.qaListId === qaList.defectListId,
        ) !== undefined
      ) {
        const newExpiredQaListFile = expiredQaListFile.filter(
          expiredFile => expiredFile.qaListId !== qaList.defectListId,
        );

        await writeFile(
          EXPIRED_QA_LIST_FILE_PATH,
          JSON.stringify(newExpiredQaListFile),
        );

        console.log(
          'QA List ',
          qaList.defectListTitle,
          ' is reset expired time',
        );
      }
      return true;
    } else {
      console.log('pathToQaListFolder not exist, not saving');
      return false;
    }
  } catch (error) {
    console.log('FAILED handleSaveQAListInfo:', error);
    return false;
  }
};

//* handle create qa list folder
export const handleCreateQAListFolder = async (qaList: QAList) => {
  try {
    const pathToQaListFolder = getPathToQaListFolder(qaList); //form path to qa list folder
    const resultCreateQAListFolder = await createLocalFolder(
      pathToQaListFolder,
    ); //create qa list folder

    //save qa list info if create successfully
    if (resultCreateQAListFolder) handleSaveQAListInfo(qaList);
  } catch (error) {
    console.log('FAILED handleSaveQAListInfo:', error);
    return false;
  }
};

//<------

//-----> QA
//* get path to qa list folder
export const getPathToQaFolder = (qa: QA) => {
  return (
    getPathToQAProjectFolder(qa.project ?? 'NullProject') +
    `/${qa.defectList}/${qa.defectId}`
  );
};
export const getPathToQaFolderWithQAImg = (qaImg: QAMedia) => {
  return (
    getPathToQAProjectFolder(qaImg.project ?? 'NullProject') +
    `/${qaImg.defectList}/${qaImg.defect}`
  );
};
//* get path to qa list info file
export const getPathToQaInfoFile = (qa: QA) => {
  return (
    getPathToQAProjectFolder(qa.project ?? 'NullProject') +
    `/${qa.defectList}/${qa.defectId}/qaInfo`
  );
};

export const getBasePathToQAThumbnailWithQA = (qa: QA) => {
  return (
    getPathToQAProjectFolder(qa.project ?? 'NullProject') +
    `/${qa.defectList}/${qa.defectId}/qaThumbnail`
  );
};
export const getBasePathToQAThumbnailWithQAImg = (qaImg: QAMedia) => {
  return (
    getPathToQAProjectFolder(qaImg.project ?? 'NullProject') +
    `/${qaImg.defectList}/${qaImg.defect}/qaThumbnail`
  );
};
export const getPathToQaItemThumbnail = async (qa: QA) => {
  try {
    //get the base path to qa thumb image
    const baseThumbQAPath = getBasePathToQAThumbnailWithQA(qa);
    // get the path to qa folder
    const pathToQAFolder = getPathToQaFolder(qa);
    //check if the qa folder is exist, if not return
    if (!(await checkPathExist(pathToQAFolder))) return;

    //get the local files in the qa folder
    const qaFolderLocalFiles: ReadDirItem[] = await readDir(pathToQAFolder);
    //check if there is any file in the folder
    if (qaFolderLocalFiles.length > 0) {
      //check if any file path contain the conventional base path to qa thumb image
      const thumbPath = qaFolderLocalFiles.find(
        localFile =>
          localFile.isFile() && localFile.path.includes(baseThumbQAPath),
      );
      //if found=>return the path
      if (thumbPath) return thumbPath.path;
    }
  } catch (error) {
    console.log('ERROR getPathToQaItemThumbnail:', error);
  }
};

export const getPathToQAItemThumbNailWithQAImg = async (qaImg: QAMedia) => {
  try {
    const baseThumbQAPath = getBasePathToQAThumbnailWithQAImg(qaImg);
    const pathToQAFolder = getPathToQaFolderWithQAImg(qaImg);
    const qaFolderLocalFiles: ReadDirItem[] = await readDir(pathToQAFolder);

    if (qaFolderLocalFiles.length > 0) {
      //check if any file path contain the conventional base path to qa thumb image
      const thumbPath = qaFolderLocalFiles.find(
        localFile =>
          localFile.isFile() && localFile.path.includes(baseThumbQAPath),
      );

      if (thumbPath) return thumbPath.path;
      else return '';
    }
    return '';
  } catch (error) {
    console.log('ERROR getPathToQaItemThumbnail:', error);
    return '';
  }
};

//* generate qa thumb path with qa img
export const generatePathToQaItemThumbnail = (qa: QA) => {
  const pathBase = getBasePathToQAThumbnailWithQA(qa);
  return `${pathBase}&${new Date().getTime()}.jpeg`;
};

//* generate qa thumb path with qa img
export const generatePathToQaItemThumbnailWithQAImg = (qaImage: QAMedia) => {
  const pathBase = getBasePathToQAThumbnailWithQAImg(qaImage);
  return `${pathBase}&${new Date().getTime()}.jpeg`;
};

//* get expired qa list file
export const getExpiredQAFile = async (): Promise<ExpiredQAFile> => {
  try {
    if (!(await checkPathExist(EXPIRED_QA_FILE_PATH))) return [];
    const expiredQaListFile = JSON.parse(
      await readFile(EXPIRED_QA_FILE_PATH),
    ) as ExpiredQAFile;
    // console.log('EXPIRED QA FILE:', expiredQaListFile);

    return expiredQaListFile;
  } catch (error) {
    console.log('ERROR getExpiredQAFile:', error);

    return [];
  }
};

//* handle create qa folder
export const handleCreateQAFolder = async (qa: QA) => {
  try {
    const pathToQaFolder = getPathToQaFolder(qa); //form path to qa folder
    const resultCreateQAFolder = await createLocalFolder(pathToQaFolder); //create qa folder

    //save qa info if create successfully
    if (resultCreateQAFolder) handleSaveQAInfo(qa);
  } catch (error) {
    console.log('FAILED handleSaveQAListInfo:', error);
    return false;
  }
};

//* handle save qa  info
export const handleSaveQAInfo = async (qa: QA) => {
  try {
    const pathToQaFolder = getPathToQaFolder(qa);
    const pathToQaInfo = getPathToQaInfoFile(qa);

    //proceed if qa list folder existed
    if (await checkPathExist(pathToQaFolder)) {
      const expiredQAFolderTime: number =
        Math.floor(new Date().getTime() / 1000) + 2419200; //28 days

      const localQaInfo: LocalQA = {
        ...qa,
        expired: expiredQAFolderTime,
      };
      console.log('SAVE NEW INFO QA :', localQaInfo);
      await writeFile(pathToQaInfo, JSON.stringify(localQaInfo));

      //# check if the qa list folder is in the expiredQaList file=>remove from the expired qa list file
      const expiredQaFile = await getExpiredQAFile();

      if (
        expiredQaFile.length > 0 &&
        expiredQaFile.find(expiredFile => expiredFile.qaId === qa.defectId) !==
          undefined
      ) {
        const newExpiredQaFile = expiredQaFile.filter(
          expiredFile => expiredFile.qaId !== qa.defectId,
        );

        await writeFile(EXPIRED_QA_FILE_PATH, JSON.stringify(newExpiredQaFile));

        console.log('QA List ', qa.description, ' is reset expired time');
      }
      return true;
    } else {
      console.log('pathToQaListFolder not exist, not saving');
      return false;
    }
  } catch (error) {
    console.log('FAILED handleSaveQAListInfo:', error);
    return false;
  }
};
//<-------

//----> QA Image
//* get path to qa image folder
export const getPathToQaImageFolder = (qaImage: QAMedia) => {
  return (
    getPathToQAProjectFolder(qaImage.project ?? 'NullProject') +
    `/${qaImage.defectList}/${qaImage.defect}/${qaImage.imageId}`
  );
};

//* get path to qa image info file
export const getPathToQaImageInfoFile = (qaImage: QAMedia) => {
  return getPathToQaImageFolder(qaImage) + `/imageInfo`;
};

//* get path to qa image file
export const getPathToQaImageFile = (qaImage: QAMedia) => {
  return getPathToQaImageFolder(qaImage) + `/originalImg.jpeg`;
};

const getBasePathToQAImageThumbnailFile = (qaImage: QAMedia) => {
  return getPathToQaImageFolder(qaImage) + `/thumbImg`;
};
//* get path to qa thumb image file
export const getPathToQaImageThumbnailFile = async (qaImage: QAMedia) => {
  try {
    const baseThumbPath = getBasePathToQAImageThumbnailFile(qaImage);
    const pathToQAImageFolder = getPathToQaImageFolder(qaImage);
    if (!(await checkPathExist(pathToQAImageFolder))) return '';
    const qaImageLocalFiles: ReadDirItem[] = await readDir(pathToQAImageFolder);

    if (qaImageLocalFiles.length > 0) {
      //check if any file path contain the conventional base path to qa thumb image
      const thumbPath = qaImageLocalFiles.find(
        localFile =>
          localFile.isFile() && localFile.path.includes(baseThumbPath),
      );
      console.log('THUMB ITEM QA IMAGE PATH FOUND:', thumbPath);
      if (thumbPath) return thumbPath.path;
      else return '';
    }
    return '';
  } catch (error) {
    console.log('ERROR getPathToQaImageThumbnailFile:', error);
    return '';
  }
};

//* generate qa image thumb path
export const generatePathToQaImageThumbnailFile = (qaImage: QAMedia) => {
  const pathBase = getBasePathToQAImageThumbnailFile(qaImage);
  return `${pathBase}&${new Date().getTime()}.jpeg`;
};
//* get path to qa image markup file
export const getPathToQaImageMarkupFile = (qaImage: QAMedia) => {
  return getPathToQaImageFolder(qaImage) + `/markup`;
};

//* get path to pending markup file
export const getPathToQaImagePendingMarkupFile = (qaImage: QAMedia) => {
  return getPathToQaImageFolder(qaImage) + `/pendingMarkup`;
};
//* get path to pending markup file
export const getPathToPendingQaImageWithMarkupFile = (qaImage: QAMedia) => {
  return getPathToQaImageFolder(qaImage) + `/pendingImageWithMarkup.jpeg`;
};

//* handle copy image file from temporary path
export const handleCopyImageFileFromTempPath = async (props: {
  tempPath: string;
  targetPath: string;
}) => {
  try {
    await copyFile(props.tempPath, props.targetPath);
    return true;
  } catch (error) {
    console.log('ERROR handleCopyImageFileFromTempPath:', error);

    return false;
  }
};

export const handleUpdateStatusLocalQAImage = async (
  qaImage: QAMedia,
  state: LocalQAImageStatus,
) => {
  try {
    const pathToQAImageInfo = getPathToQaImageInfoFile(qaImage);

    if (await checkPathExist(pathToQAImageInfo)) {
      const localQAImageInfo: LocalQAImage = JSON.parse(
        await readFile(pathToQAImageInfo),
      );
      localQAImageInfo.status = state;
      console.log('STATUS UPDATE:', state);
      console.log('qaImage:', localQAImageInfo);
      await writeFile(pathToQAImageInfo, JSON.stringify(localQAImageInfo));

      return localQAImageInfo;
    }
  } catch (error) {
    console.log('ERROR handleUpdateStatusLocalQAImage:', error);
  }
};

//* get local image info
export const getLocalQAImageInfo = async (qaImage: QAMedia) => {
  try {
    const pathToQAImageInfo = getPathToQaImageInfoFile(qaImage);

    if (await checkPathExist(pathToQAImageInfo)) {
      const localQAImageInfo: LocalQAImage = JSON.parse(
        await readFile(pathToQAImageInfo),
      );
      return localQAImageInfo;
    }
  } catch (error) {
    console.log('ERROR handleUpdateStatusLocalQAImage:', error);
  }
};

//* handle download qa image
export const handleDownloadQAImage = async (qaImage: QAMedia) => {
  try {
    if (qaImage.url) {
      const pathToQAImageFile = getPathToQaImageFile(qaImage);
      console.log('IMG NOT CACHED, DOWNLOAD QA FULL SIZE, URL:', qaImage.url);
      const resultDownload = await downloadFile({
        fromUrl: qaImage.url,
        toFile: pathToQAImageFile,
        background: Platform.OS === 'ios' ? true : undefined,
        discretionary: Platform.OS === 'ios' ? true : undefined,
        cacheable: Platform.OS === 'ios' ? false : undefined,
      }).promise;
      if (resultDownload.statusCode) {
        console.log(
          'BYTES WRITTEN:',
          resultDownload.bytesWritten * 0.000001,
          ' Mb',
        );
      }
      if (resultDownload.statusCode === 200) {
        return true;
      } else return false;
    } else throw 'NO IMAGE URL';
  } catch (error) {
    console.log('ERROR handleDownloadQAImage:', error);
    return false;
  }
};

export const handleDownloadQAThumbImage = async (qaImage: QAMedia) => {
  try {
    if (qaImage.thumbUrl || qaImage.urlWithMarkup) {
      const pathToThumbnailFile = await getPathToQaImageThumbnailFile(qaImage);
      if (await checkPathExist(pathToThumbnailFile)) {
        console.log(
          'INSIDE FUNCTION CACHE TO DOWNLOAD QA THUMB IMAGE BUT FOUND EXISTED THUMBIMG:',
          pathToThumbnailFile,
        );

        return pathToThumbnailFile;
      }

      const pathToQAThumbImageFile =
        generatePathToQaImageThumbnailFile(qaImage);
      const resultDownload = await downloadFile({
        fromUrl: qaImage.urlWithMarkup
          ? qaImage.urlWithMarkup
          : qaImage.thumbUrl!,
        toFile: pathToQAThumbImageFile,
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
        return pathToQAThumbImageFile;
      } else {
        //! delete file path if failed to download as it no longer valid for copying and overwriting
        await deleteFileSystemWithPath(pathToQAThumbImageFile);
        const pathToQAImageOriginal = getPathToQaImageFile(qaImage);

        //*if there is original image exist=> copy the file and make it as thumbnail
        if (await checkPathExist(pathToQAImageOriginal)) {
          const pathToQAThumbImageFile =
            generatePathToQaImageThumbnailFile(qaImage);
          await copyFile(pathToQAImageOriginal, pathToQAThumbImageFile);
          return pathToQAThumbImageFile;
        } else return false;
      }
    } else throw 'NO IMAGE URL';
  } catch (error) {
    console.log('ERROR handleDownloadQAThumbImage:', error);
    return false;
  }
};

//* get deleted qa image folder
export const getDeletedQAImageFolder =
  async (): Promise<DeletedQaImageFile> => {
    try {
      if (!(await checkPathExist(DELETED_QA_IMAGE_FILE_PATH))) return [];
      const deletedQAImageFile = JSON.parse(
        await readFile(DELETED_QA_IMAGE_FILE_PATH),
      ) as DeletedQaImageFile;
      // console.log('DELETED QA IMAGE FILE:', deletedQAImageFile);

      return deletedQAImageFile;
    } catch (error) {
      console.log('ERROR getExpiredQAFile:', error);

      return [];
    }
  };

export const getPendingUploadQAImageFile =
  async (): Promise<QAPendingUploadImageFile> => {
    try {
      if (!(await checkPathExist(PATH_TO_PENDING_UPLOAD_QA))) {
        await writeFile(PATH_TO_PENDING_UPLOAD_QA, JSON.stringify([]));
        console.log('FILE WAS NOT EXISTED');
        return [];
      } else {
        const qaPendingFile = JSON.parse(
          await readFile(PATH_TO_PENDING_UPLOAD_QA),
        ) as QAPendingUploadImageFile;
        return qaPendingFile;
      }
    } catch (error) {
      console.log('ERROR getPendingUploadQAImageFile:', error);
      return [];
    }
  };

export const getErrorUploadQAImageFile =
  async (): Promise<QAPendingUploadImageFile> => {
    try {
      if (!(await checkPathExist(PATH_TO_ERROR_UPLOAD_QA))) {
        await writeFile(PATH_TO_ERROR_UPLOAD_QA, JSON.stringify([]));

        return [];
      } else {
        const qaErrorFile = JSON.parse(
          await readFile(PATH_TO_ERROR_UPLOAD_QA),
        ) as QAPendingUploadImageFile;
        return qaErrorFile;
      }
    } catch (error) {
      console.log('ERROR getPendingUploadQAImageFile:', error);
      return [];
    }
  };

export const getDeletePendingQAImageFile = async (): Promise<
  LocalQAImage[]
> => {
  try {
    if (!(await checkPathExist(PATH_TO_PENDING_DELETE_QA))) {
      await writeFile(PATH_TO_PENDING_DELETE_QA, JSON.stringify([]));

      return [];
    } else {
      const qaPendingDeleteFile = JSON.parse(
        await readFile(PATH_TO_PENDING_DELETE_QA),
      ) as LocalQAImage[];
      return qaPendingDeleteFile;
    }
  } catch (error) {
    console.log('ERROR getPendingUploadQAImageFile:', error);
    return [];
  }
};
export const handleSavePendingUploadQAImageFile = async (
  file: QAPendingUploadImageFile,
) => {
  try {
    console.log('SAVE PENDING FILE TO LOCAL:', file);
    await writeFile(PATH_TO_PENDING_UPLOAD_QA, JSON.stringify(file));
  } catch (error) {
    console.log('ERROR handleSavePendingUploadQAImageFile:', error);
  }
};

export const handleSaveErrorUploadQAImageFile = async (
  file: QAPendingUploadImageFile,
) => {
  try {
    await writeFile(PATH_TO_ERROR_UPLOAD_QA, JSON.stringify(file));
  } catch (error) {
    console.log('ERROR handleSaveErrorUploadQAImageFile:', error);
  }
};

export const handleSaveDeletePendingQAImageFile = async (
  file: LocalQAImage[],
) => {
  try {
    await writeFile(PATH_TO_PENDING_DELETE_QA, JSON.stringify(file));
  } catch (error) {
    console.log('ERROR handleSaveDeletePendingQAImageFile:', error);
  }
};

export const getQACacheVideoListFile = async (): Promise<
  IQAVideoUploadData[]
> => {
  try {
    if (!(await checkPathExist(ROOT_QA_CACHE_VIDEO_FOLDER_PATH))) {
      await createLocalFolder(ROOT_QA_CACHE_VIDEO_FOLDER_PATH);
      return [];
    }
    if (!(await checkPathExist(ROOT_QA_ALL_VIDEO_INFO_FILES))) return [];
    const videoListFile = JSON.parse(
      await readFile(ROOT_QA_ALL_VIDEO_INFO_FILES),
    ) as IQAVideoUploadData[];
    // console.log('EXPIRED PROJECT FILE:', expiredProjectFile);

    return videoListFile;
  } catch (error) {
    console.log('ERROR getQACacheVideoListFile:', error);

    return [];
  }
};

export const saveQACacheVideoListFile = async (list: IQAVideoUploadData[]) => {
  try {
    if (!(await checkPathExist(ROOT_QA_CACHE_VIDEO_FOLDER_PATH)))
      await createLocalFolder(ROOT_QA_CACHE_VIDEO_FOLDER_PATH);
    await writeFile(ROOT_QA_ALL_VIDEO_INFO_FILES, JSON.stringify(list));
  } catch (error) {
    console.log('FAILED saveQACacheVideoListFile:', error);
    return false;
  }
};

export function extractVideoItemsWithType<T>(
  data: IQAVideoUploadData<any>[],
  typeChecker: (item: any) => item is T,
): IQAVideoUploadData<T>[] {
  return data.filter(item => item.hostItem && typeChecker(item.hostItem));
}
