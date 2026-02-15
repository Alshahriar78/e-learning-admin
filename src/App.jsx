import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Courses from './pages/courses/Courses';
import Products from './pages/products/Products';
import RecentOrders from './pages/order/RecentOrders';
import RecentUsers from './pages/users/RecentUsers';
import Categories from './pages/categories/Categories.jsx';
import Modules from './pages/module/Modules.jsx';
import Videos from './pages/video/Videos.jsx';
import Enrollments from './pages/enrollment/Enrollments.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<div>Register Page (TBD)</div>} />

          {/* Protected Routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="categories" element={<Categories />} /> {/* NEW */}
            <Route path='modules' element={<Modules/>}></Route>
            <Route path='videos' element={<Videos/>}></Route>
            <Route path="products" element={<Products />} />
            <Route path="users" element={<RecentUsers/>} />
            <Route path="recent-orders" element={<RecentOrders />} />
            <Route path="enrollments" element={<Enrollments />} />
            <Route path="settings" element={<div>Settings (TBD)</div>} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
