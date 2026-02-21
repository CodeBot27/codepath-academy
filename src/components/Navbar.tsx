import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Code2, LogOut, LayoutDashboard, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
          <Code2 className="h-7 w-7 text-primary" />
          <span>CodePath <span className="text-primary">Free</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/tracks" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
            Tracks
          </Link>
          {user && (
            <Link to="/dashboard" className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground">
              <Shield className="h-4 w-4" /> Admin
            </Link>
          )}
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-1 h-4 w-4" /> Sign Out
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/tracks" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground">Tracks</Link>
            {user && <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground">Dashboard</Link>}
            {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground">Admin</Link>}
            {user ? (
              <Button variant="ghost" size="sm" onClick={() => { handleSignOut(); setMobileOpen(false); }}>Sign Out</Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground">Log In</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
