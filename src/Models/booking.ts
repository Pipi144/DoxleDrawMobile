import {TRgbaFormat} from '../Utilities/FunctionUtilities';
import {TDateISODate, TISODateTime} from './dateFormat';
import {IntRange} from './utilityType';

export interface IBooking {
  readonly bookingId: string;
  title: string;
  readonly created: TDateISODate;
  percentageCompleted: IntRange<0, 101>;
  startDate: TDateISODate | null;
  endDate: TDateISODate | null;
  commenced: TISODateTime | null;
  completed: TISODateTime | null;
  color: TRgbaFormat | null;
  readonly emailed?: TISODateTime;
  confirmed?: boolean;
  readonly assignedContactName?: string;
  readonly assignedContractorName?: string;
  readonly createdByName: string;
  readonly docketIdNum: string;
  readonly docketIdStr: string;
  readonly docketName: string;
  readonly orderNumber: string;
  readonly orderDescription: string;
  assignedContact?: string | null;
  assignedContractor?: string | null;
  order?: string | null;
  readonly createdBy?: string | null;
  docket?: string | null;
  readonly project?: string | null;
  readonly company: string;

  //* props only in front end to handle add new effect
  isNew?: boolean;
}
