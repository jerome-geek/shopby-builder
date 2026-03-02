import { PageSchema } from '@/lib/validators';

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

const TENANT_KEY = 'sb_tenants_v3';
const PAGES_KEY = 'sb_pages_v3';

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
                    publishedSchema: { blocks: [] },
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
