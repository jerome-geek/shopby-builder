import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// 환경 변수 기반으로 API Base URL을 설정
const API_BASE_URL = 'http://localhost:3000/api'; // 실제 운영 시 import.meta.env 등으로 변경 필요

// --- [Admin API Instance (Protected)] ---
export const adminApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

adminApi.interceptors.request.use(
    (config) => {
        // useAuthStore의 토큰을 Authorization 헤더로 주입
        const { token } = useAuthStore.getState();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

adminApi.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // 401 Unauthorized 발생 시 로그인 페이지 강제 로테이션
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        console.error(
            'Admin API Error:',
            error?.response?.data || error.message,
        );
        return Promise.reject(error);
    },
);

// --- [Client API Instance (Public)] ---
export const clientApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

clientApi.interceptors.request.use(
    (config) => {
        // 스토어프론트 URL 진입 상태에서 동기적으로 tenantId 직접 추출 (예: /t-1/home)
        if (typeof window !== 'undefined') {
            const pathSegments = window.location.pathname.split('/');
            const maybeTenantId = pathSegments[1];
            if (maybeTenantId && maybeTenantId.startsWith('t-')) {
                config.headers['X-Tenant-Id'] = maybeTenantId; // 헤더 주입
            }
        }
        return config;
    },
    (error) => Promise.reject(error),
);

clientApi.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error(
            'Client API Error:',
            error?.response?.data || error.message,
        );
        return Promise.reject(error);
    },
);
