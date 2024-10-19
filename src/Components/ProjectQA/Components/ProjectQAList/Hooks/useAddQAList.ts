import {useState} from 'react';
import {useProjectQAStore} from '../../../Store/useProjectQAStore';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useShallow} from 'zustand/react/shallow';
import {TQATabStack} from '../../../Routes/QARouteType';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useCacheQAContext} from '../../../Provider/CacheQAProvider';
import {NEW_QA_LIST_TEMPLATE, QAList} from '../../../../../Models/qa';
import QAQueryAPI from '../../../../../API/qaQueryAPI';

const useAddQAList = () => {
  const [newQAListTitle, setnewQAListTitle] = useState('');
  const navigation = useNavigation<StackNavigationProp<TQATabStack>>();
  const {company, selectedProject} = useCompany();
  const {showNotification} = useNotification();
  const {accessToken, user} = useAuth();
  const {handleCachingQAList} = useCacheQAContext();
  const {setShowAddQAListHeader} = useProjectQAStore(
    useShallow(state => ({
      setShowAddQAListHeader: state.setShowAddQAListHeader,
    })),
  );
  const onSuccessAddCb = (qaListNew: QAList) => {
    handleCachingQAList(qaListNew);
    setShowAddQAListHeader(false);
    setnewQAListTitle('');
    setTimeout(() => {
      navigation.navigate('QAListDetails', {qaListItem: qaListNew});
    }, 300);
  };
  const onErrorAddCb = () => {
    setShowAddQAListHeader(false);
    setnewQAListTitle('');
  };

  const addDefectQuery = QAQueryAPI.useAddQAListQuery({
    showNotification,
    company,
    accessToken,
    onSuccessCB: onSuccessAddCb,
    onErrorCB: onErrorAddCb,
  });
  const handleAddQAList = () => {
    if (newQAListTitle) {
      const newDefectTemplate: QAList = NEW_QA_LIST_TEMPLATE({
        company,
        createdBy: user?.userId,
        defectListTitle: newQAListTitle,
        project: selectedProject ? selectedProject?.projectId : undefined,
      });
      addDefectQuery.mutate(newDefectTemplate);
    } else setShowAddQAListHeader(false);
  };

  const handleBlurInput = () => {
    if (!addDefectQuery.isPending && !newQAListTitle)
      setShowAddQAListHeader(false);
  };
  const handleNewQAListTitleTextChange = (text: string) => {
    setnewQAListTitle(text);
  };
  return {
    handleAddQAList,
    isAddingQAList: addDefectQuery.isPending,
    newQAListTitle,
    handleNewQAListTitleTextChange,
    handleBlurInput,
  };
};

export default useAddQAList;
