import {StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

import {useNavigation} from '@react-navigation/native';
import {QAList} from '../../../../../Models/qa';
import {TQATabStack} from '../../../Routes/QARouteType';
type Props = {qaListItem: QAList};

interface QAListItemExpandMenu {
  handlePressSignatureMenu: () => void;
  handlePressEditQAListMenu: () => void;
  handlePressViewPdfMenu: () => void;
}
const useQAListItemExpandMenu = ({qaListItem}: Props): QAListItemExpandMenu => {
  const navigation = useNavigation<StackNavigationProp<TQATabStack>>();

  const handlePressSignatureMenu = () => {
    navigation.navigate('QAEditSignature', {qaListItem});
  };

  const handlePressEditQAListMenu = () => {
    navigation.navigate('QAListEdit', {
      qaList: qaListItem,
    });
  };
  const handlePressViewPdfMenu = () => {
    navigation.navigate('QAExportPDF', {
      qaListItem: qaListItem,
    });
  };
  return {
    handlePressSignatureMenu,
    handlePressEditQAListMenu,
    handlePressViewPdfMenu,
  };
};

export default useQAListItemExpandMenu;

const styles = StyleSheet.create({});
