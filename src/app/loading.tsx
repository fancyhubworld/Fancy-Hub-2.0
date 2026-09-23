import React from "react";
import { LoadingSpinner } from "@/components/ui/StateFeedback";

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading FancyHub.in..." />
    </div>
  );
}
