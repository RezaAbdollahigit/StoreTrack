import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage'; 

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* مسیر صفحه اصلی که عمومی است */}
        <Route path="/" element={<HomePage />} />

        {/* مسیر لاگین/ثبت‌نام */}
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />} />
        
        {/* مسیر داشبورد که محافظت شده است */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}