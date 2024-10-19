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
import {IBgVideoUploadData} from '../../../GeneralStore/useBgUploadStore';
import {IProgressCompressState} from '../../../Models/utilityType';
import {LocalQAImage} from '../Provider/CacheQAType';
interface QANavItem<T> {
  routeName: string;
  routeKey: string;
  routeParams: T;
}
type TQAListViewMode = 'list' | 'grid';
interface QAGeneralStoreValue {
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

interface ProjectQAImageStore {
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

  retryVideo: IBgVideoUploadData | undefined;
  setRetryVideo: (item: IBgVideoUploadData | undefined) => void;
  //* to show progress compress
  compressState: IProgressCompressState | undefined;
  setCompressState: (state: IProgressCompressState | undefined) => void;
  resetQAImgStore: () => void;
}
const createQAStoreGeneralValue: StateCreator<
  QAGeneralStoreValue & ProjectQAImageStore,
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
  QAGeneralStoreValue & ProjectQAImageStore,
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

  retryVideo: undefined,
  setRetryVideo: (item: IBgVideoUploadData | undefined) =>
    set(state =>
      produce(state, draft => {
        draft.retryVideo = item;

        return draft;
      }),
    ),
  compressState: undefined as IProgressCompressState | undefined,
  setCompressState: (compressState: IProgressCompressState | undefined) =>
    set(state =>
      produce(state, draft => {
        draft.compressState = compressState;

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
  QAGeneralStoreValue & ProjectQAImageStore
>()((...a) => ({
  ...createQAStoreGeneralValue(...a),
  ...createProjectQAImageStore(...a),
}));
