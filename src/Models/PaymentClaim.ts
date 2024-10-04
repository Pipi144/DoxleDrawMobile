import {TDateISODate, TISODateTime} from './dateFormat';
import {Order, OrderXero} from './orders';
import {User} from './user';

export interface PaymentClaimAttachment {
  attachmentId: string;
  paymentClaim?: string;
  backCharge?: string | null;
  url: string;
  name: string;
  size: number;
}

export default interface PaymentClaim {
  paymentId: string;
  invoiceNumber: string;

  submittedBy: string;
  submittedByJson: User;
  submittedOn: TISODateTime;

  approved: boolean | null;
  approvedBy: string | null;
  approvedByJson: User | null;
  approvedOn: TISODateTime | null;

  readonly supplierName: string;
  readonly orderDescription: string;
  readonly filteredSubTotal: string;

  status: string;
  subTotal: string | number;
  tax: string | number;
  total: string | number;
  totalPayments: string | number;
  totalBackCharges: string | number;
  totalDue: string | number;
  date: TDateISODate;
  dueDate: TDateISODate;
  plannedPaymentDate: TDateISODate | null;

  accountingInvoiceId: string | null;
  order: string | null;
  orderJson?: Order | null;
  docket: string | null;
  project: string | null;
  company: string;

  source?: string;

  attachments?: PaymentClaimAttachment[];
  note?: string;
}
export interface PaymentClaimDetail {
  paymentClaim: PaymentClaim;
  order: OrderXero | null;
  uniqueInvoiceNumber: boolean;
}
type PaymentClaimHeaders =
  | 'ICON'
  | 'INVOICE NUMBER'
  | 'ORDER NUMBER'
  | 'DESCRIPTION'
  | 'CLAIM AMOUNT'
  | 'AMOUNT PAID';
// | 'PROGRESS (%)';
interface PaymentClaimListHeader {
  headerName: PaymentClaimHeaders;
  display: boolean;
}
export const PAYMENT_CLAIM_TABLE_HEADER_LIST: PaymentClaimListHeader[] = [
  {
    headerName: 'ICON',
    display: true,
  },
  {
    headerName: 'INVOICE NUMBER',
    display: true,
  },
  {
    headerName: 'ORDER NUMBER',
    display: true,
  },
  {
    headerName: 'DESCRIPTION',
    display: true,
  },
  {
    headerName: 'CLAIM AMOUNT',
    display: true,
  },
  {
    headerName: 'AMOUNT PAID',
    display: true,
  },
  // {
  //   headerName: 'PROGRESS (%)',
  //   display: false,
  // },
];

export interface PaymentClaimBackCharge {
  backChargeId: string;
  supplierName: string;
  reference: string;
  date: TDateISODate;
  description: string;
  total: string | number;
  payment: string;
  contactCompany?: string;
  company?: string;
  attachments?: PaymentClaimAttachment[];
}
