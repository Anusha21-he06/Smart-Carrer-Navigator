import React from 'react';
import { useAuth } from '../services/authContext';
import { LayoutDashboard, Compass, TrendingUp, LogOut, User, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-600';

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(to)}`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-800 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-bold text-lg">CareerNav</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-indigo-900 text-white transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Compass className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold">SmartPath</span>
          </div>

          <nav className="space-y-2">
            <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/pathway" icon={Compass} label="Career Pathway" />
            <NavItem to="/trends" icon={TrendingUp} label="Industry Trends" />
            <NavItem to="/profile" icon={User} label="My Profile" />
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-indigo-800">
          <div className="flex items-center space-x-3 mb-4">
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-indigo-400"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.displayName || 'User'}</p>
              <p className="text-xs text-indigo-300 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="w-full flex items-center justify-center space-x-2 bg-indigo-800 hover:bg-indigo-700 py-2 rounded-lg text-sm transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};