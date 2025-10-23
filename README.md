# 벤치마킹:

[YikYak](https://yikyak.com/)

![image.png](attachment:f53049e4-318c-4131-8d69-972088c77a08:image.png)

![image.png](attachment:d0253378-f669-4a70-86e3-a151daf1d29a:image.png)

# 중요 링크

## Figma Make

https://www.figma.com/make/lcSmW38icOnE58kVMFQawm/YikYak-%EC%A7%81%EC%9E%A5%EC%9D%B8-%EB%B2%84%EC%A0%84-%EB%94%94%EC%9E%90%EC%9D%B8?node-id=0-1&t=9e7iX5nCjsbUMioP-1

## Supabase

https://supabase.com/dashboard/project/wfhvytltpqdxofihsazd

## DB

[DB 테이블 ](https://www.notion.so/DB-29587aac604a80a8b94ae9c2357e81fa?pvs=21)

## API 명세서

[API 명세서](https://www.notion.so/API-29587aac604a80dc8f13ceb0deee27e7?pvs=21)

# 버전

- npm
    
    ```jsx
    # Download and install nvm:
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    
    # in lieu of restarting the shell
    \. "$HOME/.nvm/nvm.sh"
    
    # Download and install Node.js:
    nvm install 22
    
    # Verify the Node.js version:
    node -v # Should print "v22.21.0".
    
    # Verify npm version:
    npm -v # Should print "10.9.4".
    ```
    
- Next.js 프론트 & 백

# To do

- [ ]  기능 분담
- [x]  아이디어 추가하기
- [x]  기술 스택 정하기

# 기획 배경

사내 게시판을 만들자는게 1차 목표. 
익명성을 보장하면 많이 쓰지 않을까?
회사의 규모가 작다면 익명성을 보장해도 쓰기 쉽지 않지 않을까?
그럼 회사 말고 그 주변을 타겟층으로 잡으면 되겠다! 
5km 반경 안에있는 사람들 메세지를 볼 수 있다! 

직장인도 에타가 필요해.


# MVP (1차 목표) 요구사항

- 사용자 위치 확인
    - 브라우저에서 위치 정보 가져옴
    - **5km 이내 사용자의 메세지만 확인 가능하도록 하려면**
- 익명 사용자 특정
    - 로컬스토리지 anon_id 기반 익명 토큰 방식
- 메세지 CRUD
    - 글자 수 제한
- 메세지 리스트
    - 인기순, 최신순 정렬
    - 무한 스크롤

# 확장성

- 검색 기능
- 댓글 기능 ( 꼭 필요할까?)
- 회사 이메일이나 사원증 인증
    - 회사의 위치를 인증할 수 있는 방법을 찾아야 할 것 같다.

# 메인 기능

1. 사용자가 글을 작성할 수 있다
2. 사용자가 글을 좋아요 누를 수 있다
3. 사용자가 자신이 작성한 글을 확인할 수 있다

# 기술 스택

| 역할 | 추천 기술 | 이유 |
| --- | --- | --- |
| **프레임워크 (전체 구조)** | ✅ **Next.js 15 (App Router)** | 프론트+백엔드 통합 구조 / SSR & CSR 혼용 / API 라우트 내장 → MVP용으로 완벽 |
| **언어** | ✅ **TypeScript** | 타입 안정성 + 에러 방지 / 대규모 확장 대비 |
| **DB** | ✅ **PostgreSQL (Firebase)**  | 로컬 개발 빠름 / 나중에 클라우드 전환 쉬움 |
| **~~ORM~~** | ~~✅ **Prisma**~~ | 모델 선언 직관적 / 마이그레이션 자동 / TypeScript 친화적 |
| **UI 컴포넌트** | ✅ **TailwindCSS** | 빠른 UI 개발 / 반응형 / MVP 속도 최적 |
| **데이터 요청 관리** | ✅ **React Query (TanStack Query)** | 무한 스크롤·캐싱·로딩 상태 관리 자동화 |
| **무한 스크롤 구현** | ✅ **IntersectionObserver API** | 프론트엔드에서 스크롤이 바닥(혹은 sentinel 요소)에 닿을 때 다음 페이지 요청을 트리거
브라우저 네이티브 / React Query와 결합 쉬움 |
| **위치 정보 가져오기** | ✅ **Navigator.geolocation** | 브라우저 내장 / 별도 API 불필요 |
| **인기순/최신순 정렬** | ✅ **Prisma 정렬 쿼리 (`orderBy`)** | DB단에서 바로 정렬 가능 / 빠름 |
| **배포** | ✅ **Vercel** | Next.js 완전 호환 / 무료 / HTTPS 자동 |

## 프론트엔드D

- Next.js
- TS
- Tailwind CSS
- React Query
- IntersectionObserver API

## 백엔드

- IntersectionObserer API
- Navigator.geolocation
- Prisma 정렬 쿼리
- Vercel

## DB

- Supabase
- PostgreSQL
    - 반경 5km 이내 검색 쿼리

# 유저 흐름

1. 사이트 접속
    1. 위치 기반으로 해당 지역 게시판으로 자동 접속
2. 글 작성 
3. 글 좋아요 누르기 (답글 달기, 공유하기) 
4. 마이페이지
    1. 내가 작성한 글 확인