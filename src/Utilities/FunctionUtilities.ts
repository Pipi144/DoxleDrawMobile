import {TISODateTime, TDateISODate, TMonthDate} from '../Models/dateFormat';
import {Dimensions, PixelRatio, Platform} from 'react-native';
import * as RNFS from 'react-native-fs';

export const formatDate = (
  inputDate: string | Date,
  format:
    | 'yyyy-MM-dd'
    | 'MM-dd-yyyy'
    | 'dd-MM-yyyy'
    | 'dd MonthName yyyy'
    | 'MonthName ddth yyyy'
    | 'monthAcronym dd, yyyy',

  fullDate?: 'fullDate',
) => {
  //!NOTICE: if input date is a string=> the string formate of date passed in should be "YYYY-MM-DD"
  //parse the input date
  let date: Date =
    typeof inputDate === 'string' ? new Date(inputDate) : inputDate;

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const weekDate = date.getDay();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  let dataFormat = format as string;

  let dateOfWeek: string;
  switch (weekDate) {
    case 1:
      dateOfWeek = 'Monday';
      break;
    case 2:
      dateOfWeek = 'Tuesday';
      break;
    case 3:
      dateOfWeek = 'Wednesday';
      break;
    case 4:
      dateOfWeek = 'Thursday';
      break;
    case 5:
      dateOfWeek = 'Friday';
      break;
    case 6:
      dateOfWeek = 'Saturday';
      break;
    case 0:
      dateOfWeek = 'Sunday';
      break;
    default:
      dateOfWeek = 'Sunday';
      break;
  }

  if (day && month && year) {
    if (!fullDate) {
      if (
        format !== 'dd MonthName yyyy' &&
        format !== 'MonthName ddth yyyy' &&
        format !== 'monthAcronym dd, yyyy'
      ) {
        //replace the month
        dataFormat = dataFormat.replace(
          'MM',
          month.toString().padStart(2, '0'),
        );

        //replace the year
        if (dataFormat.indexOf('yyyy') > -1) {
          dataFormat = dataFormat.replace('yyyy', year.toString());
        } else if (dataFormat.indexOf('yy') > -1) {
          dataFormat = dataFormat.replace('yy', year.toString().substr(2, 2));
        }

        //replace the day
        dataFormat = dataFormat.replace('dd', day.toString().padStart(2, '0'));

        return dataFormat;
      } else {
        if (format !== 'monthAcronym dd, yyyy') {
          //replace the month
          dataFormat = dataFormat.replace(
            'MonthName',
            convertMonthValueToText(month - 1, 1000),
          );

          //replace the year
          if (dataFormat.indexOf('yyyy') > -1) {
            dataFormat = dataFormat.replace('yyyy', year.toString());
          } else if (dataFormat.indexOf('yy') > -1) {
            dataFormat = dataFormat.replace('yy', year.toString().substr(2, 2));
          }
          const dayString = day.toString().padStart(2, '0');
          //replace the day
          dataFormat = dataFormat.replace('dd', dayString);

          if (format === 'MonthName ddth yyyy') {
            if (dayString[1] === '1' && dayString[0] !== '1')
              dataFormat = dataFormat.replace('th', 'st');
            else if (dayString[1] === '2' && dayString[0] !== '1')
              dataFormat = dataFormat.replace('th', 'nd');
            else if (dayString[1] === '3' && dayString[0] !== '1')
              dataFormat = dataFormat.replace('th', 'rd');
          }

          return dataFormat;
        } else {
          // format monthAcronym dd, yyyy
          // replace month
          dataFormat = dataFormat.replace(
            'monthAcronym',
            getMonthName(month - 1, 'acronym'),
          );

          //replace the year
          dataFormat = dataFormat.replace('yyyy', year.toString());

          //replace the day
          dataFormat = dataFormat.replace('dd', day.toString());
          return dataFormat;
        }
      }
    } else {
      if (format !== 'monthAcronym dd, yyyy')
        return (
          dateOfWeek.substring(0, 3) +
          ', ' +
          `${day < 10 ? '0' + day.toString() : day}` +
          ' ' +
          `${convertMonthValueToText(month, 3)}` +
          ' ' +
          year.toString() /*.substr(2, 2)*/ +
          ' ' +
          `${
            hour.toString()
            /*hour <= 12
            ? hour < 10
              ? "0" + hour.toString()
              : hour
            : Math.abs(12 - hour) < 10
            ? "0" + Math.abs(12 - hour).toString()
            : Math.abs(12 - hour) < 10*/
          }` +
          ':' +
          `${minutes < 10 ? '0' + minutes.toString() : minutes}` /*+
        " " +
        `${hour < 24 ? "AM" : "PM"}`*/
        );
      else {
        dataFormat = dataFormat.replace(
          'monthAcronym',
          getMonthName(month - 1, 'acronym'),
        );

        //replace the year
        dataFormat = dataFormat.replace('yyyy', year.toString());

        //replace the day
        dataFormat = dataFormat.replace('dd', day.toString());
        dataFormat += ` ${dateOfWeek} ${hour >= 12 ? hour - 12 : hour}:${
          minutes < 10 ? '0' + minutes.toString() : minutes
        }${hour >= 12 ? 'PM' : 'AM'}`;
        return dataFormat;
      }
    }
  } else return ' ';
};

export const convertUTCDate = (
  date: Date,
  format: 'yyyy-MM-dd' | 'MM-dd-yyyy' | 'dd-MM-yyyy',
  fullDate?: 'fullDate',
) => {
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  const weekDate = date.getUTCDay();
  const hour = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  let dataFormat = format as string;

  let dateOfWeek: string;
  switch (weekDate) {
    case 1:
      dateOfWeek = 'Monday';
      break;
    case 2:
      dateOfWeek = 'Tuesday';
      break;
    case 3:
      dateOfWeek = 'Wednesday';
      break;
    case 4:
      dateOfWeek = 'Thursday';
      break;
    case 5:
      dateOfWeek = 'Friday';
      break;
    case 6:
      dateOfWeek = 'Saturday';
      break;
    case 0:
      dateOfWeek = 'Sunday';
      break;
    default:
      dateOfWeek = 'Sunday';
      break;
  }

  if (day && month && year) {
    if (!fullDate) {
      //replace the month
      dataFormat = dataFormat.replace('MM', month.toString().padStart(2, '0'));

      //replace the year
      if (dataFormat.indexOf('yyyy') > -1) {
        dataFormat = dataFormat.replace('yyyy', year.toString());
      } else if (dataFormat.indexOf('yy') > -1) {
        dataFormat = dataFormat.replace('yy', year.toString().substr(2, 2));
      }

      //replace the day
      dataFormat = dataFormat.replace('dd', day.toString().padStart(2, '0'));

      return dataFormat;
    } else {
      return (
        `${day < 10 ? '0' + day.toString() : minutes}` +
        '.' +
        `${month < 10 ? '0' + month.toString() : minutes}` +
        '.' +
        year.toString().substr(2, 2) +
        ' ' +
        dateOfWeek +
        ' ' +
        `${
          hour <= 12
            ? hour < 10
              ? '0' + hour.toString()
              : hour
            : Math.abs(12 - hour) < 10
            ? '0' + Math.abs(12 - hour).toString()
            : Math.abs(12 - hour) < 10
        }` +
        ':' +
        `${minutes < 10 ? '0' + minutes.toString() : minutes}` +
        ' ' +
        `${hour < 12 ? 'AM' : 'PM'}`
      );
    }
  } else return '';
};

export const getStartAndEndDateCurrentWeek = (
  today: Date,
  returnType?: 'string' | 'number',
) => {
  let firstDay = today.getDate() + (1 - today.getDay());
  let firstDate = new Date(new Date(today).setDate(firstDay))
    .toISOString()
    .slice(0, 10);
  let lastDay = today.getDate() + (6 - today.getDay());
  let lastDate = new Date(new Date(today).setDate(lastDay))
    .toISOString()
    .slice(0, 10);
  // for (let i = 1; i <= 6; i++) {
  //   let first = today.getDate() - today.getDay() + i;
  //   let day = new Date(today.setDate(first)).toISOString().slice(0, 10);
  //   week.push(day);
  // }

  if (!returnType || returnType === 'string')
    return {start: firstDate, end: lastDate} as {
      start: string;
      end: string;
    };
  else
    return {
      start: new Date(firstDate).getDate(),
      end: new Date(lastDate).getDate(),
    };
};

export const convertWeekDaysValueToText = (
  weekDateValue: number,
  returnType: 'full' | 'acronym',
) => {
  switch (weekDateValue) {
    case 0:
      return returnType === 'full' ? 'Sunday' : 'S';
    case 1:
      return returnType === 'full' ? 'Monday' : 'M';
    case 2:
      return returnType === 'full' ? 'Tuesday' : 'T';
    case 3:
      return returnType === 'full' ? 'Wednesday' : 'W';
    case 4:
      return returnType === 'full' ? 'Thursday' : 'T';
    case 5:
      return returnType === 'full' ? 'Friday' : 'F';
    case 6:
      return returnType === 'full' ? 'Saturday' : 'S';
  }
};
export const getWeekDaysName = (
  weekDateValue: number,
  numOfWeekNameChar: number,
) => {
  let weekDateName: string = '';
  switch (weekDateValue) {
    case 0:
      weekDateName = 'Sunday';
      break;
    case 1:
      weekDateName = 'Monday';
      break;
    case 2:
      weekDateName = 'Tuesday';
      break;
    case 3:
      weekDateName = 'Wednesday';
      break;
    case 4:
      weekDateName = 'Thursday';
      break;
    case 5:
      weekDateName = 'Friday';
      break;
    case 6:
      weekDateName = 'Saturday';
      break;
  }

  return numOfWeekNameChar <= weekDateName.length
    ? weekDateName.substring(0, numOfWeekNameChar)
    : weekDateName;
};
export const convertMonthValueToText = (
  monthValue: number,
  numOfMonthChar: number,
) => {
  let monthName: string = '';
  switch (monthValue) {
    case 0:
      monthName = 'January';
      break;
    case 1:
      monthName = 'February';
      break;
    case 2:
      monthName = 'March';
      break;
    case 3:
      monthName = 'April';
      break;
    case 4:
      monthName = 'May';
      break;
    case 5:
      monthName = 'June';
      break;
    case 6:
      monthName = 'July';
      break;
    case 7:
      monthName = 'August';
      break;
    case 8:
      monthName = 'September';
      break;
    case 9:
      monthName = 'October';
      break;
    case 10:
      monthName = 'November';
      break;
    case 11:
      monthName = 'December';
      break;
    default:
      monthName = 'January';
  }
  return numOfMonthChar <= monthName.length
    ? monthName.substring(0, numOfMonthChar)
    : monthName;
};
export const checkEqualDateWithoutTime = (
  date1: Date,
  date2: Date,
): boolean => {
  let date1Day: number = date1.getDate();
  let date1Month: number = date1.getMonth();
  let date1Year: number = date1.getFullYear();

  let date2Day: number = date2.getDate();
  let date2Month: number = date2.getMonth();
  let date2Year: number = date2.getFullYear();
  if (
    date1Day === date2Day &&
    date1Month === date2Month &&
    date1Year === date2Year
  )
    return true;
  else return false;
};

//this function get all days before and after a date is passed with the number of before and after which is the number of days from the passed date
//For example: date passed: "2023-02-14", before range: 7 , after range :7, we should have the array containing al;l days from "2023-02-06" - "2023-02-22"
interface IBeforeAndAfterDateFunctionProps {
  initialDate: Date;
  beforeRange: number;
  afterRange: number;
}
export const getAllDaysBeforeAndAfterDate = ({
  initialDate,
  beforeRange,
  afterRange,
}: IBeforeAndAfterDateFunctionProps): IDateInfo[] => {
  const currentDayInTime: number = initialDate.getTime();
  let dateRange: IDateInfo[] = [];
  let oneDayInMilliSecs: number = 1000 * 60 * 60 * 24;
  for (let i = -beforeRange; i <= afterRange; i++) {
    const date: Date = new Date(currentDayInTime + oneDayInMilliSecs * i);
    dateRange.push({
      fullDay: date,
      dayValue: date.getDate(),
      dateInWeek: convertWeekDaysValueToText(
        date.getDay(),
        'acronym',
      ) as TWeekDayAcronym,
      monthValue: date.getMonth(),
    });
  }
  return dateRange;
};

export type TWeekDayAcronym = 'M' | 'T' | 'W' | 'T' | 'F' | 'S';
export interface IDateInfo {
  fullDay: Date;
  dayValue: number;
  dateInWeek: TWeekDayAcronym;
  monthValue?: number;
}

export const getAllWeekDaysOfDate = (dateValue: Date): IDateInfo[] => {
  let weekDays: IDateInfo[] = [];
  let currentDate = dateValue;
  let dayOfWeek = currentDate.getDay();
  let start = new Date(currentDate.setDate(currentDate.getDate() - dayOfWeek));
  for (let i = 0; i < 7; i++) {
    let nextDay = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + i,
    );
    if (nextDay.getDay() !== 0) {
      weekDays.push({
        fullDay: nextDay,
        dayValue: nextDay.getDate(),
        dateInWeek: convertWeekDaysValueToText(
          nextDay.getDay(),
          'acronym',
        ) as TWeekDayAcronym,
      });
    }
  }

  return weekDays;
};

export const getRandomDateWithRange = (
  startDate: Date,
  endDate: Date,
): string => {
  let startTimestamp = startDate.getTime();
  let endTimestamp = endDate.getTime();
  let randomTimestamp =
    Math.floor(Math.random() * (endTimestamp - startTimestamp + 1)) +
    startTimestamp;

  let randomDate: Date = new Date(randomTimestamp);
  return formatDate(randomDate, 'yyyy-MM-dd');
};

export interface IMonthInfo {
  monthValue: number;
  yearValue: number;
  monthName: TMonthName;
  monthAcronym: TMonthAcronym;
}

export const getAllMonthInRange = (
  startDate: Date,
  endDate: Date,
): IMonthInfo[] => {
  let months: IMonthInfo[] = [];
  let currentDate: Date = new Date(startDate);
  while (currentDate.getMonth() <= endDate.getMonth()) {
    months.push({
      monthValue: currentDate.getMonth(),
      yearValue: currentDate.getFullYear(),
      monthName: getMonthName(currentDate.getMonth(), 'full') as TMonthName,
      monthAcronym: getMonthName(
        currentDate.getMonth(),
        'acronym',
      ) as TMonthAcronym,
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  return months;
};

type TMonthName =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

type TMonthAcronym =
  | 'Jan'
  | 'Feb'
  | 'Mar'
  | 'Apr'
  | 'May'
  | 'Jun'
  | 'Jul'
  | 'Aug'
  | 'Sep'
  | 'Oct'
  | 'Nov'
  | 'Dec';
export const getMonthName = (
  monthValue: number,
  returnType: 'full' | 'acronym',
): TMonthName | TMonthAcronym | 'invalid' => {
  switch (monthValue) {
    case 0:
      return returnType === 'full'
        ? ('January' as TMonthName)
        : ('Jan' as TMonthAcronym);
    case 1:
      return returnType === 'full'
        ? ('February' as TMonthName)
        : ('Feb' as TMonthAcronym);
    case 2:
      return returnType === 'full'
        ? ('March' as TMonthName)
        : ('Mar' as TMonthAcronym);
    case 3:
      return returnType === 'full'
        ? ('April' as TMonthName)
        : ('Apr' as TMonthAcronym);
    case 4:
      return returnType === 'full'
        ? ('May' as TMonthName)
        : ('May' as TMonthAcronym);
    case 5:
      return returnType === 'full'
        ? ('June' as TMonthName)
        : ('Jun' as TMonthAcronym);
    case 6:
      return returnType === 'full'
        ? ('July' as TMonthName)
        : ('Jul' as TMonthAcronym);
    case 7:
      return returnType === 'full'
        ? ('August' as TMonthName)
        : ('Aug' as TMonthAcronym);
    case 8:
      return returnType === 'full'
        ? ('September' as TMonthName)
        : ('Sep' as TMonthAcronym);
    case 9:
      return returnType === 'full'
        ? ('October' as TMonthName)
        : ('Oct' as TMonthAcronym);
    case 10:
      return returnType === 'full'
        ? ('November' as TMonthName)
        : ('Nov' as TMonthAcronym);
    case 11:
      return returnType === 'full'
        ? ('December' as TMonthName)
        : ('Dec' as TMonthAcronym);
    default:
      return 'invalid';
  }
};

export const checkEqualMonthWithoutDate = (
  date1: Date,
  date2: Date,
): boolean => {
  let date1Month: number = date1.getMonth();
  let date1Year: number = date1.getFullYear();

  let date2Month: number = date2.getMonth();
  let date2Year: number = date2.getFullYear();

  // console.log("MONTH 1:", date1Month);
  // console.log("YEAR1:", date1Year);

  // console.log("MONTH 2:", date2Month);
  // console.log("YEAR2:", date2Year);
  if (date1Month === date2Month && date1Year === date2Year) return true;
  else return false;
};

export type TWeekDate =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export const formatter: Intl.NumberFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatTDateISO = (date: string | Date): TISODateTime => {
  const convertedDate: Date = typeof date === 'string' ? new Date(date) : date;
  return convertedDate.toISOString() as TISODateTime;
};

export const formatTDateISODate = (date: string | Date): TDateISODate => {
  const convertedDate: Date = typeof date === 'string' ? new Date(date) : date;
  const day = convertedDate.getDate();
  const month = convertedDate.getMonth() + 1;
  const year = convertedDate.getFullYear();
  return `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}` as TDateISODate;
};
export type TRgbaAlpha = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type TRgbaFormat = `rgba(${number},${number},${number},${number})`;
interface IEditRgbaAlphaProp {
  rgbaColor: TRgbaFormat;
  alpha:
    | `0.${TRgbaAlpha}`
    | '1'
    | '0'
    | `0.${TRgbaAlpha}${TRgbaAlpha}`
    | `0.0${TRgbaAlpha}`; //!0=>1 only
}
export const editRgbaAlpha = ({
  rgbaColor,
  alpha,
}: IEditRgbaAlphaProp): TRgbaFormat | string => {
  const alphaToPercentage = 100 * parseFloat(alpha);
  if (rgbaColor.toLowerCase().includes('rgba')) {
    const alphaPos: number = rgbaColor.lastIndexOf(',') + 1; // the alpha part will start from the last ","
    const originalExtractedAlpha = rgbaColor.substring(
      alphaPos,
      rgbaColor.length - 1,
    );

    const returnedRgbaColor = rgbaColor.substring(0, alphaPos) + alpha + ')';

    return returnedRgbaColor as TRgbaFormat;
  } else return `${rgbaColor}${alphaToPercentage}`;
};

export const getFontSizeScale = (size: number): number => {
  const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

  const scale = SCREEN_WIDTH > 800 ? 800 / 458 : SCREEN_WIDTH / 458; //ip 13 promax
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

export const checkPhoneValid = (value: string) => {
  const numberRegex =
    /^(\+?\(61\)|\(\+?61\)|\+?61|\(0[1-9]\)|0[1-9])?( ?-?[0-9]){7,9}$/m;

  return numberRegex.test(value);
};
export const checkEmailValid = (value: string) => {
  const emailRegex = /.+\@.+\..+/;

  return emailRegex.test(value);
};
export const checkValidABN = (value: string) => {
  if (value === '') return true;
  const intABN: number = parseInt(value.replaceAll(' ', ''));
  return !isNaN(intABN) && intABN > 1000000000 && intABN < 100000000000;
};
export const toNum = (value: string | number | undefined | null) => {
  if (!value) return 0;
  if (typeof value === 'string')
    return !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
  return value;
};

export const calculateFlatlistItemWidth = (
  containerWidth: number,
  numOfCol: number,
  margin: number,
  border: number,
): number => {
  const totalMarginAndBorder = margin * 2 * numOfCol + border * 2 * numOfCol;
  return (containerWidth - totalMarginAndBorder) / numOfCol;
};

export function removeFalsyProps<T extends object>(obj: T): T {
  // Creating a new object to avoid mutating the original one
  const newObject = {...obj};

  // Iterate over keys and remove falsy values except for false booleans and all numbers
  Object.keys(newObject).forEach(key => {
    const value = newObject[key as keyof T];
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      delete newObject[key as keyof T];
    }
  });

  return newObject;
}

//*check if a path exist
export const checkPathExist = async (path: string) => {
  try {
    const resultCheck = await RNFS.exists(path);
    return resultCheck;
  } catch (error) {
    console.error('FAILED in checkPathExist:', error);
    return false;
  }
};
export const createLocalFolder = async (dirPath: string) => {
  try {
    await RNFS.mkdir(dirPath, {
      NSURLIsExcludedFromBackupKey: Platform.OS === 'ios' ? false : undefined,
    });
    console.log('CREATED PATH:', dirPath);
    return true;
  } catch (error) {
    console.error('FAILED in createFolder:', error);
    return false;
  }
};
//*delete a file or folder with path
export const deleteFileSystemWithPath = async (filePath: string) => {
  try {
    if (await checkPathExist(filePath)) {
      const deleteResult = await RNFS.unlink(filePath);
    }
    console.log('DELETED PATH:', filePath);
    return true;
  } catch (error) {
    console.log('FAILED deleteFileSystemWithPath:', error);
    return false;
  }
};
export function convertToRGBA(input: string, alpha = 1): TRgbaFormat {
  let r = 0,
    g = 0,
    b = 0;

  // Check if input is in hex format
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(input)) {
    let hex = input.substring(1);
    if (hex.length == 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  }
  // Check if input is in rgb format
  else if (/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.test(input)) {
    const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(input);
    if (result !== null) {
      r = parseInt(result[1]);
      g = parseInt(result[2]);
      b = parseInt(result[3]);
    } else {
      throw new Error('Invalid RGB input');
    }
  } else {
    throw new Error('Invalid color input');
  }

  return `rgba(${r},${g},${b},${alpha})` as TRgbaFormat;
}

export const formatToTMonthDate = (date: Date | string): TMonthDate => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1; // JavaScript months are 0-indexed
  return `${year}-${month.toString().padStart(2, '0')}` as TMonthDate;
};

export const getUniqueMonths = (week: Date[]): TMonthDate[] => {
  const months = week.map(date => ({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  }));

  const uniqueMonths: TMonthDate[] = [];
  const seenMonths = new Set();

  for (const month of months) {
    const serializedMonth = JSON.stringify(month);
    if (!seenMonths.has(serializedMonth)) {
      seenMonths.add(serializedMonth);
      uniqueMonths.push(
        `${month.year}-${month.month
          .toString()
          .padStart(2, '0')}` as TMonthDate,
      );
    }
  }

  return uniqueMonths;
};

interface IGetMonthRangeBeforeAfter {
  previousMonth: TMonthDate;
  currentMonth: TMonthDate;
  nextMonth: TMonthDate;
}
export const get1MonthBeforeAndAfter = (
  currentWeek: Date[],
): IGetMonthRangeBeforeAfter => {
  const currentMonth = currentWeek[0].getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = currentWeek[0].getFullYear();

  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

  return {
    currentMonth: `${currentMonth
      .toString()
      .padStart(2, '0')}-${currentYear}` as TMonthDate,
    previousMonth: `${previousMonth
      .toString()
      .padStart(2, '0')}-${previousYear}` as TMonthDate,
    nextMonth: `${nextMonth
      .toString()
      .padStart(2, '0')}-${nextYear}` as TMonthDate,
  };
};

export const normalizeDate = (date: Date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};

type RGBAColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export function extractRGBAValue(
  rgbaColor: TRgbaFormat,
  defaultColor: RGBAColor = {r: 0, g: 0, b: 0, a: 1},
): RGBAColor {
  try {
    const values = rgbaColor
      .replace('rgba', '')
      .replace('(', '')
      .replace(')', '')
      .split(',');
    if (values.length !== 4) throw new Error('Invalid RGBA format');

    const [r, g, b] = values.slice(0, 3).map(v => {
      const val = parseInt(v.trim(), 10);
      if (isNaN(val)) throw new Error('Invalid RGB values');
      return val;
    });

    const a = parseFloat(values[3].trim());
    if (isNaN(a)) throw new Error('Invalid alpha value');

    return {r, g, b, a};
  } catch (error) {
    console.error(`Error parsing rgba color: ${error}`);
    return defaultColor;
  }
}
export function areColorsSimilar(
  color1: TRgbaFormat,
  color2: TRgbaFormat,
  tolerance: number = 10,
): boolean {
  const color1Val = extractRGBAValue(color1);
  const color2Val = extractRGBAValue(color2);
  const colorDiff = (colorComponent1: number, colorComponent2: number) =>
    Math.abs(colorComponent1 - colorComponent2);

  return (
    colorDiff(color1Val.r, color2Val.r) <= tolerance &&
    colorDiff(color1Val.g, color2Val.g) <= tolerance &&
    colorDiff(color1Val.b, color2Val.b) <= tolerance &&
    colorDiff(color1Val.a, color2Val.a) <= tolerance / 255 // Assuming tolerance for alpha is scaled similarly
  );
}

export function getExtensionFromMimeType(mimeType: string): string {
  const mimeTypes: {[key: string]: string} = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'docx',
    'application/vnd.ms-excel': 'xls',
    'text/csv': 'csv',
    'application/pdf': 'pdf',
    'video/mp4': 'mp4',
    'video/mpeg': '.mpeg',
    'video/x-msvideo': 'avi',
    'text/plain': 'txt',
    // Add more MIME types and their corresponding extensions as needed
  };

  return mimeTypes[mimeType] || 'unknown';
}

export function replaceExtension(
  fileName: string,
  newExtension: string,
): string {
  // Get the base file name without extension
  const baseFileName = fileName.split('.').slice(0, -1).join('.');

  // Replace the extension with the new extension
  const newFileName = baseFileName + '.' + newExtension;

  return newFileName;
}
