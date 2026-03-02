import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useGetIconBanners } from '@/lib/api/queries/usePageQueries';

export interface IconBannerProps {
    swiperOptions?: {
        loop?: boolean;
        pagination?: boolean;
        navigation?: boolean;
        slidesPerView?: number;
    };
    items?: Array<any>;
}

const IconBannerBlock: React.FC<IconBannerProps> = ({ swiperOptions }) => {
    const { data: items, isLoading, isError } = useGetIconBanners();

    const activeModules = useMemo(() => {
        const modules = [];
        if (swiperOptions?.navigation) modules.push(Navigation);
        if (swiperOptions?.pagination) modules.push(Pagination);
        return modules;
    }, [swiperOptions]);

    if (isLoading) {
        return (
            <div className="w-full h-[150px] bg-gray-50 animate-pulse flex items-center justify-center text-gray-400 border rounded">
                Loading Icon Banners...
            </div>
        );
    }

    if (isError || !items || items.length === 0) {
        return (
            <div className="w-full h-[150px] bg-gray-100 flex items-center justify-center text-gray-500 border rounded">
                No Icons Available
            </div>
        );
    }

    return (
        <div className="w-full bg-white py-6" style={{ minHeight: '150px' }}>
            <Swiper
                key={JSON.stringify(swiperOptions)}
                modules={activeModules}
                loop={swiperOptions?.loop ?? false}
                navigation={swiperOptions?.navigation ?? true}
                pagination={
                    swiperOptions?.pagination ? { clickable: true } : false
                }
                slidesPerView={swiperOptions?.slidesPerView ?? 6}
                spaceBetween={16}
                breakpoints={{
                    320: { slidesPerView: 3 },
                    640: { slidesPerView: 5 },
                    1024: { slidesPerView: swiperOptions?.slidesPerView ?? 6 },
                }}
                className="w-full px-8"
            >
                {items.map((item: any) => (
                    <SwiperSlide key={item.id}>
                        <div className="flex flex-col items-center justify-center space-y-3 cursor-pointer group">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden transition-transform group-hover:scale-105">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-black text-center">
                                {item.title}
                            </span>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default IconBannerBlock;
