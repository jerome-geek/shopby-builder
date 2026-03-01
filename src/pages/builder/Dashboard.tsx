import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { MockApi, PageData } from '../../lib/mockApi';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [pages, setPages] = useState<PageData[]>([]);

    useEffect(() => {
        MockApi.initMockData();
        const data = MockApi.getPagesByTenant('t-1');
        setPages(data);
    }, []);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Store Dashboard</h1>
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Your Pages</h2>
                <ul>
                    {pages.map((page) => (
                        <li
                            key={page.id}
                            className="flex items-center justify-between py-3 border-b last:border-0"
                        >
                            <div>
                                <span className="font-medium">
                                    {page.title}
                                </span>
                                <span className="text-gray-500 text-sm ml-2">
                                    /{page.slug}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                {page.isEditable ? (
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/builder/editor/${page.id}`,
                                            )
                                        }
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                    >
                                        Edit Layout
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="px-4 py-2 bg-gray-200 text-gray-500 rounded cursor-not-allowed text-sm"
                                    >
                                        Not Editable
                                    </button>
                                )}
                                <button
                                    onClick={() =>
                                        window.open(
                                            `/${page.tenantId}/${page.slug}`,
                                            '_blank',
                                        )
                                    }
                                    className="px-4 py-2 border rounded hover:bg-gray-50 text-sm"
                                >
                                    View Live
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
