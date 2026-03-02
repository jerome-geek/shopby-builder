import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import Dashboard from '@/pages/builder/Dashboard';
import Editor from '@/pages/builder/Editor';
import Renderer from '@/pages/storefront/Renderer';
import Login from '@/pages/auth/Login';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import { useAuthStore } from '@/store/useAuthStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Navigate to="/admin" replace />
            </ProtectedRoute>
        ),
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/admin',
        element: (
            <ProtectedRoute>
                <AdminDashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: '/builder',
        children: [
            {
                path: 'dashboard',
                element: (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'editor/:pageId',
                element: (
                    <ProtectedRoute>
                        <Editor />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: '/:tenantId/*',
        element: <Renderer />,
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
