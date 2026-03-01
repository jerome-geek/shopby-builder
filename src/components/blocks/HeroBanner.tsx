import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { z } from 'zod';
import { HeroBannerPropsSchema } from '../../lib/validators';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

type HeroBannerProps = z.infer<typeof HeroBannerPropsSchema>;

const HeroBanner: React.FC<{ props: any }> = ({ props }) => {
    // Validate incoming props against our strict schema
    const result = HeroBannerPropsSchema.safeParse(props);

    if (!result.success) {
        console.error('HeroBanner Schema Validation Failed:', result.error);
        return (
            <div className="p-4 bg-red-50 text-red-500 border border-red-200">
                Invalid Banner Data
            </div>
        );
    }

    const { swiperOptions, items, bannerGroupCode } = result.data;

    // TODO: If bannerGroupCode exists, call API to fetch `dynamicItems`
    // For MVP, we will just use the static items passed from the builder.
    const displayItems = items || [];

    if (displayItems.length === 0) {
        return (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                Hero Banner Placeholder
            </div>
        );
    }

    // Map strict Zod config to actual Swiper modules/props
    const modules = [];
    if (swiperOptions?.navigation) modules.push(Navigation);
    if (swiperOptions?.pagination) modules.push(Pagination);
    if (swiperOptions?.autoplay) modules.push(Autoplay);
    if (swiperOptions?.effect === 'fade') modules.push(EffectFade);

    return (
        <div className="w-full relative">
            <Swiper
                modules={modules}
                loop={swiperOptions?.loop ?? true}
                effect={swiperOptions?.effect ?? 'slide'}
                spaceBetween={swiperOptions?.spaceBetween ?? 0}
                slidesPerView={
                    swiperOptions?.slidesPerView === 'auto'
                        ? 'auto'
                        : (swiperOptions?.slidesPerView ?? 1)
                }
                navigation={swiperOptions?.navigation ?? false}
                pagination={
                    swiperOptions?.pagination ? swiperOptions.pagination : false
                }
                autoplay={
                    swiperOptions?.autoplay ? swiperOptions.autoplay : false
                }
                className="w-full h-auto max-h-[600px] aspect-[21/9]"
            >
                {displayItems.map((item) => {
                    const hasContent =
                        item.content?.title || item.content?.description;

                    const slideInner = (
                        <div className="relative w-full h-full overflow-hidden bg-gray-200">
                            <img
                                src={item.imageUrl}
                                alt={item.altText || ''}
                                className="w-full h-full object-cover"
                            />
                            {hasContent && (
                                <div
                                    className={`absolute inset-0 flex flex-col p-8 ${
                                        item.content?.position === 'center'
                                            ? 'items-center justify-center text-center'
                                            : 'items-start justify-end'
                                    }`}
                                >
                                    <div className="bg-white/80 p-6 rounded-lg backdrop-blur-sm max-w-lg">
                                        {item.content?.title && (
                                            <h2
                                                className="text-3xl font-bold mb-2"
                                                style={{
                                                    color: item.content
                                                        .titleColor,
                                                }}
                                            >
                                                {item.content.title}
                                            </h2>
                                        )}
                                        {item.content?.description && (
                                            <p
                                                className="text-lg"
                                                style={{
                                                    color: item.content
                                                        .descriptionColor,
                                                }}
                                            >
                                                {item.content.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );

                    return (
                        <SwiperSlide key={item.id} className="h-full">
                            {item.link?.href ? (
                                <a
                                    href={item.link.href}
                                    target={item.link.target}
                                    rel={item.link.rel}
                                    className="block w-full h-full"
                                >
                                    {slideInner}
                                </a>
                            ) : (
                                slideInner
                            )}
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};

export default HeroBanner;
