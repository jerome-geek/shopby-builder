import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Dashboard from './pages/builder/Dashboard';
import Editor from './pages/builder/Editor';
import Renderer from './pages/storefront/Renderer';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import { useAuthStore } from './store/useAuthStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect root based on auth status */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Navigate to="/admin" replace />
                        </ProtectedRoute>
                    }
                />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Builder Routes */}
                <Route
                    path="/builder/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/builder/editor/:pageId"
                    element={
                        <ProtectedRoute>
                            <Editor />
                        </ProtectedRoute>
                    }
                />

                {/* Storefront Routes (Public) */}
                <Route path="/:tenantId/*" element={<Renderer />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
