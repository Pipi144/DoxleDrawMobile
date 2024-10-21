import {View} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import useQAListDetailPage from './Hooks/useQAListDetailPage';
import {
  StyledFilterGraphicDisplay,
  StyledFilterGraphicTextInfo,
  StyledQAFilterTagWrapper,
  StyledQAListDetailPageContainer,
} from './StyledComponentsQAListDetail';
import QAItemList from './QAItemList';
import {TQATabStack} from '../../Routes/QARouteType';
import MateIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FilterQAModal from './FilterQAModal';
import QAFilterTag from './CommonComponents/QAFilterTag';
import EditAssigneeModal from '../EditAssigneeModal/EditAssigneeModal';
import SearchSection from '../../../DesignPattern/SearchSection/SearchSection';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
type Props = {navigation: any};

const QAListDetail = (props: Props) => {
  const {doxleFontSize} = useDOXLETheme();
  const {qaListItem} = useRoute().params as TQATabStack['QAListDetails'];

  const {
    filterGetQAItems,
    completedCount,
    unattendedCount,
    showFilter,
    setShowFilter,
    setFilterGetQAItems,
    ...rest
  } = useQAListDetailPage({
    qaListItem,
  });

  return (
    <StyledQAListDetailPageContainer $insetBottom={14}>
      <SearchSection
        placeholder="Search action items"
        containerStyle={{
          marginVertical: 14,
        }}
        onSearch={rest.setSearchInput}
      />

      {(filterGetQAItems.assignee ||
        filterGetQAItems.floor ||
        filterGetQAItems.status) && (
        <StyledQAFilterTagWrapper>
          {filterGetQAItems.assignee && (
            <QAFilterTag
              item={filterGetQAItems.assignee}
              displayText={`${filterGetQAItems.assignee.firstName} ${filterGetQAItems.assignee.lastName}`}
              onRemove={() => setFilterGetQAItems({assignee: undefined})}
              extraContent={
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 4,
                  }}>
                  <StyledFilterGraphicDisplay>
                    <FeatherIcon
                      name="x-circle"
                      size={doxleFontSize.contentTextSize}
                      color={'#FF9900'}
                    />
                    <StyledFilterGraphicTextInfo>
                      {unattendedCount}
                    </StyledFilterGraphicTextInfo>
                  </StyledFilterGraphicDisplay>
                  <StyledFilterGraphicDisplay style={{marginLeft: 8}}>
                    <MateIcons
                      name="check-circle-outline"
                      size={doxleFontSize.contentTextSize}
                      color={'#209D34'}
                    />
                    <StyledFilterGraphicTextInfo>
                      {completedCount}
                    </StyledFilterGraphicTextInfo>
                  </StyledFilterGraphicDisplay>
                </View>
              }
            />
          )}
          {filterGetQAItems.status && (
            <QAFilterTag
              item={filterGetQAItems.status}
              displayText={
                filterGetQAItems.status === 'Unattended'
                  ? 'Working'
                  : filterGetQAItems.status
              }
              onRemove={() => setFilterGetQAItems({status: undefined})}
            />
          )}
          {filterGetQAItems.floor && (
            <QAFilterTag
              item={filterGetQAItems.floor}
              displayText={`${
                filterGetQAItems.floor === 'none'
                  ? 'No floor'
                  : filterGetQAItems.floor === 'not-none'
                  ? 'With floor'
                  : filterGetQAItems.floor.name
              }`}
              onRemove={() => setFilterGetQAItems({floor: undefined})}
            />
          )}
        </StyledQAFilterTagWrapper>
      )}
      <QAItemList
        qaListItem={qaListItem}
        setSelectedQAForAssignee={rest.setSelectedQAForAssignee}
      />

      <FilterQAModal
        showModal={showFilter}
        closeModal={() => setShowFilter(false)}
        qaList={qaListItem}
      />

      <EditAssigneeModal
        showModal={rest.showAssigneeModal}
        handleCloseModal={rest.closeAssigneeModal}
        qaItem={rest.selectedQAForAssignee}
        handleUpdateAssignee={rest.handleUpdateAssignee}
      />
    </StyledQAListDetailPageContainer>
  );
};

export default QAListDetail;
