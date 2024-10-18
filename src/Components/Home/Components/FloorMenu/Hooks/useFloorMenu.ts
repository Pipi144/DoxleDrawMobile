// Copyright 2024 selvinkamal
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {useEffect, useMemo} from 'react';
import {useRetrieveStoreys} from '../../../../../API/PlanQueryHooks';
import {useCompany} from '../../../../../Providers/CompanyProvider';
import {useKonvaStore} from '../../../Stores/useKonvaStore';
import {useShallow} from 'zustand/shallow';

const useFloorMenu = () => {
  const {selectedProject} = useCompany();
  const setCurrentStorey = useKonvaStore(
    useShallow(state => state.setCurrentStorey),
  );
  const storeyQuery = useRetrieveStoreys(
    '23a49ae9-34ce-4c37-b66c-373cf080d057',
  );
  const storeyList = useMemo(
    () =>
      storeyQuery.isSuccess
        ? storeyQuery.data.pages.flatMap(page => page?.data.results ?? [])
        : [],
    [storeyQuery.data],
  );
  useEffect(() => {
    setCurrentStorey(storeyList[0] ?? undefined);
  }, [storeyList]);

  return {
    storeyList,
    isFetchingStoreys: storeyQuery.isFetching,
    isFetchingError: storeyQuery.isError,
  };
};

export default useFloorMenu;
