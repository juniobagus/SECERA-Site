import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, Settings, LogOut, LayoutDashboard, Monitor, Users, Bell, Check, Trash2, Briefcase, FileUser } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useState, useEffect, useRef } from 'react';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    const [notifs, count] = await Promise.all([
      getNotifications(),
      getUnreadCount()
    ]);
    setNotifications(notifs);
    setUnreadCount(count);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await markAsRead(id);
    if (success) {
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    const success = await markAllAsRead();
    if (success) {
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/cms', label: 'CMS', icon: Monitor },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/jobs', label: 'Careers', icon: Briefcase },
    { path: '/admin/applications', label: 'Applications', icon: FileUser },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold tracking-widest text-[#722F38]">SECERA</h1>
          <span className="ml-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Admin</span>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#722F38] text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
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
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-gray-400 hover:text-[#722F38] hover:bg-gray-100 rounded-full transition-all"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">Notifikasi</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="text-[10px] font-bold text-[#722F38] hover:underline"
                      >
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">Tidak ada notifikasi</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => {
                            if (notif.data?.order_id) navigate('/admin/orders');
                            setIsNotifOpen(false);
                          }}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0 relative ${!notif.is_read ? 'bg-[#722F38]/5' : ''}`}
                        >
                          {!notif.is_read && (
                            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#722F38] rounded-full"></div>
                          )}
                          <p className="text-xs text-gray-900 font-medium mb-1 pr-6">{notif.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">
                              {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: localeId })}
                            </span>
                            {!notif.is_read && (
                              <button 
                                onClick={(e) => handleMarkAsRead(notif.id, e)}
                                className="p-1 hover:bg-white rounded-md text-gray-400 hover:text-green-600 transition-colors"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none mb-1">{admin?.name || 'Admin'}</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{admin?.role || 'Administrator'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#722F38] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#722F38]/20">
                {admin?.name?.charAt(0) || 'A'}
              </div>
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

