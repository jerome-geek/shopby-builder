import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useGetDisplayProducts } from '../../../lib/api/queries/usePageQueries';

export interface ProductListProps {
    title?: string;
    swiperOptions?: {
        loop?: boolean;
        pagination?: boolean;
        navigation?: boolean;
        slidesPerView?: number;
    };
}

const ProductListBlock: React.FC<ProductListProps> = ({
    title = '상품 진열',
    swiperOptions,
}) => {
    const { data: products, isLoading, isError } = useGetDisplayProducts();

    const activeModules = useMemo(() => {
        const modules = [];
        if (swiperOptions?.navigation) modules.push(Navigation);
        if (swiperOptions?.pagination) modules.push(Pagination);
        return modules;
    }, [swiperOptions]);

    if (isLoading) {
        return (
            <div className="w-full h-[300px] bg-gray-50 animate-pulse flex items-center justify-center text-gray-400 border rounded">
                Loading Products...
            </div>
        );
    }

    if (isError || !products || products.length === 0) {
        return (
            <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center text-gray-500 border rounded">
                No Products Available
            </div>
        );
    }

    return (
        <div className="w-full bg-white py-10 px-4 md:px-8">
            {title && (
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 px-2">
                    {title}
                </h2>
            )}

            <div className="relative product-list-swiper-container">
                <Swiper
                    key={JSON.stringify(swiperOptions)}
                    modules={activeModules}
                    loop={swiperOptions?.loop ?? false}
                    navigation={swiperOptions?.navigation ?? true}
                    pagination={
                        swiperOptions?.pagination ? { type: 'fraction' } : false
                    }
                    slidesPerView={2}
                    spaceBetween={16}
                    breakpoints={{
                        640: { slidesPerView: 3, spaceBetween: 20 },
                        1024: {
                            slidesPerView: swiperOptions?.slidesPerView ?? 5,
                            spaceBetween: 24,
                        },
                    }}
                    className="w-full pb-10" // 하단 페이지네이션 공간 확보
                >
                    {products.map((product: any) => (
                        <SwiperSlide key={product.id}>
                            <div className="flex flex-col group cursor-pointer">
                                {/* Image Area */}
                                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Like Button (Heart icon) */}
                                    <button
                                        className="absolute top-3 right-3 p-1.5 focus:outline-none z-10"
                                        aria-label="찜하기"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                {/* Product Info Area */}
                                <div className="flex flex-col space-y-1">
                                    {product.brand && (
                                        <span className="text-sm font-medium text-gray-800">
                                            {product.brand}
                                        </span>
                                    )}
                                    <h3 className="text-[15px] text-gray-600 line-clamp-2 leading-snug">
                                        {product.name}
                                    </h3>

                                    <div className="flex items-center space-x-1.5 mt-1">
                                        {product.discountRate > 0 && (
                                            <span className="text-lg font-bold text-red-500">
                                                {product.discountRate}%
                                            </span>
                                        )}
                                        <span className="text-lg font-bold text-gray-900">
                                            {(
                                                product.discountedPrice ||
                                                product.price
                                            ).toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Badges */}
                                    {product.badges &&
                                        product.badges.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {product.badges.map(
                                                    (
                                                        badge: string,
                                                        idx: number,
                                                    ) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600"
                                                        >
                                                            {badge}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Custom Styles for Pagination/Navigation to make it look like `< 1 / 2 >` */}
            <style>{`
                .product-list-swiper-container .swiper-pagination-fraction {
                    bottom: 0;
                    font-size: 14px;
                    color: #666;
                    font-weight: 500;
                }
                .product-list-swiper-container .swiper-button-prev,
                .product-list-swiper-container .swiper-button-next {
                    top: auto;
                    bottom: -5px;
                    width: 24px;
                    height: 24px;
                    color: #333;
                }
                .product-list-swiper-container .swiper-button-prev:after,
                .product-list-swiper-container .swiper-button-next:after {
                    font-size: 16px;
                    font-weight: bold;
                }
                .product-list-swiper-container .swiper-button-prev {
                    left: calc(50% - 60px);
                }
                .product-list-swiper-container .swiper-button-next {
                    right: calc(50% - 60px);
                }
            `}</style>
        </div>
    );
};

export default ProductListBlock;
