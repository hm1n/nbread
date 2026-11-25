# 엔빵 v2

금융 앱의 입금 알림을 바탕으로 구독료 납부 확인을 돕는 엔빵의 새 버전이에요.

## 시작하기

Node.js 22와 Docker가 필요해요.

```bash
npm install
cp .env.example .env.local
npm run supabase:start
npm run supabase:reset
npm run dev
```

로컬 Supabase를 시작하면 출력되는 공개 키와 서버 전용 키를 `.env.local`에 넣어요. 서버 전용 키는 브라우저 코드에 넣거나 저장소에 올리면 안 돼요.

Android 기본 프로젝트는 패키지 설치 뒤 한 번만 만들어요.

```bash
npm run mobile:init:android
npm run mobile:sync
```

## 확인 명령

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## 현재 범위

웹 기본 화면과 상태 확인 API, 금융 알림 공통 규격, 기기 토큰 확인, 알림 접수 API, 알림 저장과 큐 등록을 포함해요. 기존 엔빵의 화면과 데이터 이전, 큐 처리 작업, Android 알림 수집 모듈, 정산 연결은 다음 작업이에요.

자세한 기술 선택과 구현 순서는 [초기 구조](docs/architecture.md)에서 확인할 수 있어요.

## 참고 문서

제품 요구사항은 [PRD](https://app.notion.com/p/423e7e8fdd1281d584e9f43209353f05)를 기준으로 해요.

기술 방향은 [설계 문서](https://app.notion.com/p/422e7e8fdd128132a1d4e5602b7abd2d)를 기준으로 해요.
