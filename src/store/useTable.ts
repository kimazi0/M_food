import { create } from "zustand";

interface TableStore {
  tableNumber: number | null;
  setTableNumber: (tableNumber: number | null) => void;
  clearTableNumber: () => void;
}

export const useTable = create<TableStore>((set) => ({
  tableNumber: null,
  setTableNumber: (tableNumber) => set({ tableNumber }),
  clearTableNumber: () => set({ tableNumber: null }),
}));
