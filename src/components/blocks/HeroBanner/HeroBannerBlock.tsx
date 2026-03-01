import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useGetHeroBanners } from '../../../lib/api/queries/usePageQueries';

export interface HeroBannerProps {
    swiperOptions?: {
        loop?: boolean;
        pagination?: boolean;
        navigation?: boolean;
    };
    items?: Array<any>;
}

const HeroBannerBlock: React.FC<HeroBannerProps> = ({ swiperOptions }) => {
    const { data: items, isLoading, isError } = useGetHeroBanners();

    // 옵션에 따라 필요한 모듈만 주입 (Navigation, Pagination 등)
    const activeModules = useMemo(() => {
        const modules = [Autoplay];
        if (swiperOptions?.navigation) modules.push(Navigation);
        if (swiperOptions?.pagination) modules.push(Pagination);
        return modules;
    }, [swiperOptions]);

    if (isLoading) {
        return (
            <div className="w-full h-[300px] bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
                Loading Banners...
            </div>
        );
    }

    if (isError || !items || items.length === 0) {
        return (
            <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center text-gray-500">
                No Banners Available
            </div>
        );
    }

    return (
        <div
            className="w-full relative bg-gray-200"
            style={{ minHeight: '300px' }}
        >
            <Swiper
                key={JSON.stringify(swiperOptions)}
                modules={activeModules}
                loop={swiperOptions?.loop ?? true}
                navigation={swiperOptions?.navigation ?? true}
                pagination={
                    swiperOptions?.pagination ? { clickable: true } : false
                }
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="w-full h-full absolute inset-0"
            >
                {items.map((item: any) => (
                    <SwiperSlide key={item.id}>
                        <div className="w-full h-full relative">
                            <img
                                src={item.imageUrl}
                                alt={item.content?.title || 'Banner'}
                                className="w-full h-full object-cover"
                            />
                            {/* position 속성(left/center/right)에 따른 플렉스 정렬 */}
                            <div
                                className={`absolute inset-0 flex items-center bg-black bg-opacity-30 ${
                                    item.content?.position === 'left'
                                        ? 'justify-start px-20'
                                        : item.content?.position === 'right'
                                          ? 'justify-end px-20'
                                          : 'justify-center'
                                }`}
                            >
                                <h2
                                    style={{
                                        color:
                                            item.content?.titleColor || '#fff',
                                    }}
                                    className="text-4xl font-bold"
                                >
                                    {item.content?.title}
                                </h2>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroBannerBlock;
