import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {TAPIServerFile} from '../Models/utilityType';

import {
  checkPathExist,
  createLocalFolder,
  deleteFileSystemWithPath,
} from '../Utilities/FunctionUtilities';
import {DocumentDirectoryPath, readFile, writeFile} from 'react-native-fs';

export const ROOT_DOXLE_CACHE_VIDEO_FOLDER_PATH =
  DocumentDirectoryPath + '/PendingVideo';
export const ROOT_DOXLE_PENDING_VIDEO_INFO_LIST =
  ROOT_DOXLE_CACHE_VIDEO_FOLDER_PATH + '/pendingVideoListInfo';
export const ROOT_DOXLE_ALL_VIDEO_INFO_LIST =
  ROOT_DOXLE_CACHE_VIDEO_FOLDER_PATH + '/videoListInfo';
export const ROOT_DOXLE_PENDING_VIDEO_THUMBNAILS =
  ROOT_DOXLE_CACHE_VIDEO_FOLDER_PATH + '/thumbnails';
export type TBgUploadStatus = 'success' | 'pending' | 'error';
export type TBgUploadVariants = 'QA' | 'Comment';

export type IBgVideoUploadData<T = unknown> = {
  videoFile: TAPIServerFile;
  thumbnailPath?: string;
  hostId: string; //! could be any id to extract a list of video belong to a certain hostID
  videoId: string; //! to access a specific video
  status: TBgUploadStatus;
  expired: number | null; //! null it means the video is deleted and nolonger cached

  hostItem?: T;
  errorMessage?: string;
};
export type IBgVideoUploadBatch = IBgVideoUploadData & {
  uploadVariant: TBgUploadVariants;
};
interface IBgUploadVideoStore {
  localPendingVideoList: IBgVideoUploadBatch[];

  getInitialPendingVideoList: () => Promise<void>;
  addPendingVideoList: (item: IBgVideoUploadBatch) => void;
  clearPendingVideoList: () => void;

  deletePendingVideo: (videoId: string) => void;

  popPendingVideo: () => void;

  cachedVideoList: IBgVideoUploadBatch[];
  getInitialCachedVideoList: () => Promise<void>;

  addCachedVideoList: (item: IBgVideoUploadBatch) => void;
  updateStatusMultiCachedVideo: (
    videoIds: string[],
    status: TBgUploadStatus,
  ) => void;
  deleteCachedVideo: (videoId: string) => void;
  deleteMultiCachedVideo: (videoId: string[]) => void;
  deleteMultiCachedVideoWithHostId: (hostId: string) => void;
  movePendingToCacheVideoList: (
    fileId: string,
    status: TBgUploadStatus,
    errorMessage?: string,
  ) => void;

  isConnectionPromptShown: boolean;
  setIsConnectionPromptShow: (show: boolean) => void;

  shouldUploadInWeakConnection: boolean;
  setShouldUploadInWeakConnection: (show: boolean) => void;
}

export const useBgUploadVideoStore = create(
  immer<IBgUploadVideoStore>((set, get) => ({
    localPendingVideoList: [],

    getInitialPendingVideoList: async () => {
      const result = await getPendingVideoListFile();
      const notPendingFiles = result.filter(item => item.status === 'success');

      set(state => {
        state.localPendingVideoList = result.filter(
          item => item.status === 'pending',
        );
      });

      if (notPendingFiles.length > 0) {
        for (const item of notPendingFiles) {
          get().movePendingToCacheVideoList(item.videoId, item.status);
        }
      }
    },
    addPendingVideoList: (item: IBgVideoUploadBatch) => {
      set(state => {
        state.localPendingVideoList.push(item);
      });
      // console.log('VIDEO LIST SAVE AFTER ADD:', get().localPendingVideoList);
      // console.log(
      //   'VIDEO LIST LENGTH AFTER ADD:',
      //   get().localPendingVideoList.length,
      // );
      savePendingVideoList(get().localPendingVideoList);
    },
    clearPendingVideoList: () => {
      set(state => {
        state.localPendingVideoList = [];
      });

      savePendingVideoList([]);
    },

    deletePendingVideo: (videoId: string) => {
      set(state => {
        state.localPendingVideoList = state.localPendingVideoList.filter(
          item => item.videoId !== videoId,
        );
      });
      // console.log(
      //   'VIDEO LIST SAVE AFTER UPDATE DELELTE:',
      //   get().localPendingVideoList,
      // );
      // console.log(
      //   'VIDEO LIST LENGTH AFTER UPDATE DELELTE:',
      //   get().localPendingVideoList.length,
      // );
      savePendingVideoList(get().localPendingVideoList);
    },

    popPendingVideo: () => {
      set(state => {
        state.localPendingVideoList.splice(0, 1);
      });

      savePendingVideoList(get().localPendingVideoList);
    },

    cachedVideoList: [],

    getInitialCachedVideoList: async () => {
      const result = await getCacheVideoListFile();

      set(state => {
        state.cachedVideoList = result;
      });

      //! clear the expired items to handle memory efficiency
      if (result.length > 0) {
        // console.log('CACHE LIST BEFORE DELETE:', result);
        const currentTime = Math.floor(new Date().getTime() / 1000); //in seconds
        for (const video of result) {
          //item expire
          if (video.expired && currentTime > video.expired) {
            // if local video path exist =>delete but still leave the thumbnail
            if (await checkPathExist(video.videoFile.uri)) {
              await deleteFileSystemWithPath(video.videoFile.uri);

              // console.log('ITEM EXPIRED =>DELETE');
              //update the store value after delete
              set(state => {
                const item = state.cachedVideoList.find(
                  item => item.videoId === video.videoId,
                );
                if (item) item.expired = null;
              });
            } else
              set(state => {
                const item = state.cachedVideoList.find(
                  item => item.videoId === video.videoId,
                );
                if (item) item.expired = null;
              });
          } else continue;
          // console.log('CACHE LIST AFTER DELETE:', get().cachedVideoList);
          saveCacheVideoListFile(get().cachedVideoList); // save the most updated cached list
        }
      }
    },

    addCachedVideoList: (item: IBgVideoUploadBatch) => {
      set(state => {
        state.cachedVideoList.push(item);
      });
      // console.log('VIDEO LIST SAVE AFTER ADD:', get().cachedVideoList);
      // console.log('VIDEO LIST LENGTH AFTER ADD:', get().cachedVideoList.length);
      saveCacheVideoListFile(get().cachedVideoList);
    },
    deleteCachedVideo: (videoId: string) => {
      set(state => {
        state.cachedVideoList = state.cachedVideoList.filter(
          item => item.videoId !== videoId,
        );
      });
      // console.log(
      //   'VIDEO LIST SAVE AFTER UPDATE DELELTE:',
      //   get().localPendingVideoList,
      // );
      // console.log(
      //   'VIDEO LIST LENGTH AFTER UPDATE DELELTE:',
      //   get().localPendingVideoList.length,
      // );
      saveCacheVideoListFile(get().cachedVideoList);
    },
    deleteMultiCachedVideo: (videoId: string[]) => {
      set(state => {
        state.cachedVideoList = state.cachedVideoList.filter(
          item => !videoId.some(deletedId => deletedId === item.videoId),
        );
      });
      // console.log(
      //   'VIDEO LIST SAVE AFTER UPDATE DELELTE:',
      //   get().cachedVideoList,
      // );
      // console.log(
      //   'VIDEO LIST LENGTH AFTER UPDATE DELELTE:',
      //   get().cachedVideoList.length,
      // );
      savePendingVideoList(get().cachedVideoList);
    },

    deleteMultiCachedVideoWithHostId: (hostId: string) => {
      set(state => {
        state.cachedVideoList = state.cachedVideoList.filter(
          item => item.hostId === hostId,
        );
      });
      // console.log(
      //   'VIDEO LIST SAVE AFTER UPDATE DELELTE:',
      //   get().cachedVideoList,
      // );
      // console.log(
      //   'VIDEO LIST LENGTH AFTER UPDATE DELELTE:',
      //   get().cachedVideoList.length,
      // );
      savePendingVideoList(get().cachedVideoList);
    },
    updateStatusMultiCachedVideo: (
      videoIds: string[],
      status: TBgUploadStatus,
    ) => {
      set(state => {
        for (const id of videoIds) {
          const item = state.cachedVideoList.find(item => item.videoId === id);
          if (item) item.status = status;
        }
      });

      saveCacheVideoListFile(get().cachedVideoList);
    },

    movePendingToCacheVideoList: (
      fileId: string,
      status: TBgUploadStatus,
      errorMessage?: string,
    ) => {
      set(state => {
        const item = state.localPendingVideoList.find(
          item => item.videoId === fileId,
        );
        if (item) {
          item.status = status;
          if (errorMessage) item.errorMessage = errorMessage;
          state.cachedVideoList.push(item);
          state.localPendingVideoList = state.localPendingVideoList.filter(
            item => item.videoId !== fileId,
          );
        }
      });
      // console.log(
      //   'PENDING VIDEO LIST SAVE AFTER UPDATE STATUS:',
      //   get().localPendingVideoList,
      // );
      // console.log(
      //   'PENDING VIDEO LIST LENGTH AFTER UPDATE STATUS:',
      //   get().localPendingVideoList.length,
      // );

      // console.log(
      //   'CACHED VIDEO LIST SAVE AFTER UPDATE STATUS:',
      //   get().cachedVideoList,
      // );
      // console.log(
      //   'CACHED VIDEO LIST LENGTH AFTER UPDATE STATUS:',
      //   get().cachedVideoList.length,
      // );
      savePendingVideoList(get().localPendingVideoList);
      saveCacheVideoListFile(get().cachedVideoList);
    },

    isConnectionPromptShown: false,
    setIsConnectionPromptShow: (show: boolean) => {
      set(state => {
        state.isConnectionPromptShown = show;
      });
    },

    shouldUploadInWeakConnection: false,
    setShouldUploadInWeakConnection: (show: boolean) => {
      set(state => {
        state.shouldUploadInWeakConnection = show;
      });
    },
  })),
);

//# HELPER FUNCTION
export const getPendingVideoListFile = async (
  status?: TBgUploadStatus[],
): Promise<IBgVideoUploadBatch[]> => {
  try {
    if (!(await checkPathExist(ROOT_DOXLE_CACHE_VIDEO_FOLDER_PATH))) {
      await createLocalFolder(ROOT_DOXLE_CACHE_VIDEO_FOLDER_PATH);
      return [];
    }
    if (!(await checkPathExist(ROOT_DOXLE_PENDING_VIDEO_INFO_LIST))) return [];
    const videoListFile = JSON.parse(
      await readFile(ROOT_DOXLE_PENDING_VIDEO_INFO_LIST),
    ) as IBgVideoUploadBatch[];

    return videoListFile.filter(item =>
      status ? status.includes(item.status) : item,
    );
  } catch (error) {
    console.log('ERROR getPendingVideoListFile:', error);

    return [];
  }
};

export const savePendingVideoList = async (list: IBgVideoUploadBatch[]) => {
  try {
    if (!(await checkPathExist(ROOT_DOXLE_CACHE_VIDEO_FOLDER_PATH)))
      await createLocalFolder(ROOT_DOXLE_CACHE_VIDEO_FOLDER_PATH);
    await writeFile(ROOT_DOXLE_PENDING_VIDEO_INFO_LIST, JSON.stringify(list));
  } catch (error) {
    console.log('FAILED savePendingVideoList:', error);
    return false;
  }
};

export const getCacheVideoListFile = async (): Promise<
  IBgVideoUploadBatch[]
> => {
  try {
    if (!(await checkPathExist(ROOT_DOXLE_CACHE_VIDEO_FOLDER_PATH))) {
      await createLocalFolder(ROOT_DOXLE_CACHE_VIDEO_FOLDER_PATH);
      return [];
    }
    if (!(await checkPathExist(ROOT_DOXLE_ALL_VIDEO_INFO_LIST))) return [];
    const videoListFile = JSON.parse(
      await readFile(ROOT_DOXLE_ALL_VIDEO_INFO_LIST),
    ) as IBgVideoUploadBatch[];
    // console.log('EXPIRED PROJECT FILE:', expiredProjectFile);

    return videoListFile;
  } catch (error) {
    console.log('ERROR getCacheVideoListFile:', error);

    return [];
  }
};

export const saveCacheVideoListFile = async (list: IBgVideoUploadBatch[]) => {
  try {
    if (!(await checkPathExist(ROOT_DOXLE_CACHE_VIDEO_FOLDER_PATH)))
      await createLocalFolder(ROOT_DOXLE_CACHE_VIDEO_FOLDER_PATH);
    await writeFile(ROOT_DOXLE_ALL_VIDEO_INFO_LIST, JSON.stringify(list));
  } catch (error) {
    console.log('FAILED saveCacheVideoListFile:', error);
    return false;
  }
};

export function extractVideoItemsWithType<T>(
  data: IBgVideoUploadData<any>[],
  typeChecker: (item: any) => item is T,
): IBgVideoUploadData<T>[] {
  return data.filter(item => item.hostItem && typeChecker(item.hostItem));
}
