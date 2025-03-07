
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { 
  Home,
  User,
  Users,
  Calendar,
  Menu,
  X,
  LogOut
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check scroll position to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  // Navigation items
  const navItems = [
    { name: "Home", path: "/", icon: <Home className="h-4 w-4" />, public: true },
    { name: "Dashboard", path: "/dashboard", icon: <Calendar className="h-4 w-4" />, public: false },
    { name: "Community", path: "/community", icon: <Users className="h-4 w-4" />, public: false },
  ];
  
  // Only show admin link for admin users
  if (user?.isAdmin) {
    navItems.push({ name: "Admin", path: "/admin", icon: <User className="h-4 w-4" />, public: false });
  }
  
  // Filter items based on authentication status
  const visibleItems = user 
    ? navItems 
    : navItems.filter(item => item.public);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 font-bold text-xl text-nutrition-700 transition-opacity hover:opacity-80"
        >
          <span className="text-nutrition-600 w-8 h-8 rounded-lg bg-nutrition-50 flex items-center justify-center">
            N
          </span>
          <span className="hidden sm:inline">NutritionNest</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {visibleItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              size="sm"
              className={`flex items-center space-x-1 ${
                location.pathname === item.path
                  ? "bg-nutrition-50 text-nutrition-700 hover:bg-nutrition-100"
                  : "text-gray-600 hover:text-nutrition-600"
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Button>
          ))}
          
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-nutrition-600 ml-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          )}
          
          {!user && (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/login")}
              className="ml-2 bg-nutrition-500 hover:bg-nutrition-600"
            >
              Login
            </Button>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-md animate-slide-up">
          <div className="container mx-auto py-4 px-4 flex flex-col space-y-3">
            {visibleItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                className={`justify-start ${
                  location.pathname === item.path
                    ? "bg-nutrition-50 text-nutrition-700"
                    : "text-gray-600"
                }`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Button>
            ))}
            
            {user ? (
              <Button
                variant="ghost"
                className="justify-start text-gray-600"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-2">Logout</span>
              </Button>
            ) : (
              <Button
                variant="default"
                className="justify-start bg-nutrition-500 hover:bg-nutrition-600"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
