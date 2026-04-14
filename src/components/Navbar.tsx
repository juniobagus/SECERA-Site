import { User, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      <nav className="bg-white rounded-full px-6 py-4 flex items-center justify-between shadow-lg">
        <Link 
          to="/"
          className="text-xl md:text-2xl font-bold tracking-widest text-[#6E2B30] cursor-pointer"
        >
          SECERA
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`text-sm font-medium transition-colors ${path === '/' ? 'text-[#6E2B30]' : 'text-zinc-600 hover:text-[#6E2B30]'}`}>Home</Link>
          <Link to="/shop" className={`text-sm font-medium transition-colors ${path === '/shop' ? 'text-[#6E2B30]' : 'text-zinc-600 hover:text-[#6E2B30]'}`}>Shop</Link>
          <Link to="/about" className={`text-sm font-medium transition-colors ${path === '/about' ? 'text-[#6E2B30]' : 'text-zinc-600 hover:text-[#6E2B30]'}`}>About us</Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[#6E2B30] hover:text-[#7b5455] transition-colors">
            <User className="w-5 h-5" />
          </button>
          <button className="text-[#6E2B30] hover:text-[#7b5455] transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </nav>
    </div>
  );
}
