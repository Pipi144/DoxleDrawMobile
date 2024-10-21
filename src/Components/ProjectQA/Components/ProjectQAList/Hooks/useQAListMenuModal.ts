import {StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

import {useNavigation} from '@react-navigation/native';
import {QAList} from '../../../../../Models/qa';
import {TQATabStack} from '../../../Routes/QARouteType';
type Props = {
  editedQAList: QAList | undefined;
  setEditedQAList: React.Dispatch<React.SetStateAction<QAList | undefined>>;
};

interface QAListItemExpandMenu {
  handlePressSignatureMenu: () => void;
  handlePressEditQAListMenu: () => void;
  handlePressViewPdfMenu: () => void;
}
const useQAListMenuModal = ({
  editedQAList,
  setEditedQAList,
}: Props): QAListItemExpandMenu => {
  const navigation = useNavigation<StackNavigationProp<TQATabStack>>();

  const handlePressSignatureMenu = () => {
    setEditedQAList(undefined);
    const item: QAList | undefined = editedQAList;
    setTimeout(() => {
      if (item) navigation.navigate('QAEditSignature', {qaListItem: item});
    }, 500);
  };

  const handlePressEditQAListMenu = () => {
    setEditedQAList(undefined);
    const item: QAList | undefined = editedQAList;
    setTimeout(() => {
      if (item)
        navigation.navigate('QAListEdit', {
          qaList: item,
        });
    }, 500);
  };
  const handlePressViewPdfMenu = () => {
    setEditedQAList(undefined);
    const item: QAList | undefined = editedQAList;
    setTimeout(() => {
      if (item)
        navigation.navigate('QAExportPDF', {
          qaListItem: item,
        });
    }, 500);
  };
  return {
    handlePressSignatureMenu,
    handlePressEditQAListMenu,
    handlePressViewPdfMenu,
  };
};

export default useQAListMenuModal;

const styles = StyleSheet.create({});
