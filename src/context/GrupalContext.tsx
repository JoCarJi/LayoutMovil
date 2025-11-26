import type { SolpedBatchItem } from "@/types/solped";
import React, {
    createContext,
    ReactNode,
    useContext,
    useState,
} from "react";

interface GrupalContextType {
  items: SolpedBatchItem[];
  setItems: (items: SolpedBatchItem[]) => void;
  updateItem: (id: string, patch: Partial<SolpedBatchItem>) => void;
  removeItem: (id: string) => void;
  reset: () => void;
}

const GrupalContext = createContext<GrupalContextType | undefined>(
  undefined
);

export const useGrupal = (): GrupalContextType => {
  const ctx = useContext(GrupalContext);
  if (!ctx) {
    throw new Error("useGrupal debe usarse dentro de GrupalProvider");
  }
  return ctx;
};

export const GrupalProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItemsState] = useState<SolpedBatchItem[]>([]);

  const setItems = (newItems: SolpedBatchItem[]) => {
    setItemsState(newItems);
  };

  const updateItem = (id: string, patch: Partial<SolpedBatchItem>) => {
    setItemsState((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );
  };

  const removeItem = (id: string) => {
    setItemsState((prev) => prev.filter((it) => it.id !== id));
  };

  const reset = () => setItemsState([]);

  return (
    <GrupalContext.Provider
      value={{ items, setItems, updateItem, removeItem, reset }}
    >
      {children}
    </GrupalContext.Provider>
  );
};
