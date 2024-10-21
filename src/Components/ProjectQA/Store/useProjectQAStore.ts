import {StateCreator, create} from 'zustand';

import {produce} from 'immer';
import {
  FilterGetQAListQuery,
  TFilterQAItemsQuery,
} from '../../../API/qaQueryAPI';
import {
  QAList,
  QAMarkupArrow,
  QAMarkupCircle,
  QAMarkupLabel,
  QAMarkupPath,
  QAMarkupRectangle,
  QAMarkupStraightLine,
} from '../../../Models/qa';

import {
  IQAVideoUploadData,
  LocalQAImage,
  TQAVideoUploadStatus,
} from '../Provider/CacheQAType';
import {
  getQACacheVideoListFile,
  saveQACacheVideoListFile,
} from '../Provider/CacheQAHelperFunctions';
import {
  checkPathExist,
  deleteFileSystemWithPath,
} from '../../../Utilities/FunctionUtilities';
interface QANavItem<T> {
  routeName: string;
  routeKey: string;
  routeParams: T;
}
type TQAListViewMode = 'list' | 'grid';
export interface QAGeneralStoreValue {
  filterQAListQuery: FilterGetQAListQuery;
  setFilterQAListQuery: (filter: FilterGetQAListQuery) => void;

  filterGetQAList: FilterGetQAListQuery;
  setFilterGetQAList: (data: Partial<FilterGetQAListQuery>) => void;

  filterGetQAItems: TFilterQAItemsQuery;
  setFilterGetQAItems: (data: Partial<TFilterQAItemsQuery>) => void;

  qaNavigationMenu: QANavItem<any>[];
  setQANavigationMenu: (item: QANavItem<any>[]) => void;
  addQANavItem: (item: QANavItem<any>) => void;
  popQANavItem: () => void;

  showEditAssigneeQAModal: boolean;
  setShowEditAssigneeQAModal: (show: boolean) => void;
  selectedQAList: QAList | undefined;
  setSelectedQAList: (item: QAList | undefined) => void;

  showAddQAListHeader: boolean;
  setShowAddQAListHeader: (show: boolean) => void;

  qaListViewMode: TQAListViewMode;
  setQAListViewMode: (mode: TQAListViewMode) => void;
  resetGeneralQAStore: () => void;
}

export interface ProjectQAImageStore {
  qaImageList: LocalQAImage[];
  setQAImageList: (list: LocalQAImage[]) => void;
  addQAImage: (imageList: LocalQAImage[]) => void;
  deleteQAImage: (img: LocalQAImage) => void;

  addDownloadedQAImage: (img: LocalQAImage) => void;
  removeMultipleQAImages: (list: LocalQAImage[]) => void;

  updateMarkupQAImage: (props: {
    markupList: Array<
      | QAMarkupRectangle
      | QAMarkupCircle
      | QAMarkupStraightLine
      | QAMarkupLabel
      | QAMarkupArrow
      | QAMarkupPath
    >;
    qaImage: LocalQAImage;
  }) => void;

  updateThumbnailQAImage: (props: {
    newThumbnailPath: string;
    qaImage: LocalQAImage;
  }) => void;
  clearQAImageStoreData: () => void;

  resetQAImgStore: () => void;
}
export interface IQAUploadVideoStore {
  addPendingVideoList: (item: IQAVideoUploadData) => void;
  clearPendingVideoList: () => void;

  deletePendingVideo: (videoId: string) => void;

  popPendingVideo: () => void;

  cachedVideoList: IQAVideoUploadData[];
  getInitialCachedVideoList: () => Promise<void>;

  addCachedVideoList: (item: IQAVideoUploadData) => void;
  addMultiCachedVideoList: (data: IQAVideoUploadData[]) => void;
  updateStatusMultiCachedVideo: (
    videoIds: string[],
    status: TQAVideoUploadStatus,
  ) => void;
  deleteCachedVideo: (videoId: string) => void;
  deleteMultiCachedVideo: (videoId: string[]) => void;
  deleteMultiCachedVideoWithHostId: (hostId: string) => void;
  movePendingToCacheVideoList: (
    fileId: string,
    status: TQAVideoUploadStatus,
    errorMessage?: string,
  ) => void;

  isConnectionPromptShown: boolean;
  setIsConnectionPromptShow: (show: boolean) => void;

  shouldUploadInWeakConnection: boolean;
  setShouldUploadInWeakConnection: (show: boolean) => void;

  retryVideo: IQAVideoUploadData | undefined;
  setRetryVideo: (item: IQAVideoUploadData | undefined) => void;
}

const createQAUploadVideoStore: StateCreator<
  QAGeneralStoreValue & ProjectQAImageStore & IQAUploadVideoStore,
  [['zustand/immer', never], never],
  [],
  IQAUploadVideoStore
> = (set, get) => ({
  addPendingVideoList: (item: IQAVideoUploadData) => {
    set(state =>
      produce(state, draft => {
        draft.cachedVideoList.push(item);
      }),
    );

    saveQACacheVideoListFile(get().cachedVideoList);
  },
  addMultiCachedVideoList: data => {
    set(state =>
      produce(state, draft => {
        draft.cachedVideoList.push(...data);
      }),
    );

    saveQACacheVideoListFile(get().cachedVideoList);
  },
  clearPendingVideoList: () => {
    set(state =>
      produce(state, draft => {
        draft.cachedVideoList = draft.cachedVideoList.filter(
          vid => vid.status !== 'pending',
        );
      }),
    );

    saveQACacheVideoListFile(get().cachedVideoList);
  },

  deletePendingVideo: (videoId: string) => {
    set(state =>
      produce(state, draft => {
        const idx = draft.cachedVideoList.findIndex(
          item => item.videoId === videoId,
        );
        if (idx !== -1) draft.cachedVideoList.splice(idx, 1);
      }),
    );

    saveQACacheVideoListFile(get().cachedVideoList);
  },

  popPendingVideo: () => {
    set(state =>
      produce(state, draft => {
        const lastItemIdx = draft.cachedVideoList.findLastIndex(
          vid => vid.status === 'pending',
        );
        if (lastItemIdx !== -1) draft.cachedVideoList.splice(lastItemIdx, 1);
      }),
    );

    saveQACacheVideoListFile(get().cachedVideoList);
  },

  cachedVideoList: [],

  getInitialCachedVideoList: async () => {
    const result = await getQACacheVideoListFile();

    //! clear the expired items to handle memory efficiency
    if (result.length > 0) {
      let filteredVideoList: IQAVideoUploadData[] = [];
      const currentTime = Math.floor(new Date().getTime() / 1000); //in seconds
      for (let i = 0; i < result.length; i++) {
        const video = result[i];
        if (video.expired && currentTime > video.expired) {
          // if local video path exist =>delete but still leave the thumbnail
          if (await checkPathExist(video.videoFile.uri)) {
            await deleteFileSystemWithPath(video.videoFile.uri);

            // console.log('ITEM EXPIRED =>DELETE');
            //update the store value after delete
          }
        } else filteredVideoList.push(video);
      }
      set(state =>
        produce(state, draft => {
          draft.cachedVideoList = filteredVideoList;
        }),
      );
      saveQACacheVideoListFile(get().cachedVideoList);
    }
  },

  addCachedVideoList: (item: IQAVideoUploadData) => {
    set(state =>
      produce(state, draft => {
        draft.cachedVideoList.push(item);
      }),
    );

    saveQACacheVideoListFile(get().cachedVideoList);
  },
  deleteCachedVideo: (videoId: string) => {
    set(state =>
      produce(state, draft => {
        const idx = draft.cachedVideoList.findIndex(
          item => item.videoId === videoId,
        );
        if (idx !== -1) draft.cachedVideoList.splice(idx, 1);
      }),
    );
    saveQACacheVideoListFile(get().cachedVideoList);
  },
  deleteMultiCachedVideo: (videoId: string[]) => {
    set(state =>
      produce(state, draft => {
        draft.cachedVideoList = draft.cachedVideoList.filter(
          item => !videoId.some(deletedId => deletedId === item.videoId),
        );
      }),
    );
    saveQACacheVideoListFile(get().cachedVideoList);
  },

  deleteMultiCachedVideoWithHostId: (hostId: string) => {
    set(state =>
      produce(state, draft => {
        draft.cachedVideoList = draft.cachedVideoList.filter(
          item => item.hostId === hostId,
        );
      }),
    );

    saveQACacheVideoListFile(get().cachedVideoList);
  },
  updateStatusMultiCachedVideo: (
    videoIds: string[],
    status: TQAVideoUploadStatus,
  ) => {
    set(state =>
      produce(state, draft => {
        for (const id of videoIds) {
          const item = draft.cachedVideoList.find(item => item.videoId === id);
          if (item) item.status = status;
        }
      }),
    );

    saveQACacheVideoListFile(get().cachedVideoList);
  },

  movePendingToCacheVideoList: (
    fileId: string,
    status: TQAVideoUploadStatus,
    errorMessage?: string,
  ) => {
    set(state =>
      produce(state, draft => {
        const item = draft.cachedVideoList.find(
          item => item.videoId === fileId,
        );
        if (item) {
          item.status = status;
          if (errorMessage) item.errorMessage = errorMessage;
        }
      }),
    );
    saveQACacheVideoListFile(get().cachedVideoList);
  },

  isConnectionPromptShown: false,
  setIsConnectionPromptShow: (show: boolean) => {
    set(state =>
      produce(state, draft => {
        draft.isConnectionPromptShown = show;
      }),
    );
  },

  shouldUploadInWeakConnection: false,
  setShouldUploadInWeakConnection: (show: boolean) => {
    set(state =>
      produce(state, draft => {
        draft.shouldUploadInWeakConnection = show;
      }),
    );
  },
  retryVideo: undefined,
  setRetryVideo: (item: IQAVideoUploadData | undefined) =>
    set(state =>
      produce(state, draft => {
        draft.retryVideo = item;
      }),
    ),
});
const createQAStoreGeneralValue: StateCreator<
  QAGeneralStoreValue & ProjectQAImageStore & IQAUploadVideoStore,
  [['zustand/immer', never], never],
  [],
  QAGeneralStoreValue
> = (set, get) => ({
  filterQAListQuery: {},
  setFilterQAListQuery: (filter: FilterGetQAListQuery) =>
    set(state =>
      produce(state, draftState => {
        draftState.filterQAListQuery = {
          ...get().filterQAListQuery,
          ...filter,
        };

        return draftState;
      }),
    ),

  filterGetQAList: {},
  setFilterGetQAList: (data: Partial<FilterGetQAListQuery>) =>
    set(state =>
      produce(state, draft => {
        draft.filterGetQAList = {...draft.filterGetQAList, ...data};

        return draft;
      }),
    ),
  filterGetQAItems: {status: 'Unattended'},
  setFilterGetQAItems: (data: Partial<TFilterQAItemsQuery>) =>
    set(state =>
      produce(state, draft => {
        Object.assign(draft.filterGetQAItems, data);

        return draft;
      }),
    ),

  qaNavigationMenu: [],
  setQANavigationMenu: (item: QANavItem<any>[]) =>
    set(state =>
      produce(state, draft => {
        draft.qaNavigationMenu = item;

        return draft;
      }),
    ),
  addQANavItem: (item: QANavItem<any>) =>
    set(state =>
      produce(state, draft => {
        draft.qaNavigationMenu.push(item);

        return draft;
      }),
    ),
  popQANavItem: () =>
    set(state =>
      produce(state, draft => {
        draft.qaNavigationMenu.pop();

        return draft;
      }),
    ),
  selectedQAList: undefined,
  setSelectedQAList: (item: QAList | undefined) =>
    set(state =>
      produce(state, draftState => {
        draftState.selectedQAList = item;

        return draftState;
      }),
    ),

  showEditAssigneeQAModal: false,
  setShowEditAssigneeQAModal: (show: boolean) =>
    set(state =>
      produce(state, draftState => {
        draftState.showEditAssigneeQAModal = show;

        return draftState;
      }),
    ),
  showAddQAListHeader: false,
  setShowAddQAListHeader: (show: boolean) =>
    set(state =>
      produce(state, draftState => {
        draftState.showAddQAListHeader = show;

        return draftState;
      }),
    ),
  qaListViewMode: 'list',
  setQAListViewMode: (mode: TQAListViewMode) =>
    set(state =>
      produce(state, draftState => {
        draftState.qaListViewMode = mode;

        return draftState;
      }),
    ),
  resetGeneralQAStore: () =>
    set(state => {
      state.filterQAListQuery = {};
      state.showEditAssigneeQAModal = false;
      state.filterGetQAItems = {status: 'Unattended'};
      state.qaNavigationMenu = [];
      state.selectedQAList = undefined;
      state.showAddQAListHeader = false;
      state.qaListViewMode = 'list';
      return state;
    }),
});

const createProjectQAImageStore: StateCreator<
  QAGeneralStoreValue & ProjectQAImageStore & IQAUploadVideoStore,
  [['zustand/immer', never], never],
  [],
  ProjectQAImageStore
> = (set, get) => ({
  qaImageList: [],
  setQAImageList: (list: LocalQAImage[]) =>
    set(state =>
      produce(state, draft => {
        draft.qaImageList = list;

        return draft;
      }),
    ),
  addQAImage: (imageList: LocalQAImage[]) =>
    set(state =>
      produce(state, draft => {
        draft.qaImageList = produce(draft.qaImageList, draftImageList => {
          draftImageList.unshift(...imageList);

          return draftImageList;
        });

        return draft;
      }),
    ),
  deleteQAImage: (img: LocalQAImage) =>
    set(state =>
      produce(state, draft => {
        draft.qaImageList = get().qaImageList.filter(
          storeImg => storeImg.imageId !== img.imageId,
        );
        return draft;
      }),
    ),

  addDownloadedQAImage: (downloadedItem: LocalQAImage) =>
    set(state =>
      produce(state, draft => {
        draft.qaImageList = produce(draft.qaImageList, draftImageList => {
          //only add if the item is not in the list
          if (
            get().qaImageList.findIndex(
              qaImg => qaImg.imageId === downloadedItem.imageId,
            ) === -1
          )
            draftImageList.push(downloadedItem);

          return draftImageList;
        });

        return draft;
      }),
    ),
  removeMultipleQAImages: (list: LocalQAImage[]) =>
    set(state =>
      produce(state, draft => {
        draft.qaImageList = draft.qaImageList.filter(
          img => !list.some(removedItem => removedItem.imageId === img.imageId),
        );

        return draft;
      }),
    ),

  updateMarkupQAImage: (props: {
    markupList: Array<
      | QAMarkupRectangle
      | QAMarkupCircle
      | QAMarkupStraightLine
      | QAMarkupLabel
      | QAMarkupArrow
      | QAMarkupPath
    >;
    qaImage: LocalQAImage;
  }) =>
    set(state =>
      produce(state, draft => {
        const item = draft.qaImageList.find(
          img => img.imageId === props.qaImage.imageId,
        );

        if (item) item.markup = props.markupList;
        return draft;
      }),
    ),
  updateThumbnailQAImage: (props: {
    newThumbnailPath: string;
    qaImage: LocalQAImage;
  }) =>
    set(state =>
      produce(state, draft => {
        const item = draft.qaImageList.find(
          img => img.imageId === props.qaImage.imageId,
        );

        if (item) {
          item.thumbPath = props.newThumbnailPath;
        }
        return draft;
      }),
    ),
  clearQAImageStoreData: () =>
    set(state =>
      produce(state, draft => {
        draft.qaImageList = [];

        return draft;
      }),
    ),

  resetQAImgStore: () => {
    set(state =>
      produce(state, draft => {
        draft.qaImageList = [];
        return draft;
      }),
    );
  },
});

export const useProjectQAStore = create<
  QAGeneralStoreValue & ProjectQAImageStore & IQAUploadVideoStore
>()((...a) => ({
  ...createQAStoreGeneralValue(...a),
  ...createProjectQAImageStore(...a),
  ...createQAUploadVideoStore(...a),
}));
