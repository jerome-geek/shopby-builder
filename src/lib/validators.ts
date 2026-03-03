import { z } from 'zod';

// --- Swiper Options Schema ---
export const SwiperOptionsSchema = z.object({
    autoplay: z
        .union([
            z.boolean(),
            z.object({
                delay: z.number().default(3000),
                disableOnInteraction: z.boolean().default(false),
            }),
        ])
        .optional()
        .default(false),

    loop: z.boolean().default(true),
    effect: z.enum(['slide', 'fade', 'cube', 'coverflow']).default('slide'),

    pagination: z
        .union([
            z.boolean(),
            z.object({
                clickable: z.boolean().default(true),
                type: z
                    .enum(['bullets', 'fraction', 'progressbar'])
                    .default('bullets'),
            }),
        ])
        .optional(),

    navigation: z.boolean().default(false),

    slidesPerView: z.union([z.number(), z.literal('auto')]).default(1),
    spaceBetween: z.number().default(0),

    breakpoints: z.record(z.string(), z.any()).optional(),
});

// --- Hero Banner Schemas ---
export const HeroBannerItemSchema = z.object({
    id: z.string(),
    imageUrl: z.string(),
    altText: z.string().optional(),
    link: z
        .object({
            href: z.string().optional(),
            target: z.enum(['_blank', '_self']).default('_self'),
            rel: z.string().optional(),
        })
        .optional(),
    content: z
        .object({
            title: z.string().optional(),
            titleColor: z.string().default('#000000'),
            description: z.string().optional(),
            descriptionColor: z.string().default('#666666'),
            position: z.enum(['bottom', 'center']).default('bottom'),
        })
        .optional(),
    customData: z.record(z.string(), z.any()).optional(),
});

export const HeroBannerPropsSchema = z.object({
    swiperOptions: SwiperOptionsSchema.optional(),
    items: z.array(HeroBannerItemSchema).optional(),
    bannerGroupCode: z.string().optional(),
});

// --- Base Block Schema ---
export const BlockSchema = z.object({
    id: z.string(),
    type: z.enum([
        'HeroBanner',
        'IconBanner',
        'BannerGrid',
        'ProductList',
        'SpecialExhibition',
        'CategoryNav',
        'Header',
        'Footer',
    ]),
    order: z.number(),
    props: z.record(z.string(), z.any()), // Allow dynamic props, though we can validate against specific component schemas later
    style: z.record(z.string(), z.any()).optional(),
});

export const PageSchemaValidator = z.object({
    blocks: z.array(BlockSchema),
});

export type Block = z.infer<typeof BlockSchema>;
export type PageSchema = z.infer<typeof PageSchemaValidator>;
