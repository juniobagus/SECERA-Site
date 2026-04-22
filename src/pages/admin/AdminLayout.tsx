import { Outlet, Link, useLocation } from 'react-router-dom';
import { Package, ShoppingCart, Settings, LogOut, LayoutDashboard, Tag } from 'lucide-react';
import { logout } from '../../utils/auth';

export default function AdminLayout() {
  const location = useLocation();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await logout();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold tracking-widest text-[#722F38]">SECERA</h1>
          <span className="ml-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Admin</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname === '/admin' ? 'bg-[#722F38] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname.startsWith('/admin/products') ? 'bg-[#722F38] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Package className="w-5 h-5" />
            Products
          </Link>
          <Link to="/admin/promos" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname.startsWith('/admin/promos') ? 'bg-[#722F38] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Tag className="w-5 h-5" />
            Promos
          </Link>
          <Link to="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname.startsWith('/admin/orders') ? 'bg-[#722F38] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            <ShoppingCart className="w-5 h-5" />
            Orders
          </Link>
          <Link to="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname.startsWith('/admin/settings') ? 'bg-[#722F38] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shrink-0">
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#722F38]/10 flex items-center justify-center text-[#722F38] font-bold text-sm">
              A
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
