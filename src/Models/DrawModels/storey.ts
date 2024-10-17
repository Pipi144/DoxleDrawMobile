import {TISODateTime} from '../dateFormat.ts';
import {IBackground} from './Backgrounds.ts';
import {ElectricalItem} from './Electrical.ts';
import {FlooringItem} from './Flooring.ts';
import {OpeningItem} from './Openings.ts';
import {PlumbingItem} from './Plumbing.ts';
import {INewWall} from './Walls.ts';

export interface IStorey {
  storeyId: string;
  storeyName: string;
  floor: number;
  createdOn: TISODateTime;
  projectId: string;
  backgrounds?: IBackground[];
}
export interface INewStorey {
  storeyId?: string;
  storeyName?: string;
  plan_group_name?: string;
  floor?: number;
  floors?: FlooringItem[];
  walls?: INewWall[];
  openings?: OpeningItem[];
  plumbing?: PlumbingItem[];
  electrical?: ElectricalItem[];
  projectId: string;
}
