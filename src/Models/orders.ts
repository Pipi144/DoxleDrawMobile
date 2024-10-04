import {ContactCompany} from './contacts';
import {TDateISODate, TISODateTime} from './dateFormat';
import {User} from './user';

export type PaymentTermsSuffix = 'Days' | 'NET' | 'EOM';
export type DamagesPeriod = 'Day' | 'Month' | 'Week';
export type OrderStatus = {
  readonly statusId: string;
  company: string;
  statusName: string;
  color: string;
  index: number;

  isInvoiceStatus: boolean;
  isOrderStatus: boolean;
};

export interface OrderLine {
  orderLineId: string; // UUID
  order?: string; // UUID of order to which it belongs
  index: number;
  description: string;
  itemCost: string | number;
  itemFormula?: string;
  quantity: string | number;
  quantityFormula?: string;
  lineCost: string | number;
  ticked?: boolean;
  unit: string;
  estimate?: string | null;
  pricebook?: string | null;
  company?: string;
}

export interface OrderHistory {
  orderHistoryId: string; // UUID
  order?: string; // UUID of order to which it belongs
  index: number;
  shortText: string;
  longText: string;
  timeStamp: TISODateTime;
  user: null | User;
  project?: null | string;
  company?: string;
}

export interface Order {
  orderId: string;
  orderNumber: string;
  description: string;
  issueDate: TDateISODate;
  startDate: TDateISODate | null;
  endDate: TDateISODate | null;
  paymentTerms: number;
  paymentTermsSuffix: PaymentTermsSuffix;
  damages: string | number;
  damagesPeriod: DamagesPeriod;
  supplier: string; // Contact Company Name || entered name
  contactCompany: string | null; // UUID
  contactCompanyJson?: ContactCompany;
  accepted: boolean;
  subTotal: string | number;
  tax: string | number;
  total: string | number;
  specialConditions: string;
  signedOff: string | null; // UUID of User or null
  signedOffName: string;
  emailSent: boolean;
  approved: boolean;
  approvedBy: string | null; //UUID of User or Null
  emailAddresses: string;
  versionId: string;
  status: string;
  statusName: string;
  statusColor: `rgba(${number},${number},${number},${number})`;
  lines?: OrderLine[];
  history?: OrderHistory[];

  docket: string | null;
  core_docket: string | null;
  project: string | null;
  company: string | null;
  isInvoice: boolean;
}

interface XeroPaymentDetail {
  readonly PaymentID: string;
  Date: string;
  Amount: number;
  Reference: string;
  CurrencyRate: number;
  HasAccount: boolean;
  HasValidationErrors: boolean;
}
export interface XeroPaymentAttachment {
  AttachmentID: string;
  FileName: string;
  Url: string;
  MimeType: string;
  ContentLength: number;
}
export interface OrderXero extends Order {
  orderUrl?: string;
  versionId: string;
  hasPaymentClaim?: string;
  totalPendingPayments: string;
  totalApprovedPayments: string;
  totalPaymentsMade?: string;
  totalOutstanding?: string;
  payments: XeroPaymentDetail[];
  attachments: XeroPaymentAttachment[];
}
export type TOrderTableHeaders =
  | 'Order #'
  | 'Date'
  | 'Contractor'
  | 'Description'
  | 'Amount'
  | 'Payment Terms'
  | 'Status';

export type OrderOrderByFields =
  | 'order_number'
  | 'description'
  | 'issue_date'
  | 'supplier'
  | 'status'
  | 'sub_total'
  | 'payment_terms';

export type RevOrderOrderByFields = `-${OrderOrderByFields}`;

type OrderHeadersBackwardMapInterface = {
  [Property in TOrderTableHeaders]: OrderOrderByFields;
};

export const ORDER_HEADERS_MAP: OrderHeadersBackwardMapInterface = {
  'Order #': 'order_number',
  Date: 'issue_date',
  Description: 'description',
  Contractor: 'supplier',
  Amount: 'sub_total',
  'Payment Terms': 'payment_terms',
  Status: 'status',
};

export interface OrderFilters {
  is_invoice: boolean;

  search?: string;
  docket?: string;
  core_docket?: string;
  project?: string;
  end_date?: string;
  start_date?: string;
  issue_date?: string;
  signed_off?: string;
  signed_on?: boolean;
  contact_company?: string;
  status?: string;
  order_by?: OrderOrderByFields | RevOrderOrderByFields;
}

export interface OrderStatusFilters {
  is_order_status?: boolean;
  is_invoice_status?: boolean;
}

export const NEW_ORDER_LINE_TEMPLATE = (
  data: Partial<
    Pick<
      OrderLine,
      | 'itemCost'
      | 'unit'
      | 'estimate'
      | 'description'
      | 'quantity'
      | 'pricebook'
    >
  > &
    Required<Pick<OrderLine, 'company' | 'order'>>,
): OrderLine => {
  const itemCost = data.itemCost ? parseFloat(data.itemCost.toString()) : 0;
  const quantity = data.quantity ? parseFloat(data.quantity.toString()) : 0;
  return {
    orderLineId: '',
    order: data.order,
    index: 0,
    description: data.description || 'New Line',
    itemCost: itemCost,

    quantity: quantity,

    lineCost: quantity * itemCost,

    unit: data.unit || 'ea',
    estimate: data.estimate || null,
    pricebook: data.pricebook || null,
    company: data.company,
  };
};
