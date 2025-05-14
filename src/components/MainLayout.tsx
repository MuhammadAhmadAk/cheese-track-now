
import { useState, ReactNode } from 'react';
import { SideNavigation } from '@/components/SideNavigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={cn(
          'fixed inset-y-0 left-0 z-20 flex-shrink-0 bg-white border-r border-gray-200 transition-all transform',
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20',
        )}
      >
        <SideNavigation collapsed={!sidebarOpen} />
      </div>

      {/* Main content */}
      <div 
        className={cn(
          'flex-1 transition-all',
          sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-20'
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:mr-4"
            >
              {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </Button>
            <h1 className="text-xl font-semibold text-weidebio">WeideBio</h1>
            <div className="w-10" /> {/* Empty div for flex spacing */}
          </div>
        </header>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 z-10 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content */}
        <main className="container mx-auto px-4 py-6 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
