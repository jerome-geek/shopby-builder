import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBuilderStore } from '../../../store/useBuilderStore';

const heroBannerSchema = z.object({
    swiperOptions: z
        .object({
            loop: z.boolean().default(true),
            pagination: z.boolean().default(true),
            navigation: z.boolean().default(true),
        })
        .default({ loop: true, pagination: true, navigation: true }),
    items: z
        .array(
            z.object({
                id: z.string(),
                imageUrl: z.string().url({ message: 'Valid URL required' }),
                content: z.object({
                    title: z.string().min(1, { message: 'Title is required' }),
                    titleColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, {
                        message: 'Must be a valid hex color',
                    }),
                    position: z.enum(['left', 'center', 'right']),
                }),
            }),
        )
        .min(1, { message: 'At least one slide is required' }),
});

export type HeroBannerFormData = {
    swiperOptions?: {
        loop?: boolean;
        pagination?: boolean;
        navigation?: boolean;
    };
    items: {
        id: string;
        imageUrl: string;
        content: {
            title: string;
            titleColor: string;
            position: 'left' | 'center' | 'right';
        };
    }[];
};

export const HeroBannerProperties: React.FC<{
    blockId: string;
    initialData: any;
}> = ({ blockId, initialData }) => {
    const { updateBlockProps } = useBuilderStore();

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<HeroBannerFormData>({
        resolver: zodResolver(heroBannerSchema),
        defaultValues: initialData,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

    // 외부에서 다른 블록 선택 시 폼 리셋
    useEffect(() => {
        reset(initialData);
    }, [blockId, initialData, reset]);

    const onFormSubmit = (data: HeroBannerFormData) => {
        // 스토어 업데이트
        updateBlockProps(blockId, data);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 pb-2 border-b">
                    Carousel Settings
                </h3>

                <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            {...register('swiperOptions.loop')}
                            className="form-checkbox h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            Infinite Loop
                        </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            {...register('swiperOptions.pagination')}
                            className="form-checkbox h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            Display Pagination
                        </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            {...register('swiperOptions.navigation')}
                            className="form-checkbox h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            Display Navigation
                        </span>
                    </label>
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition"
            >
                Apply Changes
            </button>
        </form>
    );
};
