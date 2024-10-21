import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  StyledContributorItemContainer,
  StyledQAContributorItemText,
  StyledSelectAssigneePdfView,
} from './StyledComponentQAViewPdf';

import Animated from 'react-native-reanimated';
import SearchAssigneeSection from './SearchAssigneeSection';
import useSelectAssigneePdfView from './Hooks/useSelectAssigneePdfView';
import {Contact} from '../../../../Models/contacts';
import {useDOXLETheme} from '../../../../Providers/DoxleThemeProvider/DoxleThemeProvider';
import ListLoadingMoreBottom from '../../../../Utilities/AnimationScreens/ListLoadingMoreBottom/ListLoadingMoreBottom';

type Props = {
  handleGenerateQAReportForAssignee: (assignee?: Contact | undefined) => void;
  onClose: () => void;
  selectedAssignee: Contact | undefined;
};

const SelectAssigneePdfView = ({
  handleGenerateQAReportForAssignee,
  onClose,
  selectedAssignee,
}: Props) => {
  const {THEME_COLOR} = useDOXLETheme();
  const {
    contactList,
    handleSearchAssigneeTextChange,
    hasNextPage,
    fetchNextPageAssignee,
    isFetchingNextPage,
  } = useSelectAssigneePdfView({});

  return (
    <StyledSelectAssigneePdfView>
      <SearchAssigneeSection
        handleSearchAssigneeTextChange={handleSearchAssigneeTextChange}
      />
      <Animated.View style={styles.listWrapper}>
        <FlatList<Contact>
          data={contactList}
          contentContainerStyle={{flexGrow: 0}}
          renderItem={({item, index}) => (
            <StyledContributorItemContainer
              onPress={() => {
                handleGenerateQAReportForAssignee(item);
                onClose();
              }}>
              <StyledQAContributorItemText
                $selected={Boolean(
                  selectedAssignee &&
                    selectedAssignee.contactId === item.contactId,
                )}>
                {item.firstName} {item.lastName}
              </StyledQAContributorItemText>
            </StyledContributorItemContainer>
          )}
          onEndReached={() => {
            if (hasNextPage) fetchNextPageAssignee();
          }}
          onEndReachedThreshold={0.1}
          automaticallyAdjustContentInsets
          automaticallyAdjustsScrollIndicatorInsets
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="interactive"
          keyExtractor={(item, index) => (item as Contact).contactId}
        />
      </Animated.View>
      <StyledContributorItemContainer
        onPress={() => {
          handleGenerateQAReportForAssignee();
          onClose();
        }}
        style={{
          borderBottomWidth: 0,
          borderTopColor: THEME_COLOR.primaryDividerColor,
          borderTopWidth: 1,
        }}>
        <StyledQAContributorItemText
          $selected={false}
          style={{color: THEME_COLOR.errorColor}}>
          Clear Assignee
        </StyledQAContributorItemText>
      </StyledContributorItemContainer>

      {isFetchingNextPage && (
        <ListLoadingMoreBottom
          size={30}
          containerStyle={styles.loadingBottomContainer}
        />
      )}
    </StyledSelectAssigneePdfView>
  );
};

export default SelectAssigneePdfView;

const styles = StyleSheet.create({
  listWrapper: {
    flex: 1,
    width: '100%',
  },
  loadingBottomContainer: {
    position: 'absolute',
    zIndex: 10,
    bottom: 50,
    left: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
