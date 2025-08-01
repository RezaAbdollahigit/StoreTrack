import { Instagram, Facebook, MessageCircle, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Social Icons */}
        <div className="flex items-center space-x-4">
          <a href="#" className="text-gray-600 hover:text-gray-800"><Instagram /></a>
          <a href="#" className="text-gray-600 hover:text-gray-800"><Facebook /></a>
          <a href="#" className="text-gray-600 hover:text-gray-800"><MessageCircle /></a>
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center space-x-8 font-semibold rtl">
          <li><Link to="/" className="text-gray-800 font-bold">خانه</Link></li>
          <li><Link to="/products" className="text-gray-600 hover:text-gray-800">محصولات</Link></li>
          <li><Link to="/brands" className="text-gray-600 hover:text-gray-800">برندها</Link></li>
          <li><Link to="/contact" className="text-gray-600 hover:text-gray-800">تماس با ما</Link></li>
        </ul>

        {/* Login/Logout Button */}
        <div>
          {isAuthenticated ? (
            <button onClick={logout} className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
              <LogOut size={20} />
              <span>خروج</span>
            </button>
          ) : (
            <Link to="/auth" className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              <User size={20} />
              <span>ورود / ثبت‌نام</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;