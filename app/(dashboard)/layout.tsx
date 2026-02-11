import { AppSidebar } from '@/components/layout/app-sidebar';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { RealTimeEventsProvider } from '@/components/providers/real-time-events-provider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ConnectionStatus } from '@/components/layout/connection-status';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RealTimeEventsProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <ConnectionStatus />
          <DashboardHeader />
          <main className="flex-1 overflow-auto bg-gray-50/30 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RealTimeEventsProvider>
  );
}
