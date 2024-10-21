import {StyleSheet} from 'react-native';
import React, {useCallback, useMemo} from 'react';

import {FadeInUp, FadeOutUp, LinearTransition} from 'react-native-reanimated';

import AssigneeListSkeleton from './AssigneeListSkeleton';
import {FlatList} from 'react-native-gesture-handler';
import AssigneeListItem from './AssigneeListItem';

import AddNewContactForm from './AddNewContactForm';
import {StyledAssigneeListContainer} from './StyledComponentEditAssigneeModal';
import useAssigneeList from './Hooks/useAssigneeList';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import {Contact} from '../../../../Models/contacts';
import DoxleEmptyPlaceholder from '../../../DesignPattern/DoxleEmptyPlaceholder/DoxleEmptyPlaceholder';
import {ErrorFetchingBanner} from '../../../DesignPattern/DoxleBanners';
import {EmptyContactBanner} from '../../../DesignPattern/DoxleIcons';
import ListLoadingMoreBottom from '../../../../Utilities/AnimationScreens/ListLoadingMoreBottom/ListLoadingMoreBottom';

type Props = {
  searchAssigneeText: string;

  showAddAssigneeForm: boolean;
};

const AssigneeList = ({
  searchAssigneeText,

  showAddAssigneeForm,
}: Props) => {
  const {THEME_COLOR} = useDOXLETheme();
  const {
    contactList,
    isFetchingContactList,
    isSuccessFetchingContactList,
    isErrorFetchingContactList,
    hasNextPageContact,
    fetchNextPageFunction,
    isFetchingNextPage,
    filterRetrieveContactListQuery,
  } = useAssigneeList({searchAssigneeText});

  //*render list
  const renderItem = useCallback(
    (props: {item: Contact; index: number}) => (
      <AssigneeListItem assigneeItem={props.item} itemIndex={props.index} />
    ),
    [],
  );
  const listEmptyComponent = useMemo(
    () => (
      <DoxleEmptyPlaceholder
        headTitleText={
          isErrorFetchingContactList ? 'Something Wrong' : 'No Contacts'
        }
        subTitleText={
          isErrorFetchingContactList
            ? 'Sorry, Failed to get contact list! '
            : 'Add New Contact To Assign To Dockets'
        }
        wrapperStyle={{padding: 14}}
        illustrationComponent={
          isErrorFetchingContactList ? (
            <ErrorFetchingBanner themeColor={THEME_COLOR} />
          ) : (
            <EmptyContactBanner
              themeColor={THEME_COLOR}
              containerStyle={{width: '70%', marginBottom: 14}}
            />
          )
        }
      />
    ),
    [isErrorFetchingContactList, THEME_COLOR],
  );
  return (
    <StyledAssigneeListContainer
      entering={FadeInUp}
      exiting={FadeOutUp}
      layout={LinearTransition.springify().damping(16)}>
      {isFetchingContactList && <AssigneeListSkeleton />}

      {!isFetchingContactList && (
        <FlatList
          data={contactList}
          nestedScrollEnabled={true}
          contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: 8,
          }}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.contactId}#${index}`}
          onEndReached={fetchNextPageFunction}
          onEndReachedThreshold={0.5}
          initialNumToRender={14}
          maxToRenderPerBatch={4}
          updateCellsBatchingPeriod={50}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={listEmptyComponent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      )}

      {isFetchingNextPage && (
        <ListLoadingMoreBottom
          containerStyle={{
            position: 'absolute',
            width: '100%',
            bottom: 0,
            left: 0,
            height: 50,
            zIndex: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          size={40}
        />
      )}

      {showAddAssigneeForm && (
        <AddNewContactForm
          initialSearchText={searchAssigneeText}
          filterRetrieveContactListQuery={filterRetrieveContactListQuery}
        />
      )}
    </StyledAssigneeListContainer>
  );
};

export default AssigneeList;

const styles = StyleSheet.create({});
