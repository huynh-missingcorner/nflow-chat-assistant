import { SidebarTrigger } from "../ui/sidebar";
import { useUIStore } from "@/stores/useUIStore";

export function CustomSidebarTrigger() {
  const { toggleSidebar } = useUIStore();

  return (
    <SidebarTrigger className="h-10 w-12" onClick={() => toggleSidebar()} />
  );
}
