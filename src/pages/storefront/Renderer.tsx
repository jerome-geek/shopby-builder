import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { MockApi, PageData } from '../../lib/mockApi';
import HeroBanner from '../../components/blocks/HeroBanner';

const Renderer: React.FC = () => {
    const { tenantId, '*': slug } = useParams<{
        tenantId: string;
        '*': string;
    }>();
    const [pageData, setPageData] = useState<PageData | null>(null);

    useEffect(() => {
        if (tenantId) {
            MockApi.initMockData();
            const page = MockApi.getPage(tenantId, slug || 'home');
            setPageData(page);
        }
    }, [tenantId, slug]);

    if (!pageData)
        return (
            <div className="p-8 text-center text-red-500">Page Not Found</div>
        );

    // Default templates for non-editable pages
    if (!pageData.isEditable) {
        if (pageData.pageType === 'productList') {
            return (
                <div className="p-8 text-center text-2xl font-bold">
                    🛒 Default Products List Page (Hardcoded Template)
                </div>
            );
        }
        if (pageData.pageType === 'cart') {
            return (
                <div className="p-8 text-center text-2xl font-bold">
                    📦 Default Cart Page (Hardcoded Template)
                </div>
            );
        }
    }

    if (!pageData.publishedSchema)
        return (
            <div className="p-8 text-center">
                This page is not published yet.
            </div>
        );

    return (
        <div className="w-full">
            {pageData.publishedSchema.blocks.map((block) => {
                // Simple Block Switcher
                switch (block.type) {
                    case 'Header':
                        return (
                            <header
                                key={block.id}
                                className="p-4 bg-gray-900 justify-center flex text-white font-bold text-xl"
                            >
                                {String(block.props.title || 'Store Header')}
                            </header>
                        );
                    case 'HeroBanner':
                        return (
                            <HeroBanner key={block.id} props={block.props} />
                        );
                    case 'ProductList':
                        return (
                            <div key={block.id} className="p-8">
                                <h3 className="text-xl font-bold mb-4">
                                    Products
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="border rounded p-4 text-center pb-8 shadow-sm"
                                        >
                                            Product {i}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    default:
                        return (
                            <div
                                key={block.id}
                                className="p-4 border border-red-200 bg-red-50 text-red-600 m-4"
                            >
                                Unknown Block: {block.type}
                            </div>
                        );
                }
            })}
        </div>
    );
};

export default Renderer;
