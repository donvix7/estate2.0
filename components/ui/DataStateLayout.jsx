import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card } from './Card';
import { EmptyState } from './EmptyState';
import { Button } from './Button';

export function DataStateLayout({ 
  isLoading, 
  error, 
  onRetry, 
  emptyStateMessage = "No data available.",
  hasData,
  children 
}) {
  if (isLoading) {
    return (
      <Card className="p-16 flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 text-[#1241a1] animate-spin" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8a8f98]">Loading</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center text-center">
        <AlertCircle className="size-12 text-red-500 opacity-50 mb-4" />
        <h3 className="text-xl font-bold text-white text-white mb-2">Error Loading Data</h3>
        <p className="text-[#8a8f98] text-[#8a8f98] max-w-sm mb-6">{error}</p>
        {onRetry && (
          <Button variant="secondary" size="md" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </Card>
    );
  }

  if (!hasData) {
    return (
      <Card>
        <EmptyState
          icon={AlertCircle}
          title={emptyStateMessage}
        />
      </Card>
    );
  }

  return (
    <Card>
      {children}
    </Card>
  );
}
