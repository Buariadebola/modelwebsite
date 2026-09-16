import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/auth/AuthPage';
import ModelProfile from './pages/ModelProfile';
import AdminPage from './pages/admin/AdminPage';
import AdminProfilesPage from './pages/admin/AdminProfilesPage';
import CreateProfilePage from './pages/admin/CreateProfilePage';
import AdminModelProfile from './pages/admin/AdminModelProfile';
import ClientMessages from './pages/client/ClientMessages';
import AdminMessages from './pages/admin/AdminMessages';
import Payment from './pages/Payment';
import NotFound from './pages/NotFound';

function App() {

  const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-purple-100 text-sm text-purple-600">
          Loading your account...
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

     if (requiredRole && user?.type !== requiredRole) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_30%),linear-gradient(135deg,#fffafc_0%,#fdf3ff_40%,#f6efff_100%)] text-[#2f1634]">
      <main className="mx-auto max-w-7xl px-0 py-0">
      <Routes>
        <Route path="/model/:username" element={<ModelProfile />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/admin/login" element={<AuthPage mode="admin-login" />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="model">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/profiles"
          element={
            <ProtectedRoute requiredRole="model">
              <AdminProfilesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-profile"
          element={
            <ProtectedRoute requiredRole="model">
              <CreateProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/models/:username"
          element={
            <ProtectedRoute requiredRole="model">
              <AdminModelProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/messages"
          element={
            <ProtectedRoute requiredRole="client">
              <ClientMessages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute requiredRole="model">
              <AdminMessages />
            </ProtectedRoute>
          }
        />
        <Route path="/payment" element={<Payment />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      </main>
      </div>
  );
}

export default App;