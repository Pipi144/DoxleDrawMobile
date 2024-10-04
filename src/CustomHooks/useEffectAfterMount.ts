import {useEffect, useRef, EffectCallback, DependencyList} from 'react';

function useEffectAfterMount(effect: EffectCallback, deps?: DependencyList) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, deps);
}

export default useEffectAfterMount;
