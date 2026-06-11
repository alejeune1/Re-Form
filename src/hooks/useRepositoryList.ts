import { useCallback, useEffect, useState } from 'react';
import type { RepositoryResult } from '../services/reformRepository';

type RepositoryListState<T> = {
  items: T[];
  source: RepositoryResult<T>['source'];
  isLoading: boolean;
  error: string | null;
};

export function useRepositoryList<T>(loader: () => Promise<RepositoryResult<T>>, initialItems: T[]) {
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<RepositoryListState<T>>({
    items: initialItems,
    source: 'mock',
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    loader()
      .then((result) => {
        if (!isActive) {
          return;
        }

        setState({
          items: result.items,
          source: result.source,
          isLoading: false,
          error: result.error ?? null,
        });
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return;
        }

        setState({
          items: initialItems,
          source: 'mock',
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unable to load data',
        });
      });

    return () => {
      isActive = false;
    };
  }, [initialItems, loader, reloadKey]);

  const reload = useCallback(() => {
    setReloadKey((current) => current + 1);
  }, []);

  return { ...state, reload };
}
