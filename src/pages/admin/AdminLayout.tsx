import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  LayoutDashboard,
  Monitor,
  Users,
  Bell,
  Check,
  Briefcase,
  FileUser,
  Activity,
  Menu,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useState, useEffect, useRef, type MouseEvent } from 'react';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'low_stock' | 'job_application' | 'order'>('all');
  const notifRef = useRef<HTMLDivElement>(null);

  const getNotifCategory = (notif: any): 'low_stock' | 'job_application' | 'order' | 'other' => {
    const eventType = String(notif?.event_type || notif?.type || '').toLowerCase();
    const message = String(notif?.message || '').toLowerCase();

    if (eventType.includes('low_stock') || message.includes('stok') || message.includes('tersisa')) return 'low_stock';
    if (eventType.includes('job_application') || message.includes('lamaran')) return 'job_application';
    if (eventType.includes('order') || eventType.includes('checkout') || eventType.includes('payment') || message.includes('pesanan') || message.includes('order')) return 'order';

    return 'other';
  };

  const getNotifData = (notif: any) => {
    if (notif?.data && typeof notif.data === 'object') return notif.data;

    if (typeof notif?.data === 'string') {
      try {
        return JSON.parse(notif.data);
      } catch {
        return {};
      }
    }

    return {};
  };

  const getNotifDetail = (notif: any) => {
    const category = getNotifCategory(notif);
    const data = getNotifData(notif);

    if (category === 'job_application') {
      const position = data.job_title || data.position || 'Posisi';
      return `Lamaran baru untuk posisi ${position}`;
    }

    if (category === 'order') {
      const orderId = data.order_id || data.entity_id || data.id;
      return orderId ? `Order #${String(orderId).slice(0, 8)}` : 'Order masuk';
    }

    if (category === 'low_stock') {
      const sku = data.sku || 'SKU';
      const stock = data.stock ?? '-';
      return `${sku} tersisa ${stock} unit`;
    }

    return null;
  };

  const handleNotificationClick = (notif: any) => {
    const category = getNotifCategory(notif);

    if (category === 'job_application') {
      navigate('/admin/applications');
    } else if (category === 'order') {
      navigate('/admin/orders');
    }

    setIsNotifOpen(false);
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (notifFilter === 'all') return true;
    return getNotifCategory(notif) === notifFilter;
  });

  useEffect(() => {
    void loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    const [notifs, count] = await Promise.all([getNotifications(), getUnreadCount()]);
    setNotifications(notifs);
    setUnreadCount(count);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  const handleMarkAsRead = async (id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const success = await markAsRead(id);

    if (success) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    const success = await markAllAsRead();

    if (success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
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
    { path: '/admin/notification-deliveries', label: 'Notif Logs', icon: Activity },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-[100dvh] bg-gray-50 font-sans">
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <h1 className="text-xl font-bold tracking-widest text-[#722F38]">SECERA</h1>
          <span className="ml-2 text-xs font-medium uppercase tracking-wider text-gray-400">Admin</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#722F38] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 active:scale-[0.98]"
          >
            <LogOut className="mr-3 h-5 w-5 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {isMobileNavOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-gray-900/40 lg:hidden"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-gray-200 bg-white transition-transform duration-300 lg:hidden ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
          <div className="flex items-center">
            <h1 className="text-lg font-bold tracking-widest text-[#722F38]">SECERA</h1>
            <span className="ml-2 text-xs font-medium uppercase tracking-wider text-gray-400">Admin</span>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsMobileNavOpen(false)}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 overflow-y-auto px-3 py-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#722F38] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setIsMobileNavOpen(true)}
            className="mr-3 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <p className="truncate text-sm font-semibold tracking-wide text-gray-700">Admin Panel</p>

          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <div className="relative" ref={notifRef}>
              <button onClick={() => setIsNotifOpen((prev) => !prev)} className="relative rounded-full p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-[#722F38]">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 max-h-[70dvh] w-[min(92vw,24rem)] overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-xl z-50">
                  <div className="flex items-center justify-between border-b border-gray-50 px-4 py-2">
                    <h3 className="text-sm font-bold text-gray-900">Notifikasi</h3>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllAsRead} className="text-[10px] font-bold text-[#722F38] hover:underline">
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 border-b border-gray-50 px-3 py-2">
                    {['all', 'low_stock', 'job_application', 'order'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setNotifFilter(filter as 'all' | 'low_stock' | 'job_application' | 'order')}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${notifFilter === filter ? 'bg-[#722F38] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {filter === 'all' ? 'Semua' : filter === 'low_stock' ? 'Low stock' : filter === 'job_application' ? 'Lamaran' : 'Order masuk'}
                      </button>
                    ))}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {filteredNotifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell className="mx-auto mb-2 h-8 w-8 text-gray-200" />
                        <p className="text-xs text-gray-400">Tidak ada notifikasi pada filter ini</p>
                      </div>
                    ) : (
                      filteredNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`relative cursor-pointer border-b border-gray-50 px-4 py-3 transition-colors last:border-0 hover:bg-gray-50 ${!notif.is_read ? 'bg-[#722F38]/5' : ''}`}
                        >
                          {!notif.is_read && <div className="absolute left-1 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-[#722F38]" />}
                          <p className="mb-1 pr-6 text-xs font-medium text-gray-900">{notif.message}</p>
                          {getNotifDetail(notif) && <p className="mb-1 pr-6 text-[11px] text-gray-500">{getNotifDetail(notif)}</p>}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">{formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: localeId })}</span>
                            {!notif.is_read && (
                              <button onClick={(e) => handleMarkAsRead(notif.id, e)} className="rounded-md p-1 text-gray-400 transition-colors hover:bg-white hover:text-green-600">
                                <Check className="h-3 w-3" />
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

            <div className="flex items-center gap-2 border-l border-gray-100 pl-3 sm:gap-3 sm:pl-4">
              <div className="hidden text-right sm:block">
                <p className="mb-1 text-sm font-bold leading-none text-gray-900">{admin?.name || 'Admin'}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">{admin?.role || 'Administrator'}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#722F38] text-sm font-bold text-white shadow-lg shadow-[#722F38]/20 sm:h-10 sm:w-10">
                {admin?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1400px]">
            <Outlet />
          </div>
        </div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
