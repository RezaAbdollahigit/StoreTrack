import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage'; // صفحه جدید را وارد می‌کنیم

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/auth" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />} 
          />
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} 
          />
          <Route 
            path="/orders" 
            element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} 
          />
          {/* مسیر جدید برای صفحه محصولات در اینجا اضافه شده است */}
          <Route 
            path="/products" 
            element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} 
          />
        </Routes>
      </main>
    </Router>
  );
}