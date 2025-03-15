import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={`animate-spin rounded-full border-b-2 border-indigo-500 ${sizeClasses[size]} ${className}`}
    />
  );
}

export function LoadingOverlay({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading: boolean;
}) {
  if (!loading) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center">
        <Spinner size="md" />
      </div>
    </div>
  );
}
