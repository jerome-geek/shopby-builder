import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { MockApi, PageData } from '@/lib/mockApi';
import HeroBannerBlock from '@/components/blocks/HeroBanner/HeroBannerBlock';
import HeaderBlock from '@/components/blocks/Header/HeaderBlock';
import FooterBlock from '@/components/blocks/Footer/FooterBlock';
import IconBannerBlock from '@/components/blocks/IconBanner/IconBannerBlock';
import ProductListBlock from '@/components/blocks/ProductList/ProductListBlock';

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
        <div className="w-full flex flex-col min-h-screen">
            {/* Header: Global or from blocks */}
            {pageData.publishedSchema.blocks.some(
                (b) => b.type === 'Header',
            ) ? (
                pageData.publishedSchema.blocks
                    .filter((b) => b.type === 'Header')
                    .map((block) => (
                        <div key={block.id} className="w-full shrink-0">
                            <HeaderBlock {...block.props} />
                        </div>
                    ))
            ) : (
                <div className="w-full shrink-0">
                    <HeaderBlock
                        title="Shopby Logo"
                        navigationItems={[
                            { label: 'Shop', href: '#' },
                            { label: 'About', href: '#' },
                        ]}
                    />
                </div>
            )}

            {/* Content 영역 */}
            <main className="flex-1 w-full bg-white flex flex-col items-center">
                {pageData.publishedSchema.blocks
                    .filter((b) => b.type !== 'Header' && b.type !== 'Footer')
                    .map((block) => {
                        // HeroBanner는 브라우저 전체 너비 사용, 나머지는 1200px 중앙 정렬
                        const isFullWidthBlock = block.type === 'HeroBanner';

                        return (
                            <div
                                key={block.id}
                                className={
                                    isFullWidthBlock
                                        ? 'w-full'
                                        : 'w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 mx-auto'
                                }
                            >
                                {(() => {
                                    switch (block.type) {
                                        case 'HeroBanner':
                                            return (
                                                <HeroBannerBlock
                                                    {...block.props}
                                                />
                                            );
                                        case 'IconBanner':
                                            return (
                                                <IconBannerBlock
                                                    {...block.props}
                                                />
                                            );
                                        case 'ProductList':
                                            return (
                                                <ProductListBlock
                                                    {...block.props}
                                                />
                                            );
                                        default:
                                            return (
                                                <div className="p-4 border border-red-200 bg-red-50 text-red-600 m-4">
                                                    Unknown Block: {block.type}
                                                </div>
                                            );
                                    }
                                })()}
                            </div>
                        );
                    })}
            </main>

            {/* Footer: Global or from blocks */}
            {pageData.publishedSchema.blocks.some(
                (b) => b.type === 'Footer',
            ) ? (
                pageData.publishedSchema.blocks
                    .filter((b) => b.type === 'Footer')
                    .map((block) => (
                        <div key={block.id} className="w-full shrink-0 mt-auto">
                            <FooterBlock {...block.props} />
                        </div>
                    ))
            ) : (
                <div className="w-full shrink-0 mt-auto">
                    <FooterBlock
                        companyName="Shopby Builder"
                        copyrightYear="2026"
                    />
                </div>
            )}
        </div>
    );
};

export default Renderer;
