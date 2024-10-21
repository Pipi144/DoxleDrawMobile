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
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Alert} from 'react-native';
import {useProjectQAStore} from '../Store/useProjectQAStore';
import {useShallow} from 'zustand/shallow';
import {useAuth} from '../../../Providers/AuthProvider';
import {useCompany} from '../../../Providers/CompanyProvider';
import {useConnection} from '../../../Providers/InternetConnectionProvider';
import {NetInfoStateType} from '@react-native-community/netinfo';
import useSetQAVideoQueryData from '../../../CustomHooks/QueryDataHooks/useSetQAVideoQueryData';
import QAQueryAPI from '../../../API/qaQueryAPI';

type Props = PropsWithChildren & {};
interface ICacheQAVideoProviderContextValue {}
const CacheQAVideoProviderContext =
  createContext<ICacheQAVideoProviderContextValue>({});
const CacheQAVideoProvider = ({children, ...rest}: Props) => {
  const [isHandlingPostUpdate, setisHandlingPostUpdate] = useState(false);
  const {
    getInitialCachedVideoList,
    movePendingToCacheVideoList,

    isConnectionPromptShown,
    setIsConnectionPromptShow,
    shouldUploadInWeakConnection,
    setShouldUploadInWeakConnection,
    cachedVideoList,
  } = useProjectQAStore(
    useShallow(state => ({
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
  const {handleAddQAVideo} = useSetQAVideoQueryData({});
  const addQAVideoQuery = QAQueryAPI.useBgUploadQAVideoQuery({
    company,
    accessToken,
  });

  const uploadVideo = useCallback(() => {
    const rest = cachedVideoList.find(vid => vid.status === 'pending');
    if (rest)
      addQAVideoQuery.mutate({
        uploadData: rest,
        postSuccessHandler: data => {
          setisHandlingPostUpdate(true);
          movePendingToCacheVideoList(data.fileId, 'success');

          handleAddQAVideo(data);
          setisHandlingPostUpdate(false);
        },
        postErrorHandler: (data, error) => {
          setisHandlingPostUpdate(true);
          movePendingToCacheVideoList(data.videoId, 'error', error);
          setisHandlingPostUpdate(false);
        },
      });
  }, [cachedVideoList]);

  useEffect(() => {
    if (loggedIn && company) {
      getInitialCachedVideoList();
    }
  }, [loggedIn, company]);
  useEffect(() => {
    const pendingVid = cachedVideoList.find(vid => vid.status === 'pending');
    if (pendingVid && !isHandlingPostUpdate && !addQAVideoQuery.isPending) {
      if (isConnectionNotSatisfy) {
        //case: user have not accepted to upload in weak connection
        if (!shouldUploadInWeakConnection) {
          if (!isConnectionPromptShown) {
            Alert.alert(
              'Weak internet connection!',
              'Upload video process might take long due to weak internet connection, do you still want to proceed or upload later with wifi connection (all of your video will be automatically updated once connected to wifi)?',
              [
                {
                  text: 'Ask me later',
                  onPress: () => setShouldUploadInWeakConnection(false),
                  style: 'destructive',
                },
                {
                  text: 'Upload',
                  onPress: () => {
                    setShouldUploadInWeakConnection(true);
                    uploadVideo();
                  },
                },
              ],
            );

            setIsConnectionPromptShow(true);
          }
          //user choose to upload regardless weak connection
        } else {
          uploadVideo();
        }
      } else {
        uploadVideo();
      }
    }
  }, [
    cachedVideoList,
    uploadVideo,
    isConnectionNotSatisfy,
    shouldUploadInWeakConnection,
    isConnectionPromptShown,
    isHandlingPostUpdate,
    addQAVideoQuery.isPending,
  ]);

  const contextValue: ICacheQAVideoProviderContextValue = useMemo(
    () => ({}),
    [],
  );
  return (
    <CacheQAVideoProviderContext.Provider value={contextValue}>
      {children}
    </CacheQAVideoProviderContext.Provider>
  );
};

export default CacheQAVideoProvider;
