# Shopby Builder - API Layer Architecture TODO

## 배경

- 상점(클라이언트) 환경과 어드민(빌더) 환경의 인증과 엔드포인트가 다름.
- **클라이언트 (스토어프론트)**: 토큰 대신 `X-Tenant-Id`, `X-Client-Id` 기반ের public 데이터 액세스 필요
- **어드민 (빌더/대시보드)**: 사용자 인증 토큰(`Authorization: Bearer ...`) 기반의 protected API 액세스 필요
- 백엔드(서버) 레이어에서 직접 설정/주입하는 방식 대신 분리된 정적 웹환경(Frontend)에서 처리 필요.

## 해결 방향

Axios 인스턴스를 용도에 따라 2개로 분리한다. 클라이언트 식별자는 API 비동기 의존성(초기 로딩 저하)을 최소화하기 위해 **URL이나 라우터 파라미터에서 추출하여 동기화**한다.

## 작업 목록

- [ ] `src/lib/api/axios.ts` 설정 파일에서 `axios` 인스턴스 분리 명명
    - 기존 `api` 인스턴스를 **`adminApi`** 와 **`clientApi`** 로 역할 분리
- [ ] **어드민 인스턴스 (`adminApi`) 설정**
    - 요청 인터셉터: `useAuthStore`의 토큰을 `Authorization` 헤더로 주입.
    - 응답 인터셉터: `401 Unauthorized` 발생 시 로그인 페이지 `/login` 강제 로테이션.
- [ ] **클라이언트 인스턴스 (`clientApi`) 설정**
    - 스토어프론트용 (예: `/t-1/home` 같은 URL 진입 상태).
    - 요청 인터셉터: `window.location.pathname` 등에서 동기적으로 `tenantId` (ex: `t-1`)를 직접 추출하여 헤더 `X-Tenant-Id`에 세팅.
- [ ] React Query 훅 연결 변경 (`src/lib/api/queries/usePageQueries.ts`)
    - 어드민 동작(`useSavePageDraft`, `usePublishPage`)은 `adminApi`를 바라보게 수정.
    - 클라이언트 조회 정보(`useGetSpecialExhibition`, `useGetDisplayProducts` 등)는 `clientApi`를 바라보게 수정.
- [ ] 전체 빌드 호환성 점검
    - 백엔드 없이 프론트엔드 라우트만으로 `msw` 환경과 Production 빌드가 이중화 없이 안정적으로 매핑되는지 점검.
