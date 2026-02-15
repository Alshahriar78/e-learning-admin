import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  ShoppingBag, 
  ShoppingCart,
  Users, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Categories', icon: BookOpen, path: '/categories' }, 
    { name: 'Courses', icon: BookOpen, path: '/courses' },
    { name: "Modules", icon: BookOpen, path: "/modules" },
    { name: "Videos", icon: BookOpen, path: "/videos" },
    { name: 'Course Enrollments', path: '/enrollments', icon: BookOpen },
    { name: 'Products', icon: ShoppingBag, path: '/products' },
    { name: 'Users', icon: Users, path: '/users' },
    { name: 'Order', icon: ShoppingCart, path: '/recent-orders' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 font-bold text-2xl text-indigo-600">
          <div className="w-[70px] h-[70px] bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-center text-xs">Sky IT Institution</span>
          </div>
          Admin 
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </div>
            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;