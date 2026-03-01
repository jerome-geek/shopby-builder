import { http, HttpResponse } from 'msw';
import { api } from '../lib/api/axios';

export const handlers = [
    // HeroBanner 데이터 조회 API Mock (절대 경로로 지정해야 axios 3000번 포트를 정확히 가로챔)
    http.get(`${api.defaults.baseURL}/v1/blocks/hero-banner`, () => {
        return HttpResponse.json([
            {
                id: 'banner-1',
                imageUrl:
                    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
                content: {
                    title: 'Spring Collection Launch',
                    titleColor: '#ffffff',
                    position: 'center',
                },
            },
            {
                id: 'banner-2',
                imageUrl:
                    'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
                content: {
                    title: 'New Arrivals',
                    titleColor: '#000000',
                    position: 'left',
                },
            },
        ]);
    }),
];
