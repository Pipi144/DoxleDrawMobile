import {isEmpty} from 'lodash';
import {BaseAPIProps} from '../Models/basedAPIProps';
import {
  IFilterGetFloorListQuery,
  IFilterGetRoomListQuery,
  IProjectFloor,
  IProjectRoom,
} from '../Models/location';
import {baseAddress} from './settings';
import {useInfiniteQuery} from '@tanstack/react-query';
import axios from 'axios';
import {AxiosInfiniteReturn} from '../Models/axiosReturn';
import {removeFalsyProps} from '../Utilities/FunctionUtilities';
import {Company} from '../Models/company';

interface IRetrieveRoomListQueryProps extends BaseAPIProps {
  filter: IFilterGetRoomListQuery;
  enableQuery?: boolean;
}
const useRetrieveRoomList = ({
  accessToken,
  company,
  showNotification,
  filter,
  onErrorCb,
  enableQuery,
}: IRetrieveRoomListQueryProps) => {
  const qKey = formRoomListQKey(filter, company);

  let url = `${baseAddress}/loc/room/?page=1`;
  const docketQuery = useInfiniteQuery({
    queryKey: qKey,
    initialPageParam: url,
    queryFn: async ({pageParam}) => {
      try {
        const resp = await axios.get<AxiosInfiniteReturn<IProjectRoom>>(
          pageParam,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'User-Company': company!.companyId,
            },
            params: removeFalsyProps(filter),
          },
        );

        if (resp) {
          return resp;
        } else throw new Error('No data');
      } catch (error) {
        console.log('error in useRetrieveRoomList', error);
        if (onErrorCb) onErrorCb();
        throw error;
      }
    },
    enabled:
      company !== undefined &&
      accessToken !== undefined &&
      (enableQuery ?? true),

    retry: 1,
    refetchInterval: 4 * 60 * 1000,
    staleTime: 6 * 60 * 1000,
    gcTime: 8 * 60 * 1000,
    refetchOnMount: true,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,

    getNextPageParam: (prevData, pages) => prevData.data.next,
  });
  return docketQuery;
};

interface IRetrieveFloorListQueryProps extends BaseAPIProps {
  filter: IFilterGetFloorListQuery;
  enableQuery?: boolean;
}
const useRetrieveFloorList = ({
  accessToken,
  company,
  showNotification,
  filter,
  onErrorCb,
  enableQuery,
}: IRetrieveFloorListQueryProps) => {
  const qKey = formFloorListQKey(filter, company);

  let url = `${baseAddress}/loc/floor/?page=1`;
  const docketQuery = useInfiniteQuery({
    queryKey: qKey,
    initialPageParam: url,
    queryFn: async ({pageParam}) => {
      try {
        const resp = await axios.get<AxiosInfiniteReturn<IProjectFloor>>(
          pageParam,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'User-Company': company!.companyId,
            },
            params: removeFalsyProps(filter),
          },
        );

        if (resp) {
          return resp;
        } else throw new Error('No data');
      } catch (error) {
        console.log('error in useRetrieveRoomList', error);
        if (onErrorCb) onErrorCb();
        throw error;
      }
    },
    enabled:
      company !== undefined &&
      accessToken !== undefined &&
      (enableQuery ?? true),

    retry: 1,
    refetchInterval: 4 * 60 * 1000,
    staleTime: 6 * 60 * 1000,
    gcTime: 8 * 60 * 1000,
    refetchOnMount: true,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,

    getNextPageParam: (prevData, pages) => prevData.data.next,
  });
  return docketQuery;
};
//# HELPER FUNCTION
//* ROOM
export const baseRoomListQKey = ['room-list'];
export const formRoomListQKey = (
  filter: IFilterGetRoomListQuery,
  company: Company | undefined,
) => {
  const baseQKey = [...baseRoomListQKey];
  if (company) baseQKey.push(company.companyId);
  Object.entries(filter).forEach(([key, value]) => {
    if (!isEmpty(value)) baseQKey.push(`${key}:${value}`);
  });
  return baseQKey;
};

//* FLOOR
export const baseFloorListQKey = ['floor-list'];
export const formFloorListQKey = (
  filter: IFilterGetFloorListQuery,
  company: Company | undefined,
) => {
  const baseQKey = [...baseFloorListQKey];
  if (company) baseQKey.push(company.companyId);
  Object.entries(filter).forEach(([key, value]) => {
    if (!isEmpty(value)) baseQKey.push(`${key}:${value}`);
  });
  return baseQKey;
};
const LocationAPI = {
  useRetrieveRoomList,
  useRetrieveFloorList,
};

export default LocationAPI;
