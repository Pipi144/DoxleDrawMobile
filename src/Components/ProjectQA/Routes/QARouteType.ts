import {Contact} from '../../../../../../Models/contacts';
import {QA, QAList, TQAStatus} from '../../../../../../Models/qa';
import {AnnotationQAImage} from '../Hooks/useQAImageList';

export type TQAStackName =
  | 'RootQA'
  | 'QAListDetails'
  | 'QAItemDetails'
  | 'QAEditSignature'
  | 'QAListEdit'
  | 'QAExportPDF'
  | 'QAMarkup';

export type TQATabStack = {
  RootQA: undefined;
  QAListDetails: {
    qaListItem: QAList;
  };
  QAItemDetails: {
    qaItem: QA;
  };
  QAEditSignature: {
    qaListItem: QAList;
  };
  QAListEdit: {
    qaList: QAList;
  };
  QAExportPDF: {
    qaListItem: QAList;
    selectedAssignee?: Contact;
    selectedStatus?: TQAStatus;
  };
  QAMarkup: {
    selectedAnnotationImage: AnnotationQAImage;
  };
  QAViewVideo: {
    videoUrl: string;
  };

  QAViewImage: {
    imageURL: string;
    imageHeight: number;
    imageWidth: number;
  };
};
