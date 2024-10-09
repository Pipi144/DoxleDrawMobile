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

import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {
  TFileBgUploadData,
  TFileBgUploadStatus,
  TFileBgUploadVariants,
} from '../Provider/StorageModels';
import {TAPIServerFile} from '../../../Models/utilityType';
import {
  cacheFileServer,
  deleteCacheInfo,
  getCachedFileInfo,
  moveFileToCache,
  saveCachedFileList,
} from '../Provider/helperFncs';
import {DoxleFile} from '../../../Models/files';
import {
  checkPathExist,
  deleteFileSystemWithPath,
  replaceExtension,
} from '../../../Utilities/FunctionUtilities';

type TAddCacheFiles = {
  files: TAPIServerFile[];
  hostId: string;
  variants: TFileBgUploadVariants;
};

interface IFileBgUploadState {
  cachedFiles: TFileBgUploadData[];
  addCachedFiles: (data: TAddCacheFiles) => Promise<void>;
  updateStatusSingleCachedFile: (
    fileId: string,
    status: TFileBgUploadStatus,
  ) => void;
  updateStatusMultipleCachedFile: (
    fileIds: string[],
    status: TFileBgUploadStatus,
    errors?: string[],
  ) => void;
  cacheSingleFile: (file: DoxleFile) => Promise<string | undefined>;

  destroyCacheFile: (data: TFileBgUploadData) => Promise<void>;
  synchronizeCachedFiles: (files: DoxleFile[]) => void;
  getCacheUrl: (fileId: string) => string | undefined;
  getInitialCachedFiles: () => Promise<void>;
}
export const useFileBgUploadStore = create(
  immer<IFileBgUploadState>((set, get) => ({
    cachedFiles: [],
    addCachedFiles: async data => {
      const {files, hostId, variants} = data;
      let allData: TFileBgUploadData[] = [];

      for await (const file of files) {
        const newFilePath = await moveFileToCache(file);
        const isVideo = file.type.includes('video');
        allData.push({
          file: {
            ...file,
            uri: newFilePath ? newFilePath.newUrl : file.uri,
            name: isVideo ? replaceExtension(file.name, 'mp4') : file.name,
          },
          thumbnailPath: newFilePath?.thumbUrl,
          hostId,
          status: 'pending',
          expired: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 15,
          uploadVariant: variants,
        });
      }

      set(state => {
        state.cachedFiles.push(...allData);
      });

      saveCachedFileList(get().cachedFiles);
    },
    updateStatusSingleCachedFile: (fileId, status) => {
      set(state => {
        const index = state.cachedFiles.findIndex(
          item => item.file.fileId === fileId,
        );
        if (index !== -1) {
          state.cachedFiles[index].status = status;
        }
      });

      saveCachedFileList(get().cachedFiles);
    },
    updateStatusMultipleCachedFile: (fileIds, status, errors) => {
      set(state => {
        for (const [index, fileId] of fileIds.entries()) {
          const cacheItem = state.cachedFiles.find(
            item => item.file.fileId === fileId,
          );
          if (cacheItem) {
            console.log('UPDATE STATUS MULTIPLE CACHED FILE:', status);
            cacheItem.status = status;
            if (errors && errors[index]) {
              cacheItem.errorMessage = errors[index];
            }
          }
        }
      });

      saveCachedFileList(get().cachedFiles);
    },
    synchronizeCachedFiles: files => {
      set(state => {
        console.log('SYNC CACHED FILES:', files);

        files.forEach(file => {
          const matchedFile = state.cachedFiles.find(
            item => item.file.fileId === file.fileId,
          );
          if (matchedFile) {
            if (matchedFile.status !== 'success') {
              matchedFile.status = 'success';
            }
          }
        });
      });

      saveCachedFileList(get().cachedFiles);
    },
    cacheSingleFile: async (file: DoxleFile) => {
      let cacheFile: TFileBgUploadData = {
        file: {
          uri: file.url,
          name: file.fileName,
          type: file.fileType,
          size: parseFloat(file.fileSize),
          fileId: file.fileId,
        },
        hostId: file.folder
          ? file.folder
          : file.docket
          ? file.docket
          : file.project ?? '',
        status: 'success',
        expired: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 15,
        uploadVariant: file.folder
          ? 'Folder'
          : file.docket
          ? 'Docket'
          : 'Project',
      };

      try {
        const resCache = await cacheFileServer(file);
        if (resCache) {
          cacheFile.file.uri = resCache.newUrl;
          cacheFile.thumbnailPath = resCache.thumbUrl;
          set(state => {
            state.cachedFiles.push(cacheFile);
          });
          saveCachedFileList(get().cachedFiles);
          return resCache.newUrl;
        }
      } catch (error) {
        console.log('ERROR cacheSingleFile:', error);
      }
    },
    destroyCacheFile: async data => {
      set(state => {
        const index = state.cachedFiles.findIndex(
          item => item.file.fileId === data.file.fileId,
        );
        if (index !== -1) {
          state.cachedFiles.splice(index, 1);
        }
      });

      saveCachedFileList(get().cachedFiles);

      if (await checkPathExist(data.file.uri)) {
        await deleteFileSystemWithPath(data.file.uri);
      }
      if (data.thumbnailPath && (await checkPathExist(data.thumbnailPath))) {
        await deleteFileSystemWithPath(data.thumbnailPath);
      }
    },
    getCacheUrl: fileId => {
      const file = get().cachedFiles.find(item => item.file.fileId === fileId);
      return file?.file.uri;
    },
    getInitialCachedFiles: async () => {
      try {
        const listFile = await getCachedFileInfo();

        set(state => {
          state.cachedFiles = listFile.filter(
            file => file.expired >= Math.floor(Date.now() / 1000),
          );
        });
        saveCachedFileList(get().cachedFiles);
        //perform cleaning storage
        const expiredFiles = listFile.filter(
          file => file.expired < Math.floor(Date.now() / 1000),
        );
        if (expiredFiles.length > 0) {
          for await (const file of expiredFiles) {
            await deleteCacheInfo(file);
          }
        }
      } catch (error) {
        console.log('ERROR getInitialCachedFiles:', error);
      }
    },
  })),
);
