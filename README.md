# 내 시간의 가격 (Time is Money)

영화 "In Time"에서 착안한 크롬 익스텐션. 쿠팡 쇼핑 페이지의 상품 가격을 사용자의 시급 기반으로 근로 시간 단위로 변환하여 표시합니다.

## 주요 기능

- 월급 입력 시 시급 자동 계산 (한국 법정 월 209시간 기준)
- 쿠팡 상품 페이지의 가격을 근무 시간으로 변환 표시
- ON/OFF 토글로 변환 활성화/비활성화
- 원본 가격 툴팁으로 확인 가능
- 동적 콘텐츠(무한 스크롤 등) 대응

## 기술 스택

- TypeScript, Vite (멀티 빌드), Vitest
- Chrome Extension Manifest V3
- 클린 아키텍처 (Domain -> Application -> Infrastructure -> Presentation)

## 프로젝트 구조

```
cet-in-time/
├── src/
│   ├── domain/                  # 엔티티, 값 객체, 도메인 서비스
│   │   ├── entities/salary.ts
│   │   ├── valueObjects/workTime.ts
│   │   └── services/priceConverter.ts
│   ├── application/             # 유스케이스, 포트, DTO
│   │   ├── ports/settingsRepository.ts
│   │   ├── usecases/saveSalary.ts
│   │   ├── usecases/convertPrice.ts
│   │   └── dto/settingsDto.ts
│   ├── infrastructure/          # chrome.storage, DOM 조작
│   │   ├── storage/chromeSettingsRepository.ts
│   │   └── dom/
│   │       ├── coupangPriceDetector.ts
│   │       └── priceReplacer.ts
│   ├── presentation/            # Popup UI, Content 스타일
│   │   ├── popup/
│   │   └── content/overlay.css
│   ├── content.ts               # Content Script 진입점
│   └── background.ts            # Service Worker 진입점
├── manifest.json                # Chrome Extension Manifest V3
├── __tests__/integration/       # 통합 테스트
└── dist/                        # 빌드 결과물 (git 제외)
```

## 개발

```bash
# 의존성 설치
pnpm install

# 테스트 실행
pnpm test

# 타입 체크
pnpm typecheck

# 빌드
pnpm build
```

## 크롬 익스텐션 설치 (개발 모드)

1. `pnpm build`로 빌드
2. Chrome에서 `chrome://extensions` 접속
3. 우측 상단 "개발자 모드" 활성화
4. "압축해제된 확장 프로그램을 로드합니다" 클릭
5. `dist/` 폴더 선택

## 사용법

1. 익스텐션 아이콘 클릭하여 팝업 열기
2. 월급 입력 (예: 3,000,000)
3. 시급이 자동으로 계산되어 표시됨
4. "변환 활성화" 토글을 ON으로 설정
5. "저장" 클릭
6. 쿠팡 페이지에서 가격이 근무 시간으로 변환됨

## 변환 예시

월급 3,000,000원 (시급 약 14,354원) 기준:

| 상품 가격 | 변환 결과 |
|-----------|-----------|
| 1,000원 | 4분 |
| 10,000원 | 42분 |
| 29,900원 | 2시간 5분 |
| 100,000원 | 7시간 |
| 1,000,000원 | 8일 5시간 30분 |

## 테스트

총 51개 테스트 (단위 + 통합):
- Domain 계층: 22개 (WorkTime, Salary, PriceConverter)
- Application 계층: 5개 (SaveSalary, ConvertPrice)
- Infrastructure 계층: 15개 (ChromeStorage, PriceDetector, PriceReplacer)
- 통합 테스트: 9개 (전체 파이프라인)
