import {TDateISODate} from './dateFormat';
import {formatDate, formatTDateISODate} from '../Utilities/FunctionUtilities';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
export interface DefectPhoto {
  photoId: string; //! this id also is the name of the photo folder
  height: number;
  width: number;
  fileType: string;
  fileName: string;
  created: TDateISODate;
  isNew?: boolean;
  processImageUrl?: string;
  defectId: string;
}
export interface DefectReport {
  defectId: string;
  title: string;
  created: TDateISODate;
  isNew: boolean;
}
export const NEW_LOCAL_PHOTO_TEMPLATE = (defectId: string): DefectPhoto => {
  const randomId = uuidv4();
  return {
    photoId: randomId,
    height: 0,
    width: 0,
    fileType: '',
    fileName: 'New Image',
    created: formatTDateISODate(new Date()),
    isNew: true,
    defectId: defectId,
  };
};

export const NEW_REPORT_TEMPLATE = (): DefectReport => {
  const randomId = uuidv4();
  const today = formatDate(new Date(), 'dd MonthName yyyy');
  return {
    defectId: randomId,
    title: `Report - ${today}`,
    created: formatTDateISODate(new Date()),
    isNew: true,
  };
};
