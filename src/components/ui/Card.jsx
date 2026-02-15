import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ className, children }) => (
  <div className={cn('bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden', className)}>
    {children}
  </div>
);

export const CardHeader = ({ className, children }) => (
  <div className={cn('px-6 py-4 border-b border-gray-200', className)}>{children}</div>
);

export const CardContent = ({ className, children }) => (
  <div className={cn('p-6', className)}>{children}</div>
);
