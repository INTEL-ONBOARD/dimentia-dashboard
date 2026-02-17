"use client";
import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import TopNav from './TopNav';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

/**
 * Main Layout Component
 * Handles responsive sidebar (desktop/mobile)
 * and wraps page content
 */
export default function Layout({ children, title, subtitle }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <Sidebar />
      </MobileSidebar>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[260px]">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {/* Mobile Menu Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu size={20} />
              Menu
            </button>
          </div>

          {/* Top Navigation */}
          {title && <TopNav title={title} subtitle={subtitle} />}

          {/* Page Content */}
          {children}
        </div>
      </main>
    </div>
  );
}
