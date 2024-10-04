type Coordinates = {
  coordinateId: string;
  longitude: number;
  latitude: number;
};
export interface Project {
  projectId: string;
  siteAddress: string;
  projectStatus: string;
  readonly projectStatusJson?: ProjectStatus;
  contractPrice: string;

  projectBudget: string;
  readonly totalOrders: string;
  readonly totalInvoices: string;
  readonly totalActuals: string;
  readonly totalRunning: string;
  readonly totalBudget: string;
  totalStorageSize?: number;
}

export interface IFullProject extends Project {
  contractDate: string;

  startDate: string;
  endDate: string;
  projectPrefix: string;
  company?: string;
  coordinates?: Coordinates;
  trackingId?: string | null;
  trackingName?: string | null;
  isBudget?: boolean;
  isNoticeboard?: boolean;

  readonly statusName: string;
  readonly statusColor: string;
  ownerName: string;
  ownerAbn: string;
  ownerPhone: string;
  ownerEmail: string;
  projectType?: string;
  contractName?: string;
}
export interface NewProject
  extends Partial<
      Omit<
        Project,
        'projectId' | 'projectPrefix' | 'coordinates' | 'siteAddress'
      >
    >,
    Pick<Project, 'siteAddress'> {}
export interface ProjectStatus {
  statusId: string;
  company: string;
  index: number;
  statusName: string;
}
