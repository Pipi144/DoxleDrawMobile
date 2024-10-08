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

import {
  copyFile,
  moveFile,
  readDir,
  readFile,
  writeFile,
} from 'react-native-fs';
import {
  checkPathExist,
  createLocalFolder,
} from '../../../Utilities/FunctionUtilities';
import {
  ALL_CACHED_FILES,
  CACHE_STORAGE_INFO,
  ROOT_FILE_CACHE_DIR,
} from './FileDirPath';
import {TFileBgUploadData, TFileBgUploadStatus} from './StorageModels';
import {Platform} from 'react-native';
import {TAPIServerFile} from '../../../Models/utilityType';
import {createThumbnail} from 'react-native-create-thumbnail';

//# HELPER FUNCTION
export const getCachedFileInfo = async (): Promise<TFileBgUploadData[]> => {
  try {
    if (!(await checkPathExist(ROOT_FILE_CACHE_DIR))) {
      await createLocalFolder(ROOT_FILE_CACHE_DIR);
    }
    if (!(await checkPathExist(ALL_CACHED_FILES))) {
      await createLocalFolder(ALL_CACHED_FILES);
    }
    if (!(await checkPathExist(CACHE_STORAGE_INFO))) {
      return [];
    }
    const listFile = JSON.parse(
      await readFile(CACHE_STORAGE_INFO),
    ) as TFileBgUploadData[];

    return listFile;
  } catch (error) {
    console.log('ERROR getPendingVideoListFile:', error);

    return [];
  }
};
export const saveCachedFileList = async (list: TFileBgUploadData[]) => {
  try {
    await writeFile(CACHE_STORAGE_INFO, JSON.stringify(list));
  } catch (error) {
    console.log('FAILED savePendingVideoList:', error);
    return false;
  }
};
const getFileType = (fileName: string): string | null | undefined => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop() : null;
};

interface IMoveFileToCacheRes {
  newUrl: string;
  thumbUrl?: string;
}
export const moveFileToCache = async ({
  fileId,
  type,
  name,
  uri,
}: TAPIServerFile): Promise<IMoveFileToCacheRes | undefined> => {
  try {
    const fileExtension = getFileType(name);
    if (!fileExtension) {
      return;
    }
    let res: IMoveFileToCacheRes = {
      newUrl: uri,
    };
    const isVideo = type.toLowerCase().includes('video');
    const fileCachedPath = `${ALL_CACHED_FILES}/${fileId}.${
      isVideo ? 'mp4' : fileExtension
    }`;

    if (isVideo && Platform.OS === 'android') {
      await copyFile(uri, fileCachedPath);
    } else {
      await moveFile(uri, fileCachedPath);
    }
    res.newUrl = fileCachedPath;
    //create a thumbnail for video
    if (isVideo) {
      const thumbVideoPath = `${ALL_CACHED_FILES}/${fileId}_thumb.jpg`;
      await createThumbnail({
        url: fileCachedPath,
        timeStamp: 14,
        format: 'jpeg',
      })
        .then(async url => {
          await moveFile(url.path, thumbVideoPath);
          res.thumbUrl = thumbVideoPath;
        })
        .catch(err => {
          console.log('ERROR createThumbnail:', err);
        });
    }
    return res;
  } catch (error) {
    console.log('ERROR moveFileToCache:', error);
    return;
  }
};
