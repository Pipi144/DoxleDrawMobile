import {Platform, StyleSheet} from 'react-native';
import {useCallback, useState} from 'react';

import {AnnotationQAImage} from '../../QADetail/Hooks/useQAImageList';

import {useFocusEffect, useNavigation} from '@react-navigation/native';

import uuid from 'react-native-uuid';

import {useProjectQAStore} from '../../../Store/useProjectQAStore';

import {useShallow} from 'zustand/react/shallow';
import {
  IArrow,
  ICircle,
  ILabel,
  IPath,
  IRectangle,
  IStraightLine,
} from '../../../../../Models/MarkupTypes';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useNotification} from '../../../../../Providers/NotificationProvider';
import {useAuth} from '../../../../../Providers/AuthProvider';
import {useCacheQAContext} from '../../../Provider/CacheQAProvider';
import QAQueryAPI from '../../../../../API/qaQueryAPI';
import {
  QAMarkupArrow,
  QAMarkupCircle,
  QAMarkupLabel,
  QAMarkupPath,
  QAMarkupRectangle,
  QAMarkupStraightLine,
  QAMedia,
} from '../../../../../Models/qa';
type Props = {
  selectedAnnotationImage: AnnotationQAImage;
};
interface QAImageMarkupModalHook {
  onSaveAnnotationImage: (props: {
    uri: string;
    markupList: Array<
      ICircle | IStraightLine | ILabel | IRectangle | IArrow | IPath
    >;
  }) => void;
  isSavingData: boolean;
  handleGoback: () => void;
  imgPathForMarkup: string;
}
const useQAImageMarkup = ({
  selectedAnnotationImage,
}: Props): QAImageMarkupModalHook => {
  const [imgPathForMarkup, setImgPathForMarkup] = useState(
    selectedAnnotationImage.qaImage.thumbPath,
  );
  const navigate = useNavigation();
  const {company} = useCompany();
  const {showNotification} = useNotification();
  const {accessToken} = useAuth();
  const {
    handleSaveLocalQAMarkupList,
    handleRemoveCachedQAMarkup,
    handleSaveScreenShotQAImageWithMarkup,
    handleSaveQAThumbnailMarkup,
    handleSaveLocalQAImgWithMarkupAsThumbnail,
    handleGetFullSizeImgForMarkup,
    handleGetCachedQAImageInfo,
  } = useCacheQAContext();
  const {updateMarkupQAImage, updateThumbnailQAImage} = useProjectQAStore(
    useShallow(state => ({
      updateMarkupQAImage: state.updateMarkupQAImage,
      updateThumbnailQAImage: state.updateThumbnailQAImage,
    })),
  );
  const updateQAImageWithMarkupQuery =
    QAQueryAPI.useUpdateQAImageWithMarkupQuery({
      showNotification,
      accessToken,
      company,
    });
  const handleGoback = () => {
    if (navigate.canGoBack()) navigate.goBack();
  };
  const onSuccessUpdateMarkupCb = async (props: {
    successList: Array<
      | QAMarkupRectangle
      | QAMarkupCircle
      | QAMarkupStraightLine
      | QAMarkupLabel
      | QAMarkupArrow
      | QAMarkupPath
    >;
    qaImage: QAMedia;
  }) => {
    handleSaveLocalQAMarkupList({
      qaImage: props.qaImage,
      markupList: props.successList,
    });
    updateMarkupQAImage({
      markupList: props.successList,
      qaImage: selectedAnnotationImage.qaImage,
    });
  };
  const onErrorUpdateMarkupCb = async () => {
    if (selectedAnnotationImage)
      handleRemoveCachedQAMarkup(selectedAnnotationImage?.qaImage);
  };
  const updateMarkupQuery = QAQueryAPI.useUpdateQAImageMarkupQuery({
    showNotification,
    accessToken,
    company,
    onSuccessCB: onSuccessUpdateMarkupCb,
    onErrorCb: onErrorUpdateMarkupCb,
  });
  const onSaveAnnotationImage = async (props: {
    uri: string;
    markupList: Array<
      ICircle | IStraightLine | ILabel | IRectangle | IArrow | IPath
    >;
  }) => {
    if (selectedAnnotationImage) {
      const {qaImage} = selectedAnnotationImage;

      let finalMarkupData: Array<
        | QAMarkupRectangle
        | QAMarkupCircle
        | QAMarkupStraightLine
        | QAMarkupLabel
        | QAMarkupArrow
        | QAMarkupPath
      > = [];
      props.markupList.forEach((markup, idx) => {
        const tempId = uuid.v4();
        if (markup.type === 'Rectangle')
          finalMarkupData.push({
            id: tempId,
            bgColor: markup.color,
            borderColor: markup.color,
            borderThickness: 1,
            defectImage: selectedAnnotationImage.qaImage.imageId,
            markupIndex: idx,
            shape: 'rectangle',
            startX: parseFloat(markup.x.toFixed(1)),
            startY: parseFloat(markup.y.toFixed(1)),
            endX: parseFloat((markup.x + markup.w).toFixed(1)),
            endY: parseFloat((markup.y + markup.h).toFixed(1)),
          } as QAMarkupRectangle);
        else if (markup.type === 'Circle')
          finalMarkupData.push({
            id: tempId,
            bgColor: markup.color,
            borderColor: markup.color,
            borderThickness: 1,
            defectImage: selectedAnnotationImage.qaImage.imageId,
            markupIndex: idx,
            shape: 'circle',
            startX: parseFloat(markup.x.toFixed(1)),
            startY: parseFloat(markup.y.toFixed(1)),
            radius: parseFloat(markup.r.toFixed(1)),
          } as QAMarkupCircle);
        else if (markup.type === 'StraightLine')
          finalMarkupData.push({
            id: tempId,
            bgColor: markup.color,
            borderColor: markup.color,
            borderThickness: 1,
            defectImage: selectedAnnotationImage.qaImage.imageId,
            markupIndex: idx,
            shape: 'line',
            startX: parseFloat(markup.x1.toFixed(1)),
            startY: parseFloat(markup.y1.toFixed(1)),
            endX: parseFloat(markup.x2.toFixed(1)),
            endY: parseFloat(markup.y2.toFixed(1)),
          } as QAMarkupStraightLine);
        else if (markup.type === 'Arrow')
          finalMarkupData.push({
            id: tempId,
            bgColor: markup.color,
            borderColor: markup.color,
            borderThickness: 1,
            defectImage: selectedAnnotationImage.qaImage.imageId,
            markupIndex: idx,
            shape: 'arrow',
            startX: parseFloat(markup.x1.toFixed(1)),
            startY: parseFloat(markup.y1.toFixed(1)),
            endX: parseFloat(markup.x2.toFixed(1)),
            endY: parseFloat(markup.y2.toFixed(1)),
          } as QAMarkupArrow);
        else if (markup.type === 'Pencil')
          finalMarkupData.push({
            id: tempId,
            bgColor: markup.color,
            borderColor: markup.color,
            borderThickness: 1,
            defectImage: selectedAnnotationImage.qaImage.imageId,
            markupIndex: idx,
            shape: 'path',
            path: markup.pathPoints,
          } as QAMarkupPath);
        else
          finalMarkupData.push({
            id: tempId,
            bgColor: markup.color,
            borderColor: markup.color,
            borderThickness: 1,
            defectImage: selectedAnnotationImage.qaImage.imageId,
            markupIndex: idx,
            shape: 'label',
            startX: parseFloat(markup.x.toFixed(1)),
            startY: parseFloat(markup.y.toFixed(1)),
            markupText: markup.text,
          } as QAMarkupLabel);
      });

      //save display thumb for qa folder
      await handleSaveQAThumbnailMarkup({qaImage, thumbUri: props.uri});

      //! need to get the latest status for qa image because during the markup process, the image might already uploaded to the server so its uploading status might change,
      const latestCacheQAImageInfo = await handleGetCachedQAImageInfo(qaImage);

      // only make call to server if the file is already uploaded to server
      if (latestCacheQAImageInfo.status === 'success') {
        //SAVE qa img with mark up to thumb
        const newThumbnailImage =
          await handleSaveLocalQAImgWithMarkupAsThumbnail({
            qaImage,
            imgWithMarkupPath: props.uri,
          });
        if (newThumbnailImage) {
          updateThumbnailQAImage({
            newThumbnailPath: newThumbnailImage,
            qaImage: latestCacheQAImageInfo,
          });
        }

        // update qa image with markup
        updateMarkupQuery.mutate({
          qaImage: latestCacheQAImageInfo,
          markupList: finalMarkupData,
        });
        //# post image with markup
        updateQAImageWithMarkupQuery.mutate({
          qaImage: latestCacheQAImageInfo,
          newUriPath: props.uri,
        });
      } else {
        await handleSaveLocalQAMarkupList({
          qaImage: latestCacheQAImageInfo,
          markupList: finalMarkupData,
        });

        const newThumbnailImage = await handleSaveScreenShotQAImageWithMarkup({
          qaImg: latestCacheQAImageInfo,
          screenShotUri: props.uri,
        });
        if (newThumbnailImage) {
          console.log('IMAGE PENDING STATUS, NEW THUMB IMAGE IS SAVED');
          updateThumbnailQAImage({
            newThumbnailPath: newThumbnailImage,
            qaImage: latestCacheQAImageInfo,
          });
        }
      }

      updateMarkupQAImage({
        markupList: finalMarkupData,
        qaImage: qaImage,
      });

      // handleGoback();
    }
  };
  const isSavingData =
    updateMarkupQuery.isPending || updateQAImageWithMarkupQuery.isPending;

  const handleGetCachedFullSizeImg = async () => {
    try {
      const result = await handleGetFullSizeImgForMarkup(
        selectedAnnotationImage.qaImage,
      );
      if (result) setImgPathForMarkup(result);
    } catch (error) {
      console.log('ERROR handleGetCachedFullSizeImg:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setImgPathForMarkup(selectedAnnotationImage.qaImage.thumbPath);
      handleGetCachedFullSizeImg();
    }, []),
  );
  return {onSaveAnnotationImage, isSavingData, handleGoback, imgPathForMarkup};
};

export default useQAImageMarkup;

const styles = StyleSheet.create({});
