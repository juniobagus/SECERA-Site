import type { ReactNode } from 'react';

interface AdminDataTableProps {
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function AdminDataTable({ toolbar, children, className = '' }: AdminDataTableProps) {
  return (
    <section className={`flex flex-1 flex-col overflow-hidden border border-gray-200 bg-white ${className}`}>
      {toolbar && <div className="border-b border-gray-200 bg-gray-50/50 p-4">{toolbar}</div>}
      <div className="flex-1 overflow-auto">{children}</div>
    </section>
  );
}
