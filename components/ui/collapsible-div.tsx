'use client';

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CollapsibleDivProps {
  children: React.ReactNode;
  className?: string;
  initialCollapsed?: boolean;
}

export function CollapsibleDiv({ 
  children, 
  className,
  initialCollapsed = false 
}: CollapsibleDivProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "max-h-[120px]" : "max-h-none",
        "overflow-hidden"
      )}>
        <div className={cn(
          "relative",
          isCollapsed && "mask-bottom"
        )}>
          {children}
        </div>
      </div>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-0 top-0 bottom-0 w-6 bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
        aria-label="Toggle content height"
      >
        {isCollapsed ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronUp className="h-4 w-4" />
        )}
      </button>
    </div>
  );
} 