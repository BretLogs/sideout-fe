import type { ReactNode } from "react";

type ContentColumnProps = {
  children: ReactNode;
  className?: string;
};

export function ContentColumn({ children, className = "" }: ContentColumnProps) {
  return (
    <div
      className={`mx-auto w-full max-w-content px-6 md:px-8 lg:px-10 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
