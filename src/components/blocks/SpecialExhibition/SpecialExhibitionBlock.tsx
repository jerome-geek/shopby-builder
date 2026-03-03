import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useGetSpecialExhibition } from '@/lib/api/queries/usePageQueries';

export interface SpecialExhibitionProps {
    title?: string;
    description?: string;
    bannerImageUrl?: string;
    swiperOptions?: {
        loop?: boolean;
        pagination?: boolean;
        navigation?: boolean;
        slidesPerView?: number;
    };
}

const SpecialExhibitionBlock: React.FC<SpecialExhibitionProps> = ({
    title,
    description,
    bannerImageUrl,
    swiperOptions,
}) => {
    const { data: exhibition, isLoading, isError } = useGetSpecialExhibition();

    const activeModules = useMemo(() => {
        const modules = [];
        if (swiperOptions?.navigation) modules.push(Navigation);
        if (swiperOptions?.pagination) modules.push(Pagination);
        return modules;
    }, [swiperOptions]);

    if (isLoading) {
        return (
            <div className="w-full h-[400px] bg-gray-50 flex items-center justify-center animate-pulse text-gray-400 border rounded">
                Loading Exhibition...
            </div>
        );
    }

    if (isError || !exhibition) {
        return (
            <div className="w-full h-[400px] bg-gray-50 flex items-center justify-center text-gray-400 border rounded">
                Exhibition not found
            </div>
        );
    }

    // props overrides API data if provided
    const displayTitle = title || exhibition.title;
    const displayDescription = description || exhibition.description;
    const displayImage = bannerImageUrl || exhibition.imageUrl;

    return (
        <div className="w-full bg-white py-12 px-4 md:px-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Banner Area */}
                <div className="w-full md:w-1/3 flex flex-col justify-center bg-gray-50 rounded-lg overflow-hidden relative group min-h-[300px] md:min-h-auto">
                    <img
                        src={displayImage}
                        alt={displayTitle}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    <div className="relative z-10 p-8 text-white flex flex-col h-full justify-end">
                        <h2 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight">
                            {displayTitle}
                        </h2>
                        <p className="text-sm md:text-base opacity-90">
                            {displayDescription}
                        </p>
                    </div>
                </div>

                {/* Right Products Area (Swiper) */}
                <div className="w-full md:w-2/3 relative exhibition-swiper-container">
                    <Swiper
                        key={JSON.stringify(swiperOptions)}
                        modules={activeModules}
                        loop={swiperOptions?.loop ?? false}
                        navigation={swiperOptions?.navigation ?? true}
                        pagination={
                            swiperOptions?.pagination
                                ? { type: 'fraction' }
                                : false
                        }
                        slidesPerView={1.5}
                        spaceBetween={16}
                        breakpoints={{
                            640: { slidesPerView: 2.5, spaceBetween: 20 },
                            1024: {
                                slidesPerView:
                                    swiperOptions?.slidesPerView ?? 3.5,
                                spaceBetween: 24,
                            },
                        }}
                        className="w-full h-full pb-10 pt-10 md:pt-0"
                    >
                        {exhibition.products?.map((product: any) => (
                            <SwiperSlide key={product.id}>
                                <div className="flex flex-col group cursor-pointer">
                                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                                        />
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
            </div>

            <style>{`
                .exhibition-swiper-container .swiper-pagination-fraction {
                    bottom: 0px;
                    font-size: 14px;
                    color: #666;
                    font-weight: 500;
                    text-align: right;
                    padding-right: 10px;
                }
                .exhibition-swiper-container .swiper-button-prev,
                .exhibition-swiper-container .swiper-button-next {
                    top: -24px;
                    width: 32px;
                    height: 32px;
                    background-color: transparent;
                    border: 1px solid #e5e7eb;
                    border-radius: 50%;
                    color: #333;
                }
                @media (min-width: 768px) {
                    .exhibition-swiper-container .swiper-button-prev,
                    .exhibition-swiper-container .swiper-button-next {
                        top: 50%;
                        background-color: white;
                    }
                }
                .exhibition-swiper-container .swiper-button-prev {
                    right: 48px;
                    left: auto;
                }
                .exhibition-swiper-container .swiper-button-next {
                    right: 8px;
                    left: auto;
                }
                .exhibition-swiper-container .swiper-button-prev:after,
                .exhibition-swiper-container .swiper-button-next:after {
                    font-size: 12px;
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
};

export default SpecialExhibitionBlock;
