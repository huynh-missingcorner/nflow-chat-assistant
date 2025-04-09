import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  // State
  isPreviewOpen: boolean;
  isSidebarOpen: boolean;

  // Actions
  togglePreview: () => void;
  toggleSidebar: () => void;
  setPreviewOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      isPreviewOpen: false,
      isSidebarOpen: true,

      // Actions
      togglePreview: () =>
        set((state) => ({ isPreviewOpen: !state.isPreviewOpen })),
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setPreviewOpen: (open: boolean) => set({ isPreviewOpen: open }),
      setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),
    }),
    {
      name: "chat-ui-storage",
    }
  )
);
