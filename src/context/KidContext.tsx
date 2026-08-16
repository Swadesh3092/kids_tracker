import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getAllKids, MAX_KIDS } from '../db/kid';
import { getActiveKidId, setActiveKidId as persistActiveKidId } from '../db/settings';
import { Kid } from '../types';

interface KidContextValue {
  kids: Kid[];
  activeKid: Kid | null;
  canAddMore: boolean;
  selectKid: (id: number) => void;
  refreshKids: () => Kid[];
}

const KidContext = createContext<KidContextValue | null>(null);

export function KidProvider({ children }: { children: React.ReactNode }) {
  const [kids, setKids] = useState<Kid[]>([]);
  const [activeKidId, setActiveKidIdState] = useState<number | null>(null);

  const refreshKids = useCallback(() => {
    const all = getAllKids();
    setKids(all);
    setActiveKidIdState((current) => {
      if (current !== null && all.some((k) => k.id === current)) return current;
      const stored = getActiveKidId();
      const fallback = all.find((k) => k.id === stored) ?? all[0];
      return fallback ? fallback.id : null;
    });
    return all;
  }, []);

  const selectKid = useCallback((id: number) => {
    setActiveKidIdState(id);
    persistActiveKidId(id);
  }, []);

  useEffect(() => {
    refreshKids();
  }, [refreshKids]);

  const activeKid = useMemo(() => kids.find((k) => k.id === activeKidId) ?? null, [kids, activeKidId]);

  const value = useMemo<KidContextValue>(
    () => ({
      kids,
      activeKid,
      canAddMore: kids.length < MAX_KIDS,
      selectKid,
      refreshKids,
    }),
    [kids, activeKid, selectKid, refreshKids]
  );

  return <KidContext.Provider value={value}>{children}</KidContext.Provider>;
}

export function useKids(): KidContextValue {
  const ctx = useContext(KidContext);
  if (!ctx) throw new Error('useKids must be used within a KidProvider');
  return ctx;
}
