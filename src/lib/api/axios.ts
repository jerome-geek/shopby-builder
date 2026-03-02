import axios from 'axios';

// 환경 변수 기반으로 API Base URL을 설정합니다.
// TODO: 실제 서버 연결 시 환경변수(VITE_API_BASE_URL) 등으로 치환
const API_BASE_URL = 'http://localhost:3000/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
        // 토큰 등 공통 헤더 추가 필요 시 여기에 작성
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// 응답 인터셉터
api.interceptors.response.use(
    (response) => {
        return response.data; // 서버 응답 구조에 맞춰 data만 축출
    },
    (error) => {
        // 에러 공통 처리 레이어 (토큰 만료 처리, 에러 토스트 등)
        console.error('API Error:', error?.response?.data || error.message);
        return Promise.reject(error);
    },
);
