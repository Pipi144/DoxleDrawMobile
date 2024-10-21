import {StyleSheet} from 'react-native';
import {useState} from 'react';
import {createVideoThumbnail} from 'react-native-compressor';
import {useShallow} from 'zustand/shallow';
import {moveFile} from 'react-native-fs';
import {TAPIServerFile} from '../../../../../Models/utilityType';
import {IQAVideoUploadData} from '../../../Provider/CacheQAType';
import {useProjectQAStore} from '../../../Store/useProjectQAStore';
import {
  checkPathExist,
  createLocalFolder,
  deleteFileSystemWithPath,
} from '../../../../../Utilities/FunctionUtilities';
import {
  ROOT_QA_ALL_VIDEO_INFO_FILES,
  ROOT_QA_CACHE_VIDEO_FOLDER_PATH,
  ROOT_QA_PENDING_VIDEO_THUMBNAILS_FOLDER,
} from '../../../Provider/QAFileDirPath';

type Props = {};

type IGeneratePendingLocalVideoProps<T = unknown> = {
  videoFile: TAPIServerFile;
  hostId: string;
  videoId: string;

  hostItem?: T;
};

const useLocalQAVideo = (props?: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeletingVideo, setIsDeletingVideo] = useState(false);
  const {
    deletePendingVideo,
    cachedVideoList,
    deleteCachedVideo,
    deleteMultiCachedVideo,
    clearPendingVideoList,
  } = useProjectQAStore(
    useShallow(state => ({
      deletePendingVideo: state.deletePendingVideo,
      cachedVideoList: state.cachedVideoList,
      deleteCachedVideo: state.deleteCachedVideo,
      deleteMultiCachedVideo: state.deleteMultiCachedVideo,
      clearPendingVideoList: state.clearPendingVideoList,
    })),
  );
  async function handleGeneratePendingLocalVideo<T = unknown>(
    data: IGeneratePendingLocalVideoProps<T>,
  ) {
    setIsGenerating(true);
    try {
      const {videoFile, hostId, videoId, hostItem} = data;
      let returnedItem: IQAVideoUploadData = {
        videoFile,

        hostId,
        videoId,
        status: 'pending',
        expired: Math.floor(new Date().getTime() / 1000) + 604800, //expired in 7 days
        hostItem: hostItem, // Optionally include hostItem
      };
      if (!(await checkPathExist(ROOT_QA_CACHE_VIDEO_FOLDER_PATH)))
        await createLocalFolder(ROOT_QA_CACHE_VIDEO_FOLDER_PATH);
      if (!(await checkPathExist(ROOT_QA_PENDING_VIDEO_THUMBNAILS_FOLDER)))
        await createLocalFolder(ROOT_QA_PENDING_VIDEO_THUMBNAILS_FOLDER);

      const targetThumbnailPath =
        ROOT_QA_PENDING_VIDEO_THUMBNAILS_FOLDER + `/thumb-${videoId}.jpeg`;

      const targetLocalVideoPath =
        ROOT_QA_CACHE_VIDEO_FOLDER_PATH +
        `/${videoId}-${new Date().getTime()}.mp4`;
      await moveFile(videoFile.uri, targetLocalVideoPath)
        .then(() => {
          returnedItem.videoFile.uri = targetLocalVideoPath;
        })
        .catch(err => console.log('error in moving local video', err));

      // create thumb
      await createVideoThumbnail(videoFile.uri)
        .then(async res => {
          await moveFile(res.path, targetThumbnailPath);
          returnedItem.thumbnailPath = targetThumbnailPath;
        })
        .catch(err => console.log('FAILED TO CREATE VIDEO THUMB:', err));

      // move the video

      return returnedItem;
    } catch (error) {
      console.log('FAILED handleGeneratePendingVideo:', error);
      return;
    } finally {
      setIsGenerating(false);
    }
  }

  const handleDeletePendingVideo = async (data: IQAVideoUploadData) => {
    setIsDeletingVideo(true);
    try {
      const {videoFile} = data;
      if (await checkPathExist(videoFile.uri))
        await deleteFileSystemWithPath(videoFile.uri);

      if (data.thumbnailPath && (await checkPathExist(data.thumbnailPath)))
        await deleteFileSystemWithPath(videoFile.uri);

      deletePendingVideo(data.videoId);
    } catch (error) {
      console.log('FAILED handleGeneratePendingVideo:', error);
      return;
    } finally {
      setIsDeletingVideo(false);
    }
  };

  const handleDeleteCachedVideo = async (videoId: string) => {
    try {
      if (!(await checkPathExist(ROOT_QA_CACHE_VIDEO_FOLDER_PATH))) {
        await createLocalFolder(ROOT_QA_CACHE_VIDEO_FOLDER_PATH);
        return;
      }
      if (!(await checkPathExist(ROOT_QA_ALL_VIDEO_INFO_FILES))) return;
      const cachedItem = cachedVideoList.find(item => item.videoId === videoId);

      if (cachedItem) {
        console.log('LOCAL ITEM EXISTED =>DELETE');
        //delete thumb path if existed
        if (
          cachedItem.thumbnailPath &&
          (await checkPathExist(cachedItem.thumbnailPath))
        )
          await deleteFileSystemWithPath(cachedItem.thumbnailPath);

        //delete video file if existed
        if (
          cachedItem.thumbnailPath &&
          (await checkPathExist(cachedItem.videoFile.uri))
        )
          await deleteFileSystemWithPath(cachedItem.videoFile.uri);
        deleteCachedVideo(videoId);
      }
    } catch (error) {
      console.log('FAILED handleDeleteCachedVideo:', error);
    }
  };
  const findLocalVideoURL = async (videoId: string) => {
    try {
      if (
        !(await checkPathExist(ROOT_QA_CACHE_VIDEO_FOLDER_PATH)) ||
        !(await checkPathExist(ROOT_QA_ALL_VIDEO_INFO_FILES))
      )
        return;

      const localVideoItem = cachedVideoList.find(
        item => item.videoId === videoId,
      );

      if (
        localVideoItem &&
        (await checkPathExist(localVideoItem.videoFile.uri))
      )
        return localVideoItem.videoFile.uri;
    } catch (error) {
      console.log('FAILED findLocalVideo:', error);
      return;
    }
  };

  const handleDeleteMultipleCachedVideo = async (
    deletedItems: IQAVideoUploadData[],
  ) => {
    try {
      if (
        !(await checkPathExist(ROOT_QA_CACHE_VIDEO_FOLDER_PATH)) ||
        !(await checkPathExist(ROOT_QA_ALL_VIDEO_INFO_FILES))
      )
        return;

      for (const deletedItem of deletedItems) {
        if (
          deletedItem.thumbnailPath &&
          (await checkPathExist(deletedItem.thumbnailPath))
        )
          await deleteFileSystemWithPath(deletedItem.thumbnailPath);

        //delete video file if existed
        if (
          deletedItem.thumbnailPath &&
          (await checkPathExist(deletedItem.videoFile.uri))
        )
          await deleteFileSystemWithPath(deletedItem.videoFile.uri);
      }

      deleteMultiCachedVideo(deletedItems.map(item => item.videoId));
    } catch (error) {
      console.log('FAILED handleDeleteMultipleCachedVideo:', error);
    }
  };

  const handleDeleteMultipleCachedVideoWithHostId = async (hostId: string) => {
    try {
      if (
        !(await checkPathExist(ROOT_QA_CACHE_VIDEO_FOLDER_PATH)) ||
        !(await checkPathExist(ROOT_QA_ALL_VIDEO_INFO_FILES))
      )
        return;
      const deletedItems = cachedVideoList.filter(
        item => item.hostId === hostId,
      );
      for (const deletedItem of deletedItems) {
        if (
          deletedItem.thumbnailPath &&
          (await checkPathExist(deletedItem.thumbnailPath))
        )
          await deleteFileSystemWithPath(deletedItem.thumbnailPath);

        //delete video file if existed
        if (
          deletedItem.thumbnailPath &&
          (await checkPathExist(deletedItem.videoFile.uri))
        )
          await deleteFileSystemWithPath(deletedItem.videoFile.uri);
      }

      deleteMultiCachedVideo(deletedItems.map(item => item.videoId));
    } catch (error) {
      console.log('FAILED handleDeleteMultipleCachedVideo:', error);
    }
  };
  const findLocalThumbURL = async (videoId: string) => {
    try {
      if (
        !(await checkPathExist(ROOT_QA_CACHE_VIDEO_FOLDER_PATH)) ||
        !(await checkPathExist(ROOT_QA_ALL_VIDEO_INFO_FILES))
      )
        return;

      const localVideoItem = cachedVideoList.find(
        item => item.videoId === videoId,
      );

      if (
        localVideoItem &&
        localVideoItem.thumbnailPath &&
        (await checkPathExist(localVideoItem.thumbnailPath))
      )
        return localVideoItem.thumbnailPath;
    } catch (error) {
      console.log('FAILED findLocalThumbURL:', error);
      return;
    }
  };

  return {
    isGenerating,
    handleGeneratePendingLocalVideo,
    isDeletingVideo,
    handleDeletePendingVideo,
    findLocalVideoURL,
    handleDeleteCachedVideo,
    handleDeleteMultipleCachedVideo,
    findLocalThumbURL,

    handleDeleteMultipleCachedVideoWithHostId,
  };
};

export default useLocalQAVideo;

const styles = StyleSheet.create({});
