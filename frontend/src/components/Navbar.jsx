import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, User, Menu, X, LogOut, Lock } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Nav = () => {
  const { user, logout } = useAuthStore();
  const isAuthenticated = !!user;
  const [showMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

 const handleLogout = async () => {
  try {
    await logout(); // this sends request to /logout
    setAuth({ user: null, isAuthenticated: false }); // reset context state
    setShowMenu(false);
    navigate("/login"); // optional: send them to login page
  } catch (err) {
    console.error("Logout failed", err);
  }
};


  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  const handleCalendarClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  const handleAuthRedirect = () => {
    setShowAuthModal(false);
    navigate('/auth');
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
        
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActivePage = (path) => location.pathname === path;

  const NavLink = ({ to, children, onClick }) => (
    <Link 
      to={to}
      onClick={onClick}
      className={`
        relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-out
        ${isActivePage(to) 
          ? 'text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25' 
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }
        hover:scale-105 active:scale-95
      `}
    >
      {children}
      {isActivePage(to) && (
        <div className="absolute -bottom-1 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2"></div>
      )}
    </Link>
  );

  // Auth Modal Component
  const AuthModal = () => (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}></div>
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20 animate-fade-in">
        <div className="text-center space-y-6">
          {/* Gradient lock icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
            <Lock className="w-7 h-7 text-white" />
          </div>
          
          {/* Typography */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              Join whispr
            </h3>
            <p className="text-slate-500">
              Sign in to unlock your personal diary experience
            </p>
          </div>
          
          {/* Premium button */}
          <button
            onClick={handleAuthRedirect}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-violet-500/25"
          >
            Get Started
          </button>
          
          {/* Close option */}
          <button 
            onClick={() => setShowAuthModal(false)}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className={`
        fixed w-full z-40 transition-all duration-500 ease-out
        ${isScrolled 
          ? ' backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-200/50' 
          : ' backdrop-blur-md'
        }
      `}>
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex justify-between items-center h-18">
            {/* Logo Section - Enhanced */}
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-xl group-hover:shadow-violet-500/30 transition-all duration-300">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">whispr</span>
                <span className="block text-xs text-slate-500 font-medium -mt-0.5">Personal Diary</span>
              </div>
            </div>
            
            {/* Desktop Navigation - Pill Design */}
            <div className="hidden md:flex items-center gap-2 bg-slate-50/50 backdrop-blur-sm rounded-full p-1.5 border border-slate-200/50">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/calendar" onClick={handleCalendarClick}>Calendar</NavLink>
              
              {isAuthenticated && (
                <NavLink to="/diary">Inkwell</NavLink>
                

              )}
               {isAuthenticated && (
                <NavLink to="/chronicles">Chronicles</NavLink>
                

              )}
              <NavLink to="/about">About</NavLink>
            </div>


            {/* User Section - Enhanced */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative flex items-center" ref={menuRef}>
                  <div
                    onClick={() => setShowMenu(!showMenu)}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 
                              flex items-center justify-center cursor-pointer
                              transition-all duration-300 shadow-sm hover:shadow-md border border-white/50"
                  >
                    <User size={18} className="text-slate-600" />
                  </div>

                  {showMenu && (
                    <div className="absolute right-0 top-full mt-3 w-44
                                   bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-2xl z-50
                                   py-2 animate-fade-in">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-slate-700 font-medium
                                   hover:bg-slate-50 flex items-center gap-3 transition-colors duration-200 rounded-xl mx-1"
                      >
                        <LogOut size={16} className="text-slate-500" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link 
                    to="/auth" 
                    className="text-sm font-medium text-slate-600 hover:text-slate-900
                             transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-slate-50"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/auth" 
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 
                             hover:from-violet-700 hover:to-indigo-700 rounded-xl transition-all duration-300 
                             shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105 active:scale-95"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal />}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        /* Custom scrollbar for consistency */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #6366f1);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #4f46e5);
        }
      `}</style>
    </>
  );
};

export default Nav;
