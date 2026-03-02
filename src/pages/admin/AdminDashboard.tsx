import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/useAuthStore';

const AdminDashboard: React.FC = () => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-gray-900 tracking-tight">
                                Builder Console
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                welcome, geek
                            </span>
                            <button
                                onClick={() => {
                                    logout();
                                    navigate('/login');
                                }}
                                className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Welcome to Shopby Builder
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Choose an action below to manage your storefront or view
                        the live result.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Visual Editor Card */}
                    <div
                        onClick={() => navigate('/builder/dashboard')}
                        className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:border-blue-500 hover:ring-1 hover:ring-blue-500 hover:shadow-md cursor-pointer transition-all p-6 group"
                    >
                        <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1 bg-blue-50 rounded-lg p-3 group-hover:bg-blue-600 transition-colors">
                                <svg
                                    className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-5">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    Shop Builder
                                </h3>
                                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                                    Open the visual editor to design your pages,
                                    add new blocks like Hero Banners or Product
                                    Lists, and customize properties.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Published Storefront Card */}
                    <div
                        onClick={() => navigate('/t-1')}
                        className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:border-emerald-500 hover:ring-1 hover:ring-emerald-500 hover:shadow-md cursor-pointer transition-all p-6 group"
                    >
                        <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1 bg-emerald-50 rounded-lg p-3 group-hover:bg-emerald-600 transition-colors">
                                <svg
                                    className="h-6 w-6 text-emerald-600 group-hover:text-white transition-colors"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                    />
                                </svg>
                            </div>
                            <div className="ml-5">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                    Live Storefront
                                </h3>
                                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                                    Navigate to the live published tenant
                                    preview. See exactly what your customers see
                                    based on the latest published draft.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
