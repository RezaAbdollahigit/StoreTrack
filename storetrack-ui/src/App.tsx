import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import StockHistoryPage from './pages/StockHistoryPage';
import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />

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
          <Route
            path="/products"
            element={<ProtectedRoute><ProductsPage /></ProtectedRoute>}
          />
          <Route
            path="/stock-history"
            element={<ProtectedRoute><StockHistoryPage /></ProtectedRoute>}
          />
        </Routes>
      </main>
    </Router>
  );
}