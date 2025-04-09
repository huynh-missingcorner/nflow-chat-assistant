import { SidebarRail } from "@/components/ui/sidebar";
import { useUIStore } from "@/stores/useUIStore";

export function CustomSidebarRail() {
  const { toggleSidebar } = useUIStore();

  return <SidebarRail onClick={() => toggleSidebar()} />;
}
