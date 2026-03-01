import { PageSchema } from './validators';

export interface Tenant {
    id: string;
    subdomain: string;
    mallId: string;
    theme: Record<string, any>;
}

export interface PageData {
    id: string;
    tenantId: string;
    slug: string;
    pageType: string;
    title: string;
    isEditable: boolean; // Indicates if this page can be edited in the builder
    draftSchema: PageSchema;
    publishedSchema: PageSchema | null;
}

const TENANT_KEY = 'sb_tenants_v2';
const PAGES_KEY = 'sb_pages_v2';

// Memory abstraction over localStorage
export const MockApi = {
    getTenant(subdomain: string): Tenant | null {
        const tenants = JSON.parse(localStorage.getItem(TENANT_KEY) || '[]');
        return tenants.find((t: Tenant) => t.subdomain === subdomain) || null;
    },
    createTenant(tenant: Tenant) {
        const tenants = JSON.parse(localStorage.getItem(TENANT_KEY) || '[]');
        tenants.push(tenant);
        localStorage.setItem(TENANT_KEY, JSON.stringify(tenants));
    },
    getPage(tenantId: string, slug: string): PageData | null {
        const pages = JSON.parse(localStorage.getItem(PAGES_KEY) || '[]');
        return (
            pages.find(
                (p: PageData) => p.tenantId === tenantId && p.slug === slug,
            ) || null
        );
    },
    getPageById(pageId: string): PageData | null {
        const pages = JSON.parse(localStorage.getItem(PAGES_KEY) || '[]');
        return pages.find((p: PageData) => p.id === pageId) || null;
    },
    getPagesByTenant(tenantId: string): PageData[] {
        const pages = JSON.parse(localStorage.getItem(PAGES_KEY) || '[]');
        return pages.filter((p: PageData) => p.tenantId === tenantId);
    },
    savePageDraft(pageId: string, draftSchema: PageSchema) {
        const pages = JSON.parse(localStorage.getItem(PAGES_KEY) || '[]');
        const pageIndex = pages.findIndex((p: PageData) => p.id === pageId);
        if (pageIndex > -1) {
            pages[pageIndex].draftSchema = draftSchema;
            localStorage.setItem(PAGES_KEY, JSON.stringify(pages));
        }
    },
    publishPage(pageId: string) {
        const pages = JSON.parse(localStorage.getItem(PAGES_KEY) || '[]');
        const pageIndex = pages.findIndex((p: PageData) => p.id === pageId);
        if (pageIndex > -1) {
            pages[pageIndex].publishedSchema = pages[pageIndex].draftSchema;
            localStorage.setItem(PAGES_KEY, JSON.stringify(pages));
        }
    },
    initMockData() {
        if (!localStorage.getItem(TENANT_KEY)) {
            const demoTenant: Tenant = {
                id: 't-1',
                subdomain: 'demo',
                mallId: 'demo-mall-id',
                theme: {},
            };
            const demoPages: PageData[] = [
                {
                    id: 'p-1',
                    tenantId: 't-1',
                    slug: 'home',
                    pageType: 'home',
                    title: '메인 홈',
                    isEditable: true,
                    draftSchema: { blocks: [] },
                    publishedSchema: {
                        blocks: [
                            {
                                id: 'b-1',
                                type: 'Header',
                                order: 0,
                                props: { title: 'Demo Store' },
                            },
                            {
                                id: 'b-2',
                                type: 'HeroBanner',
                                order: 1,
                                props: {
                                    swiperOptions: {
                                        autoplay: {
                                            delay: 3000,
                                            disableOnInteraction: false,
                                        },
                                        loop: true,
                                        pagination: { clickable: true },
                                        navigation: true,
                                    },
                                    items: [
                                        {
                                            id: 'slide-1',
                                            imageUrl:
                                                'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
                                            altText: 'Sale Banner',
                                            link: { href: '#' },
                                            content: {
                                                title: '2026 Spring Collection',
                                                titleColor: '#ffffff',
                                                description:
                                                    'Discover the new season styles',
                                                descriptionColor: '#eeeeee',
                                                position: 'center',
                                            },
                                        },
                                        {
                                            id: 'slide-2',
                                            imageUrl:
                                                'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
                                            altText: 'New Arrivals',
                                            link: { href: '#' },
                                            content: {
                                                title: 'New Arrivals',
                                                titleColor: '#ffffff',
                                                description:
                                                    'Check out our latest products',
                                                descriptionColor: '#eeeeee',
                                                position: 'bottom',
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
                {
                    id: 'p-2',
                    tenantId: 't-1',
                    slug: 'products',
                    pageType: 'productList',
                    title: '상품 목록 (기본)',
                    isEditable: false,
                    draftSchema: { blocks: [] },
                    publishedSchema: null,
                },
                {
                    id: 'p-3',
                    tenantId: 't-1',
                    slug: 'cart',
                    pageType: 'cart',
                    title: '장바구니 (기본)',
                    isEditable: false,
                    draftSchema: { blocks: [] },
                    publishedSchema: null,
                },
            ];
            localStorage.setItem(TENANT_KEY, JSON.stringify([demoTenant]));
            localStorage.setItem(PAGES_KEY, JSON.stringify(demoPages));
        }
    },
};
