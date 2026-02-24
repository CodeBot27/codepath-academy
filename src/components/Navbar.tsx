import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Code2, LogOut, LayoutDashboard, Shield, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { to: '/tracks', label: 'Tracks', show: true },
    { to: '/about', label: 'About', show: true },
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, show: !!user },
    { to: '/admin', label: 'Admin', icon: <Shield className="h-4 w-4" />, show: !!isAdmin },
  ];

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.07, type: 'spring' as const, stiffness: 300, damping: 24 },
    }),
    exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
  };

  return (
    <div
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'flex justify-center px-4 pt-3' : ''
      }`}
    >
      <nav
        className={`w-full border-border backdrop-blur-md shadow-lg transition-all duration-300 ${
          scrolled
            ? 'max-w-5xl rounded-2xl border bg-card/80'
            : 'border-b bg-background/80'
        }`}
      >
        <div className="flex h-14 items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Code2 className="h-6 w-6 text-primary" />
            <span>CodePath <span className="text-primary">Free</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-5 md:flex">
            {menuItems.filter(i => i.show).map(item => (
              <Link key={item.to} to={item.to} className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground">
                {item.icon}{item.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">{user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}</span>
                </span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-1 h-4 w-4" /> Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button size="sm" className="rounded-xl" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <motion.button
            className="md:hidden rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden md:hidden"
            >
              <div className="border-t border-border px-5 pb-4 pt-3">
                <div className="flex flex-col gap-1">
                  {menuItems.filter(i => i.show).map((item, i) => (
                    <motion.div key={item.to} custom={i} variants={itemVariants} initial="hidden" animate="visible" exit="exit">
                      <Link
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                      >
                        {item.icon}{item.label}
                      </Link>
                    </motion.div>
                  ))}
                  {user ? (
                    <motion.div custom={menuItems.filter(i => i.show).length} variants={itemVariants} initial="hidden" animate="visible" exit="exit">
                      <button
                        onClick={() => { handleSignOut(); setMobileOpen(false); }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div custom={menuItems.filter(i => i.show).length} variants={itemVariants} initial="hidden" animate="visible" exit="exit" className="flex gap-2 pt-2">
                      <Button variant="ghost" size="sm" asChild className="flex-1" onClick={() => setMobileOpen(false)}>
                        <Link to="/login">Log In</Link>
                      </Button>
                      <Button size="sm" className="flex-1 rounded-xl" asChild onClick={() => setMobileOpen(false)}>
                        <Link to="/signup">Sign Up</Link>
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;
