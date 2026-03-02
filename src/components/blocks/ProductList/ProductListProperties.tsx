import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBuilderStore } from '@/store/useBuilderStore';

const swiperOptionsSchema = z.object({
    loop: z.boolean().default(false).optional(),
    pagination: z.boolean().default(true).optional(),
    navigation: z.boolean().default(true).optional(),
    slidesPerView: z.number().min(1).max(10).default(5).optional(),
});

const productListSchema = z.object({
    title: z.string().optional(),
    swiperOptions: swiperOptionsSchema.optional(),
});

type ProductListFormData = z.infer<typeof productListSchema>;

export const ProductListProperties: React.FC<{
    blockId: string;
    initialData?: Partial<ProductListFormData>;
}> = ({ blockId, initialData }) => {
    const updateBlockProps = useBuilderStore((state) => state.updateBlockProps);

    const {
        register,
        handleSubmit,
        reset,
        formState: { isDirty },
    } = useForm<ProductListFormData>({
        resolver: zodResolver(productListSchema),
        defaultValues: {
            title: initialData?.title || '상품 진열',
            swiperOptions: {
                loop: false,
                pagination: true,
                navigation: true,
                slidesPerView: 5,
                ...initialData?.swiperOptions,
            },
        },
    });

    useEffect(() => {
        reset({
            title: initialData?.title || '상품 진열',
            swiperOptions: {
                loop: false,
                pagination: true,
                navigation: true,
                slidesPerView: 5,
                ...initialData?.swiperOptions,
            },
        });
    }, [initialData, reset]);

    const onSubmit = (data: ProductListFormData) => {
        updateBlockProps(blockId, data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold mb-3 border-b pb-2">
                    Category Section
                </h3>
                <div className="space-y-3 mt-2">
                    <label className="block text-sm text-gray-700 mb-1">
                        Section Title
                    </label>
                    <input
                        type="text"
                        {...register('title')}
                        className="w-full border rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="입문 난이도 키트 모음"
                    />
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold mb-3 border-b pb-2">
                    Swiper Options
                </h3>
                <div className="space-y-3 mt-2">
                    <label className="flex items-center space-x-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            {...register('swiperOptions.loop')}
                            className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Infinite Loop</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            {...register('swiperOptions.pagination')}
                            className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Show Pagination (Fraction)</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            {...register('swiperOptions.navigation')}
                            className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Show Navigation (Arrows)</span>
                    </label>
                    <div className="pt-2">
                        <label className="block text-sm text-gray-700 mb-1">
                            Slides Per View (Desktop)
                        </label>
                        <input
                            type="number"
                            {...register('swiperOptions.slidesPerView', {
                                valueAsNumber: true,
                            })}
                            className="w-full border rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            min={1}
                            max={10}
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={!isDirty}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded transition-colors"
            >
                Apply Changes
            </button>
        </form>
    );
};
