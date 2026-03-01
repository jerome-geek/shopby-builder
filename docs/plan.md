# ShopBy 헤드리스 웹빌더 프로젝트 기획서

작성일: 2026-02-27
목적: ShopBy API 기반 헤드리스 쇼핑몰을 비개발자도 쉽게 구축할 수 있는 웹빌더 SaaS 개발

## 1. 프로젝트 개요

**배경**
ShopBy 솔루션을 이용한 헤드리스 쇼핑몰 개발은 API 연동 과정이 번거롭고 개발 지식이 없는 일반 사용자가 직접 운영하기 어렵다. 이를 해결하기 위해 ShopBy API를 기반으로 한 웹빌더를 개발한다.

**목표**

- 비개발자(일반 쇼핑몰 운영자)가 코드 없이 ShopBy 기반 쇼핑몰을 직접 구축하고 운영할 수 있도록 한다.
- 배포, 서버, 인프라 등의 개념을 사용자에게 완전히 숨긴다.
- 베타버전 빠른 검증을 최우선 목표로 한다.

**타겟 사용자**
에이전시가 아닌 일반 쇼핑몰 운영자 (비개발자)

---

## 2. 핵심 아키텍처 결정

**선택한 방식: 멀티테넌트 런타임 SaaS (방법 3)**
플랫폼 서버 하나가 모든 고객의 쇼핑몰을 렌더링하는 구조.

```text
사용자 요청 (shop.고객A.com)
    ↓
도메인으로 테넌트 식별 (Middleware - URL Rewrite)
    ↓
해당 테넌트의 publishedSchema 조회 (DB + ISR 캐싱)
    ↓
블록 렌더링 + ShopBy API 직접 호출 (서버 컴포넌트)
    ↓
페이지 응답
```

**다른 방식과 비교 (참고)**

- **방법 1 (SaaS 완전 호스팅):** 방법 3과 유사하나 역할 구분이 불명확.
- **방법 2 (정적 사이트 SSG):** 빌드 시간이 수 시간에 달하고 신상품 추가 시 전체 재빌드가 필요하며, 실시간 SEO 처리가 불가하여 **제외**.
- **방법 3 (멀티테넌트 런타임):** 서버 하나에서 스키마 기반 렌더링 (✅ **선택**)

---

## 3. 기술 스택

**프레임워크: Next.js 단일 구조 (App Router 필수)**

- **선택 이유:** ShopBy API를 실시간 호출하는 Storefront SSR과 API Route를 하나로 통합하여 초기 개발 속도를 극대화하고, 관리 포인트를 1개로 줄이기 위함.

**전체 스택**

- **프론트엔드:** Next.js (App Router) + TypeScript + Tailwind CSS
- **에디터 UI:** dnd-kit (드래그앤드롭), Radix UI (컴포넌트)
- **DB:** SQLite (로컬) → PostgreSQL (프로덕션)
- **ORM:** Prisma
- **Schema 검증:** Zod (DB JSON 안정성 보장)
- **배포:** Vercel (미들웨어 활용 최적화) 또는 단일 서버 + 와일드카드 DNS

---

## 4. 사용자 플로우

```text
회원가입
  → ShopBy 몰 연결 (mallId, API키 입력 - DB 저장 시 양방향 암호화 필수)
  → 빌더에서 페이지 편집
  → 저장 / 퍼블리시 버튼 클릭
  → 내 쇼핑몰에 즉시 반영
```

_사용자에게 배포, 서버, 빌드라는 개념이 보이지 않아야 한다._

---

## 5. DB 스키마 (Prisma)

로컬 개발은 SQLite + Prisma로 시작. 추후 PostgreSQL 마이그레이션을 고려.

```prisma
model Tenant {
  id           String   @id @default(cuid())
  subdomain    String   @unique           // abc.yourplatform.com
  customDomain String?  @unique           // www.abc.com (나중에 추가)
  mallId       String                     // ShopBy mallId
  apiKey       String                     // 양방향 암호화 필수로 저장해야 함 (@noble/ciphers 등 활용)
  theme        Json     @default("{}")    // 색상, 폰트 등
  createdAt    DateTime @default(now())

  pages        Page[]
}

model Page {
  id              String    @id @default(cuid())
  tenantId        String
  slug            String                  // "/", "/products" 등
  pageType        String                  // home | category | product | cart | mypage
  title           String
  draftSchema     Json      @default("{\"blocks\":[]}") // 편집 중 버전
  publishedSchema Json?                   // 라이브 버전 (null이면 미퍼블리시)
  publishedAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  tenant          Tenant    @relation(fields: [tenantId], references: [id])

  @@unique([tenantId, slug])
}
```

_핵심: `draftSchema`와 `publishedSchema`를 분리하여 편집 중 라이브 반영 사고 방지._

---

## 6. 페이지 스키마 구조 & 안전성 (Zod)

페이지를 JSON으로 표현하는 것이 빌더의 핵심. 에디터 버그로 런타임 에러가 발생하지 않도록 **Zod**로 엄격하게 검증한다.

**Zod 스키마 예시 (lib/validators.ts)**

```typescript
import { z } from 'zod';

export const BlockSchema = z.object({
    id: z.string(),
    type: z.enum([
        'BannerSlider',
        'ProductList',
        'CategoryNav',
        'Header',
        'Footer',
    ]),
    order: z.number(),
    props: z.record(z.any()),
    style: z.record(z.any()).optional(),
});

export const PageSchemaValidator = z.object({
    blocks: z.array(BlockSchema),
});
```

**MVP 블록 타입 목록 (우선순위 순)**
| 블록 타입 | ShopBy API | 설명 |
| :--- | :--- | :--- |
| **BannerSlider** | - | 이미지 슬라이더 배너 |
| **BannerGrid** | - | 그리드 배너 |
| **ProductList** | `GET /products` | 상품 목록 |
| **CategoryNav** | `GET /categories` | 카테고리 메뉴 |
| **Header/Footer** | - | 공통 헤더 및 푸터 |

---

## 7. 멀티테넌트 라우팅 최적화 (Next.js Middleware)

`x-tenant-id` 헤더 대신 Vercel 표준 방식인 `NextResponse.rewrite`를 사용하여 동적 라우팅으로 치환.

```typescript
// middleware.ts
import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host')!;

    // 테넌트 식별
    const currentHost =
        process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
            ? hostname.replace(`.yourplatform.com`, '')
            : hostname.replace(`.localhost:3000`, '');

    // /app/[tenantId]/(storefront)/[...slug]/page.tsx 로 내부적 매핑
    return NextResponse.rewrite(
        new URL(`/${currentHost}${url.pathname}`, request.url),
    );
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 8. 렌더링 및 캐싱 전략 (병목 방지)

**1) SSR 환경에서의 직접 호출 (안티패턴 제거)**

- 서버 컴포넌트 렌더링 시 `/api/shopby`를 `fetch()`로 프록시 호출하지 않고, 내부 유틸 함수로 ShopBy API를 **직접 호출**한다.
- 클라이언트(브라우저)에서 추가 페칭(CSR)이 필요할 때만 `/api/shopby` 프록시를 사용한다.

**2) 스키마 캐싱 (ISR)**
DB 부하를 막기 위해 `unstable_cache`를 적용한다.

```typescript
// lib/cache.ts
import { unstable_cache } from 'next/cache';

export const getCachedPageSchema = unstable_cache(
    async (tenantId: string, slug: string) =>
        prisma.page.findUnique({
            where: { tenantId_slug: { tenantId, slug } },
        }),
    ['page-schema'],
    { tags: ['page'] },
);

// api/pages/[pageId]/publish/route.ts
// 퍼블리시 시점에 전세계 캐시 초기화
import { revalidateTag } from 'next/cache';
await updatePublishedSchema(pageId, draftSchema);
revalidateTag('page');
```

---

## 9. 프로젝트 디렉토리 구조

```text
shopby-builder/
├── prisma/
│   ├── schema.prisma                  # DB 모델 정의
│   └── seed.ts                        # 로컬 테스트용 더미 스키마 데이터 (매우 중요)
│
├── src/
│   ├── app/
│   │   ├── [tenantId]/                # [NEW] 미들웨어 rewrite 대상
│   │   │   └── (storefront)/          # 실제 쇼핑몰 페이지 (서버 컴포넌트 위주)
│   │   │       └── [...slug]/
│   │   │           └── page.tsx
│   │   ├── (builder)/                 # 빌더 에디터 (SPA 동작)
│   │   │   ├── dashboard/page.tsx
│   │   │   └── editor/[pageId]/page.tsx
│   │   └── api/
│   │       ├── pages/...              # 저장, 퍼블리시 엔드포인트
│   │       └── shopby/[...path]/route.ts # CSR 프록시 호출용
│   ├── components/
│   │   ├── blocks/                    # 실제 화면에 그려질 블록들
│   │   │   ├── BlockRenderer.tsx
│   │   │   └── ProductList.tsx
│   │   └── editor/                    # 에디터 전용 컴포넌트
│   ├── lib/
│   │   ├── prisma.ts                  # DB
│   │   ├── shopby.ts                  # ShopBy API 호출 서버 모듈 (암호화 복호화 포함)
│   │   ├── cache.ts                   # Next.js 캐싱 래퍼
│   │   └── validators.ts              # Zod 스키마 검증기
├── middleware.ts
└── package.json
```

---

## 10. 빠른 MVP 출시를 위한 팀 개발 순서 (행동 지침)

MVP(1단계) 목표: **"도메인 접속 시 JSON 기반으로 렌더링된 메인 페이지 표시 + 샵바이 상품 목록 연동"**

**1단계: 기반 공사 (1-2 Days) - Backend & Infra**

1.  명령어로 Next.js 빈 프로젝트 + Prisma 연동.
2.  `middleware.ts` 작성 및 `app/[tenantId]/(storefront)/[...slug]/page.tsx` 라우팅 폴더 구조 세팅.
3.  `prisma/schema.prisma` 작성 (Tenant, Page 모델). API Key 암/복호화 유틸(`noble/ciphers` 권장) 세팅.
4.  **[가장 중요]** DB Seed 데이터 작성: 강제로 `{"blocks": [{"type":"BannerSlider",...}]}` JSON을 `publishedSchema`에 박아넣고 테넌트 1개 생성.

**2단계: 렌더러 구현 (2-3 Days) - Frontend (Storefront)**
_이 단계에서는 에디터 UI를 절대 개발하지 않음! Seed로 들어간 DB 값을 그려내는 게 목표._

1.  `[...slug]/page.tsx` 에서 `getCachedPageSchema` 로 DB 값 가져오기 작성.
2.  JSON 파싱 후 `BlockRenderer` 렌더링 골격 잡기 (Zod 검증 적용).
3.  `BannerSlider`, `ProductList` (ShopBy SSR 연동) 블록 컴포넌트 완성.
    - 완성 기준: 로컬호스트를 `test.localhost:3000` 으로 접속했을 때 디자인된 샵바이 페이지가 띄워져야 함.

**3단계: 빌더 에디터 구현 (3-5 Days) - Frontend (Builder)**

1.  `/dashboard` 페이지: 내 페이지 목록 조회 기능.
2.  `/editor/[pageId]` 골격: 좌측 패널(블록 추가), 중앙(미리보기 캔버스), 우측 패널(속성 수정).
3.  dnd-kit 연동하여 중앙 캔버스에서 블록 드래그 앤 드롭 정렬.
4.  우측 패널 폼 연동하여 `draftSchema` JSON 상태 업데이트 및 "저장" 기능 구현.

**4단계: 연동 및 배포 (1-2 Days) - Fullstack**

1.  "퍼블리시" 버튼 API 작성 (`draftSchema`를 `publishedSchema`로 복사 후 캐시 무효화 `revalidateTag`).
2.  Vercel 배포 및 와일드카드 서브도메인 도메인 DNS 설정 붙이기.
3.  실제 동작(회원가입 -> 앱 빌드 -> 서브도메인 접속 테스트) QA.

---

## 11. 요약 및 주의사항

- **Next.js App Router 특성 이해:** SSR 병목을 줄이기 위해 `fetch` 태그 기반의 세밀한 캐싱을 필수적으로 적용할 것.
- **에디터보다 렌더러 우선:** 에디터를 먼저 만들면 JSON 구조가 수시로 바뀌어 삽질이 심해진다. 완벽한 하드코딩 JSON 하나를 DB Seed로 넣고, 렌더러가 그걸 화면에 완벽하게 그려내는 것부터 작업해야 한다.
