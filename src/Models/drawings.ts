export interface DrawingSet {
  /* Drawing Set is a collection of sheets with a label */
  readonly setId: string;
  name: string; //EG.  "WORKING DRAWINGS" || "STRUCTURAL DRAWINGS"
  sheets: Sheet[];
  readonly history: DrawingHistory[];
  url?: string;
}

export interface Sheet {
  /* A Sheet is one page of a drawing set or plans as an image - the image will be used as a background canvas */
  sheetId?: string;
  index: number; // integer for ordering of sheets within drawing set
  title: string; // EG "S001" || "SITE PLAN" || "WD004 - GROUND FLOOR PLAN"
  height: string; // Integer (pixels)
  width: string; // Integer (pixels)
  scale: string; // floating point number - ratio pixels/mm
  url: string;
  imageUrl: string;
  thumbUrl: string;
  pdfUrl: string;
  readonly drawingSet: string;
  project?: string; // Project Id that the project belongs to - required in the backend but may not be sent with get requests
  readonly history: DrawingHistory[];
}

export interface DrawingHistory {
  readonly id: string;
  type: string;
  timeStamp: string;
  userName: string;
  user: string;
  sheet: string | null;
  drawing_set: string | null;
  project: string;
  company: string;
}
