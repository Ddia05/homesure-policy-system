import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, FileText, Shield, Briefcase, FileCheck, LogOut, FileSignature } from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      end={to.split('/').length <= 3} // Exact match for base dashboard
    >
      <Icon className="nav-icon" />
      {label}
    </NavLink>
  );
};

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  // Determine role-specific navigation
  const isAgent = user?.role === 'AGENT';
  
  const navItems = isAgent ? [
    { to: '/agent/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/agent/applications', icon: FileCheck, label: 'Applications' },
    { to: '/agent/policies', icon: Shield, label: 'Policies' },
    { to: '/agent/policy-requests', icon: FileSignature, label: 'Endorsements' },
  ] : [
    { to: '/customer/dashboard', icon: Home, label: 'Home' },
    { to: '/customer/properties', icon: Briefcase, label: 'My Properties' },
    { to: '/customer/quotes', icon: FileText, label: 'Quotes' },
    { to: '/customer/applications', icon: FileCheck, label: 'Applications' },
    { to: '/customer/policies', icon: Shield, label: 'Policies' },
    { to: '/customer/policy-requests', icon: FileSignature, label: 'Policy Requests' },
  ];

  // Simple breadcrumbs extraction
  const pathSegments = location.pathname.split('/').filter(p => p);
  const breadcrumbText = pathSegments.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ');

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>HomeSure</h2>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <SidebarItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut className="nav-icon" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <header className="top-header">
          <div className="header-left">
            {/* Could put a hamburger menu here for mobile */}
          </div>
          <div className="header-right">
            <span className="user-role-badge">
              {user?.name || user?.email} ({user?.role})
            </span>
          </div>
        </header>

        <main className="main-content">
          <div className="content-container">
            <div className="page-header">
              <div className="breadcrumbs">Home / {breadcrumbText}</div>
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
