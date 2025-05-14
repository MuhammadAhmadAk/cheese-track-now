
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Plus, 
  ArrowRight, 
  Package2, 
  Camera, 
  ShoppingBasket, 
  ClipboardList, 
  BarChart4, 
  Settings
} from 'lucide-react';

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: Home,
    href: '/'
  },
  {
    label: 'Input',
    icon: Plus,
    href: '/input'
  },
  {
    label: 'Dispatch',
    icon: ArrowRight,
    href: '/dispatch'
  },
  {
    label: 'Inventory',
    icon: Package2,
    href: '/inventory'
  },
  {
    label: 'Delivery Note',
    icon: Camera,
    href: '/delivery-note'
  },
  {
    label: 'Assortment',
    icon: ShoppingBasket,
    href: '/assortment'
  },
  {
    label: 'Orders',
    icon: ClipboardList,
    href: '/orders'
  },
  {
    label: 'Reports',
    icon: BarChart4,
    href: '/reports'
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings'
  }
];

interface SideNavigationProps {
  className?: string;
  collapsed?: boolean;
}

export function SideNavigation({ className, collapsed = false }: SideNavigationProps) {
  const location = useLocation();

  return (
    <div className={cn(
      'flex flex-col h-full gap-2 py-4',
      collapsed ? 'px-2' : 'p-4',
      className
    )}>
      <div className={cn(
        'flex items-center justify-center h-14 mb-4',
        collapsed ? 'mb-8' : 'px-4'
      )}>
        <Link to="/" className="flex items-center">
          {collapsed ? (
            <div className="w-8 h-8 bg-weidebio flex items-center justify-center text-white rounded-md">
              <span className="text-sm font-bold">W</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-weidebio flex items-center justify-center text-white rounded-md">
                <span className="text-sm font-bold">W</span>
              </div>
              <span className="text-lg font-bold text-weidebio">WeideBio</span>
            </div>
          )}
        </Link>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center py-3 px-3 rounded-lg text-sm font-medium transition-colors',
                collapsed ? 'justify-center' : 'gap-3',
                isActive
                  ? 'bg-weidebio text-white'
                  : 'text-gray-700 hover:bg-weidebio/10'
              )}
            >
              <item.icon className={cn('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-5 h-5')} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
