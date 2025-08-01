"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
  PanelLeftCloseIcon,
  PanelLeftIcon,
  SearchIcon,
} from "lucide-react";
import { DashboardCommand } from "./dashboard-command";
import { useEffect, useState } from "react";

export const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [CommandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <DashboardCommand open={CommandOpen} setOpen={setCommandOpen} />

      <nav className="h-[60px] w-full flex items-center justify-between border-b bg-white shadow-sm px-4 sm:px-6 pb-4 pt-4">
  {/* Left: Sidebar Toggle */}
  <div className="flex-shrink-0">
    <Button
      className="size-9"
      variant="outline"
      onClick={toggleSidebar}
    >
      {state === "collapsed" || isMobile ? (
        <PanelLeftIcon className="size-4" />
      ) : (
        <PanelLeftCloseIcon className="size-4" />
      )}
    </Button>
  </div>

  {/* Center: Search */}
  <div className="flex-grow flex justify-center">
    <Button
      className="h-9 w-full max-w-[480px] justify-start font-normal text-muted-foreground hover:text-muted-foreground"
      variant="outline"
      size="sm"
      onClick={() => setCommandOpen((open) => !open)}
    >
      <SearchIcon className="mr-2 size-4" />
      <span className="text-sm">Search</span>
      <kbd className="ml-auto pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        <span className="text-xs">&#8984;</span>K
      </kbd>
    </Button>
  </div>
</nav>

    </>
  );
};
