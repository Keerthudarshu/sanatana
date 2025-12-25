
import React from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const AdminHeader = ({ user, onToggleSidebar }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin-login');
  };

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-4 sm:px-6 lg:pl-70">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-muted rounded-lg"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Title: full text on sm+; compact label on xs */}
        <div className="flex flex-col">
          <h1 className="hidden sm:block text-lg font-heading font-semibold text-foreground leading-tight">
            sanathana-parampara - Admin
          </h1>
          <span className="sm:hidden text-sm font-semibold text-foreground">Admin</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Username: show on sm+ only to save space on mobile */}
        <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
          <User size={16} />
          <span className="truncate max-w-[10rem]">{user?.name || 'Admin User'}</span>
        </div>

        {/* Logout: full button on sm+, icon-only on xs */}
        <button
          onClick={handleLogout}
          className="hidden sm:inline-flex items-center space-x-2 px-3 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>

        <button
          onClick={handleLogout}
          className="sm:hidden p-2 rounded-lg hover:bg-muted"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
