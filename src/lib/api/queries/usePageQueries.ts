import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MockApi, PageData } from '@/lib/mockApi';
import { PageSchema } from '@/lib/validators';
import { api } from '@/lib/api/axios';

export const pageKeys = {
    all: ['pages'] as const,
    list: (tenantId: string) => [...pageKeys.all, tenantId, 'list'] as const,
    detail: (pageId: string) => [...pageKeys.all, 'detail', pageId] as const,
};

// --- Queries ---

export const useGetPagesByTenant = (tenantId: string) => {
    return useQuery({
        queryKey: pageKeys.list(tenantId),
        queryFn: async (): Promise<PageData[]> => {
            MockApi.initMockData(); // 데모 데이터 보장을 위해 삽입
            const data = MockApi.getPagesByTenant(tenantId);
            return data;
        },
        enabled: !!tenantId,
    });
};

export const useGetPage = (pageId?: string) => {
    return useQuery({
        queryKey: pageKeys.detail(pageId!),
        queryFn: async (): Promise<PageData> => {
            MockApi.initMockData(); // 에디터 직진입 시에도 목업 데이터 생성 보장
            // TODO: 추후 api.get(`/pages/${pageId}`) 형태로 대체
            const data = MockApi.getPageById(pageId!);
            if (!data) throw new Error('Page not found');
            return data;
        },
        enabled: !!pageId,
    });
};

// --- Mutations ---

export const useSavePageDraft = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            pageId,
            schema,
        }: {
            pageId: string;
            schema: PageSchema;
        }) => {
            // TODO: api.put(`/pages/${pageId}/draft`, schema) 대체
            MockApi.savePageDraft(pageId, schema);
            return true;
        },
        onSuccess: (_, { pageId }) => {
            queryClient.invalidateQueries({
                queryKey: pageKeys.detail(pageId),
            });
        },
    });
};

export const usePublishPage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (pageId: string) => {
            // TODO: api.post(`/pages/${pageId}/publish`) 혹은 관련 로직 대체
            MockApi.publishPage(pageId);
            return true;
        },
        onSuccess: (_, pageId) => {
            queryClient.invalidateQueries({
                queryKey: pageKeys.detail(pageId),
            });
        },
    });
};

export const useGetHeroBanners = () => {
    return useQuery({
        queryKey: ['heroBanners'],
        queryFn: async () => {
            const data = await api.get('/v1/blocks/hero-banner');
            return data as unknown as any[];
        },
    });
};

export const useGetIconBanners = () => {
    return useQuery({
        queryKey: ['iconBanners'],
        queryFn: async () => {
            const data = await api.get('/v1/blocks/icon-banner');
            return data as unknown as any[];
        },
    });
};

export const useGetDisplayProducts = () => {
    return useQuery({
        queryKey: ['displayProducts'],
        queryFn: async () => {
            const data = await api.get('/v1/products/display');
            return data as unknown as any[];
        },
    });
};
