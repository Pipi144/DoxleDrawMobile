import {Alert, StyleSheet} from 'react-native';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useBgUploadStore} from '../GeneralStore/useBgUploadStore';
import {useAuth} from './AuthProvider';
import {useCompany} from './CompanyProvider';
import {useConnection} from './InternetConnectionProvider';
import {NetInfoStateType} from '@react-native-community/netinfo';

import {useShallow} from 'zustand/react/shallow';

interface IDoxleVideoBgUploadContextValue {}
const DoxleVideoBgUploadContext = createContext(null);
const DoxleUploadVideoBgProvider = (children: any) => {
  const [isHandlingPostUpdate, setisHandlingPostUpdate] = useState(false);
  const {
    getInitialPendingVideoList,
    localPendingVideoList,
    getInitialCachedVideoList,
    movePendingToCacheVideoList,
    cachedVideoList,
    isConnectionPromptShown,
    setIsConnectionPromptShow,
    shouldUploadInWeakConnection,
    setShouldUploadInWeakConnection,
  } = useBgUploadStore(
    useShallow(state => ({
      getInitialPendingVideoList: state.getInitialPendingVideoList,
      localPendingVideoList: state.localPendingVideoList,
      getInitialCachedVideoList: state.getInitialCachedVideoList,

      movePendingToCacheVideoList: state.movePendingToCacheVideoList,
      cachedVideoList: state.cachedVideoList,
      isConnectionPromptShown: state.isConnectionPromptShown,
      setIsConnectionPromptShow: state.setIsConnectionPromptShow,
      shouldUploadInWeakConnection: state.shouldUploadInWeakConnection,
      setShouldUploadInWeakConnection: state.setShouldUploadInWeakConnection,
    })),
  );
  const {accessToken, loggedIn} = useAuth();
  const {company} = useCompany();
  const {isConnectionWeak, networkType, isConnected} = useConnection();

  const isConnectionNotSatisfy =
    networkType === NetInfoStateType.cellular ||
    isConnectionWeak ||
    !isConnected;

  useEffect(() => {
    if (loggedIn && company) {
      getInitialPendingVideoList();
      getInitialCachedVideoList();
    }
  }, [loggedIn, company]);
  //!----> QA UPLOAD HANDLER <-----
  // const {handleAddQAVideo} = useSetQAVideoQueryData({});
  // const addVideoQuery = QAQueryAPI.useBgUploadQAVideoQuery({
  //   company,
  //   accessToken,
  // });

  //! ----> COMMENT UPLOAD HANDLER <----

  // const addDiscussionVideoQuery =
  //   DiscussionQueryAPI.useAddDiscussionAttachmentQuery({company, accessToken});

  // const uploadVideo = useCallback(() => {
  //   const {uploadVariant, ...rest} = localPendingVideoList[0];
  //   if (uploadVariant === 'QA')
  //     addVideoQuery.mutate({
  //       uploadData: rest,
  //       postSuccessHandler: data => {
  //         setisHandlingPostUpdate(true);
  //         movePendingToCacheVideoList(data.fileId, 'success');

  //         handleAddQAVideo(data);
  //         setisHandlingPostUpdate(false);
  //       },
  //       postErrorHandler: (data, error) => {
  //         setisHandlingPostUpdate(true);
  //         movePendingToCacheVideoList(data.videoId, 'error', error);
  //         setisHandlingPostUpdate(false);
  //       },
  //     });
  //   else if (uploadVariant === 'Comment') {
  //     addDiscussionVideoQuery.mutate({
  //       fileItem: rest.videoFile,
  //       fileId: rest.videoId,
  //       thumbnail: rest.thumbnailPath
  //         ? {
  //             uri: rest.thumbnailPath,
  //             type: 'image/jpeg',
  //             name: `CommentVideoThumb#${new Date().getTime()}.jpeg`,
  //           }
  //         : undefined,
  //       discussionId: rest.hostId,
  //       postUploadHandler: data => {
  //         setisHandlingPostUpdate(true);
  //         movePendingToCacheVideoList(data.fileId, 'success');
  //         setisHandlingPostUpdate(false);
  //       },
  //       postErrorHandler: ({fileId, errorMessage}) => {
  //         setisHandlingPostUpdate(true);
  //         console.log('HANDLE POST ERROR IN BG UPLOAD:', errorMessage);
  //         if (fileId)
  //           movePendingToCacheVideoList(fileId, 'error', errorMessage);
  //         setisHandlingPostUpdate(false);
  //       },
  //     });
  //   }
  // }, [localPendingVideoList]);
  // useEffect(() => {
  //   // console.log('localPendingVideoList', localPendingVideoList);
  //   if (
  //     localPendingVideoList.length > 0 &&
  //     !isHandlingPostUpdate &&
  //     !addVideoQuery.isLoading &&
  //     !addDiscussionVideoQuery.isLoading
  //   ) {
  //     if (isConnectionNotSatisfy) {
  //       //case: user have not accepted to upload in weak connection
  //       if (!shouldUploadInWeakConnection) {
  //         if (!isConnectionPromptShown) {
  //           Alert.alert(
  //             'Weak internet connection!',
  //             'Upload video process might take long due to weak internet connection, do you still want to proceed or upload later with wifi connection (all of your video will be automatically updated once connected to wifi)?',
  //             [
  //               {
  //                 text: 'Ask me later',
  //                 onPress: () => setShouldUploadInWeakConnection(false),
  //                 style: 'destructive',
  //               },
  //               {
  //                 text: 'Upload',
  //                 onPress: () => {
  //                   setShouldUploadInWeakConnection(true);
  //                   uploadVideo();
  //                 },
  //               },
  //             ],
  //           );

  //           setIsConnectionPromptShow(true);
  //         }
  //         //user choose to upload regardless weak connection
  //       } else {
  //         uploadVideo();
  //       }
  //     } else {
  //       uploadVideo();
  //     }
  //   }
  // }, [
  //   localPendingVideoList,

  //   uploadVideo,
  //   isConnectionNotSatisfy,
  //   shouldUploadInWeakConnection,
  //   isConnectionPromptShown,
  //   isHandlingPostUpdate,
  //   addVideoQuery.isLoading,
  //   !addDiscussionVideoQuery.isLoading,
  // ]);

  const contextValue: IDoxleVideoBgUploadContextValue = useMemo(() => ({}), []);
  return (
    <DoxleVideoBgUploadContext.Provider {...children} value={contextValue} />
  );
};

export default DoxleUploadVideoBgProvider;
