import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Service Worker 인스턴스 생성 및 리퀘스트 핸들러 할당
export const worker = setupWorker(...handlers);
