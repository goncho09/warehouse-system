'use client';

import { useState } from 'react';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
