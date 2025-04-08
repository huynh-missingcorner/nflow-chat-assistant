import { CustomSidebarTrigger } from "./custom-sidebar-trigger";
import { ThemeToggle } from "./theme-toggle";

export const Header = () => {
  return (
    <>
      <header className="flex items-center justify-between px-2 sm:px-4 py-2 bg-background text-black dark:text-white w-full">
        <div className="flex">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <CustomSidebarTrigger />
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
};
