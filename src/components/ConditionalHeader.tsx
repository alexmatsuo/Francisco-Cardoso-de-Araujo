'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { AdminHeader } from './AdminHeader';

export const ConditionalHeader = () => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  
  return isAdminRoute ? <AdminHeader /> : <Header />;
};