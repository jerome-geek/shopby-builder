import { http, HttpResponse } from 'msw';
import { api } from '@/lib/api/axios';

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

    // IconBanner 데이터 조회 API Mock
    http.get(`${api.defaults.baseURL}/v1/blocks/icon-banner`, () => {
        return HttpResponse.json([
            {
                id: 'icon-1',
                imageUrl:
                    'https://cdn-icons-png.flaticon.com/512/3144/3144456.png',
                title: '베스트',
            },
            {
                id: 'icon-2',
                imageUrl:
                    'https://cdn-icons-png.flaticon.com/512/3144/3144458.png',
                title: '홈&리빙',
            },
            {
                id: 'icon-3',
                imageUrl:
                    'https://cdn-icons-png.flaticon.com/512/3144/3144460.png',
                title: '뷰티',
            },
            {
                id: 'icon-4',
                imageUrl:
                    'https://cdn-icons-png.flaticon.com/512/3144/3144462.png',
                title: '의류',
            },
            {
                id: 'icon-5',
                imageUrl:
                    'https://cdn-icons-png.flaticon.com/512/3144/3144464.png',
                title: '액세서리',
            },
            {
                id: 'icon-6',
                imageUrl:
                    'https://cdn-icons-png.flaticon.com/512/3144/3144466.png',
                title: '공예',
            },
            {
                id: 'icon-7',
                imageUrl:
                    'https://cdn-icons-png.flaticon.com/512/3144/3144468.png',
                title: '푸드',
            },
            {
                id: 'icon-8',
                imageUrl:
                    'https://cdn-icons-png.flaticon.com/512/3144/3144470.png',
                title: '취미',
            },
        ]);
    }),

    // 상품 진열 데이터 조회 API Mock
    http.get(`${api.defaults.baseURL}/v1/products/display`, () => {
        return HttpResponse.json([
            {
                id: 'prod-1',
                brand: '한아조',
                name: '퍼그램 박스 200g',
                imageUrl:
                    'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3',
                price: 26000,
                discountRate: 0,
                badges: ['입문', '무료배송'],
            },
            {
                id: 'prod-2',
                brand: '헤비츠',
                name: '5350 프릴 노트',
                imageUrl:
                    'https://images.unsplash.com/photo-1544816155-12df9643f363',
                price: 39000,
                discountRate: 20,
                discountedPrice: 31200,
                badges: ['입문', '무료배송'],
            },
            {
                id: 'prod-3',
                brand: '민민',
                name: 'BBogle Pouch Candy (2Sizes)',
                imageUrl:
                    'https://images.unsplash.com/photo-1584916201218-f4242ceb4809',
                price: 20000,
                discountRate: 0,
                badges: ['입문'],
            },
            {
                id: 'prod-4',
                brand: '붐스토리',
                name: '핑키바삭 막대과자 만들기세트 DIY 수제 초콜릿 키트 선물',
                imageUrl:
                    'https://images.unsplash.com/photo-1514845994104-1be22149278b',
                price: 29500,
                discountRate: 46,
                discountedPrice: 15920,
                badges: ['입문', '무료배송'],
            },
            {
                id: 'prod-5',
                brand: '쎄비',
                name: '미스티 퍼지백(미스티 3볼 + PDF 도안 + 전체영상)',
                imageUrl:
                    'https://images.unsplash.com/photo-1584916201218-f4242ceb4809',
                price: 30000,
                discountRate: 10,
                discountedPrice: 27000,
                badges: ['입문', '무료배송'],
            },
            {
                id: 'prod-6',
                brand: '보름달 김치',
                name: '전통방식 그대로 매일 김장하는 보름달 배추 백김치',
                imageUrl:
                    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
                price: 28800,
                discountRate: 0,
                badges: ['입문'],
            },
        ]);
    }),
];
