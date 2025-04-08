import { CustomSidebarTrigger } from "./custom-sidebar-trigger";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface HeaderProps {
  onTogglePreview?: () => void;
  isPreviewOpen?: boolean;
}

export function Header({ onTogglePreview, isPreviewOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <CustomSidebarTrigger />
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <ThemeToggle />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onTogglePreview && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onTogglePreview}
            className={isPreviewOpen ? "text-primary" : ""}
          >
            <ExternalLink className="size-4" />
            <span className="sr-only">Toggle Preview</span>
          </Button>
        )}
      </div>
    </header>
  );
}
