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
  getCachedFileInfo,
  moveFileToCache,
  saveCachedFileList,
} from '../Provider/helperFncs';

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
  ) => void;

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
        if (newFilePath) {
          allData.push({
            file: {...file, uri: newFilePath.newUrl},
            thumbnailPath: newFilePath.thumbUrl,
            hostId,
            status: 'pending',
            expired: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 15,
            uploadVariant: variants,
          });
        } else {
          allData.push({
            file,
            hostId,
            status: 'error',
            expired: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3,
            uploadVariant: variants,
          });
        }
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
    updateStatusMultipleCachedFile: (fileIds, status) => {
      set(state => {
        for (const fileId of fileIds) {
          const index = state.cachedFiles.findIndex(
            item => item.file.fileId === fileId,
          );
          if (index !== -1) {
            state.cachedFiles[index].status = status;
          }
        }
      });

      saveCachedFileList(get().cachedFiles);
    },

    getInitialCachedFiles: async () => {
      try {
        const listFile = await getCachedFileInfo();
        set(state => {
          state.cachedFiles = listFile;
        });
      } catch (error) {
        console.log('ERROR getInitialCachedFiles:', error);
      }
    },
  })),
);
