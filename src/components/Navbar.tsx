import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Settings, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const cart = useStore((state) => state.cart);
  const config = useStore((state) => state.config);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              {config.logo ? (
                <img
                  className="h-8 w-auto rounded-lg"
                  src={config.logo}
                  alt={config.name}
                />
              ) : (
                <span className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {config.name}
                </span>
              )}
            </Link>
            <div className="hidden md:flex md:ml-6 space-x-8">
              <Link
                to="/"
                className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Inicio
              </Link>
              <Link
                to="/menu"
                className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Menú
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-gray-100 relative transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="h-6 w-6" />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};