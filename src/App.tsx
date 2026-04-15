import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CarsListPage from './pages/CarsListPage';
import CarDetailPage from './pages/CarDetailPage';
import OrdersPage from './pages/OrdersPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PaymentPage from './pages/PaymentPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import CouponsPage from './pages/CouponsPage';
import { OrdersProvider } from './context/OrdersContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// 需要登录的路由守卫
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// 已登录用户访问登录页时重定向
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OrdersProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cars" element={<CarsListPage />} />
                <Route path="/cars/:id" element={<CarDetailPage />} />
                <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
                <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
                <Route path="/orders" element={<RequireAuth><OrdersPage /></RequireAuth>} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
                <Route path="/coupons" element={<RequireAuth><CouponsPage /></RequireAuth>} />
                <Route path="/payment" element={<RequireAuth><PaymentPage /></RequireAuth>} />
                <Route path="/admin/*" element={<AdminPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </OrdersProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;