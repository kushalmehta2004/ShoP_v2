"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BackgroundComponentsProps = {
  children?: ReactNode;
  className?: string;
};

export const Component = ({ children, className }: BackgroundComponentsProps) => {
  return (
    <div className={cn("relative overflow-hidden bg-white", className)}>
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, #FFF991 0%, transparent 70%)
          `,
          opacity: 0.18,
          mixBlendMode: "multiply",
        }}
      />
      <div
        className="absolute inset-0 z-0 opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(229, 231, 235, 0.7) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229, 231, 235, 0.7) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.15))",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Component;
