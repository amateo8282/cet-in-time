# Claude Code 프로젝트 템플릿

Claude Code와 함께 사용하기 위한 프로젝트 템플릿입니다. TDD 기반 개발과 클린 아키텍처를 적용한 체계적인 개발 워크플로우를 제공합니다.

## 빠른 시작

```bash
# 템플릿 클론
git clone https://github.com/amateo8080/template.git my-project
cd my-project

# 원격 저장소 변경 (본인 저장소로)
git remote set-url origin https://github.com/amateo8080/my-project.git

# 또는 GitHub CLI 사용
gh repo create my-project --template amateo8080/template
```

## 템플릿 구조

```
.
├── CLAUDE.md                           # Claude Code 규칙 및 가이드라인
├── README.md                           # 프로젝트 설명 (이 파일)
└── .claude/
    └── skills/
        └── cc-feature-implementer-main/
            ├── SKILL.md                # Feature Planner 스킬 정의
            └── plan-template.md        # 기능 계획 문서 템플릿
```

## 포함된 내용

### CLAUDE.md
Claude Code와 작업할 때 따라야 할 규칙을 정의합니다:
- Git 워크플로우 (커밋 규칙, 브랜치 전략)
- 보안 규칙 (민감 정보 관리)
- 코드 스타일 가이드
- TDD 사이클 및 테스트 작성 규칙
- 클린 아키텍처 계층 구조
- 프로젝트 폴더 구조 예시

### Feature Planner 스킬
`.claude/skills/cc-feature-implementer-main/` 폴더에 위치하며, 기능 구현 시 체계적인 계획 수립을 돕습니다:
- 단계별 구현 계획 생성
- TDD 기반 태스크 분해
- Quality Gate 검증 체크리스트
- 리스크 평가 및 롤백 전략

## 핵심 원칙

### 한국어 사용
- 모든 커밋 메시지, 주석, 문서는 한국어로 작성
- 좋은 예: "로그인 기능 구현", "사용자 조회 유스케이스: TDD 사이클 완료"

### 이모지 사용 금지
- 코드, 커밋 메시지, 문서에서 이모지 사용 지양
- 가독성과 일관성을 위해 텍스트 기반 표현 사용

### TDD (Test-Driven Development)
모든 기능 구현은 TDD 사이클을 따릅니다:
1. **Red**: 실패하는 테스트 작성
2. **Green**: 테스트를 통과하는 최소한의 코드 작성
3. **Refactor**: 코드 리팩토링 (테스트는 계속 통과해야 함)

### 클린 아키텍처
계층별 의존성 규칙을 준수합니다:
```
Presentation → Application → Domain
Infrastructure → Application (인터페이스 구현)
```

**절대 금지**: Domain 계층이 외부 계층에 의존

## 사용 방법

### 1. 새 프로젝트 시작
이 템플릿을 클론하고 프로젝트에 맞게 수정합니다.

### 2. 기능 계획 수립
Claude Code에서 Feature Planner 스킬을 활용하여 기능 계획을 수립합니다:
```
"사용자 인증 기능을 계획해줘"
```

생성되는 문서: `docs/plans/PLAN_<feature-name>.md`

### 3. TDD 사이클 실행
계획 문서의 체크박스를 따라가며 구현합니다:
- RED 태스크: 실패하는 테스트 작성
- GREEN 태스크: 테스트 통과하는 코드 작성
- REFACTOR 태스크: 코드 품질 개선

### 4. Quality Gate 검증
각 Phase 완료 시 Quality Gate 항목을 모두 확인합니다:
- 빌드 및 테스트 통과
- 코드 품질 검사
- 보안 및 성능 확인
- 문서 업데이트

## 프로젝트 구조 예시

클린 아키텍처를 적용한 프로젝트 구조:

```
project/
├── src/
│   ├── domain/               # 도메인 계층
│   │   ├── entities/
│   │   ├── value-objects/
│   │   └── services/
│   ├── application/          # 애플리케이션 계층
│   │   ├── use-cases/
│   │   ├── interfaces/
│   │   └── dto/
│   ├── infrastructure/       # 인프라 계층
│   │   ├── repositories/
│   │   ├── api/
│   │   └── database/
│   └── presentation/         # 프레젠테이션 계층
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── stores/
├── docs/
│   └── plans/                # 기능 계획 문서
├── __tests__/
│   ├── integration/
│   └── e2e/
├── CLAUDE.md
└── .claude/
    └── skills/
```

## Git 워크플로우

### 커밋 규칙

```bash
# 좋은 예
git commit -m "로그인 폼 컴포넌트 구현"
git commit -m "사용자 조회 유스케이스: TDD 사이클 완료"
git commit -m "회원가입 유효성 검사 테스트 추가"

# 나쁜 예
git commit -m "수정"
git commit -m "update"
git commit -m "fix bug"
```

### 푸시 규칙
- 주요 기능 구현이 완료되면 푸시
- 최종 E2E 테스트 통과 후 푸시
- 커밋은 자주, 푸시는 검증 후 진행

```bash
# TDD 사이클 중: 커밋만
git commit -m "사용자 엔티티 테스트 작성"
git commit -m "사용자 엔티티 구현"
git commit -m "사용자 엔티티 리팩토링"

# 기능 완료 또는 E2E 통과 후: 푸시
git push origin main
```

## 보안 규칙

다음 파일은 절대 커밋하지 않습니다:
- `.env`, `.env.local`, `.env.production`
- API 키, 시크릿 키가 포함된 파일
- 인증 정보 파일

`.gitignore`에 반드시 포함:
```
.env*
*.pem
*.key
credentials*.json
```

## 플레이스홀더 이미지 서비스

개발 및 테스트 시 사용할 수 있는 이미지 서비스입니다.

### Picsum (고품질 랜덤 이미지)
```html
<!-- 기본 사용 -->
<img src="https://picsum.photos/400/300" alt="랜덤 이미지">

<!-- 특정 이미지 고정 (seed 사용) -->
<img src="https://picsum.photos/seed/project/400/300" alt="고정 이미지">

<!-- 그레이스케일 -->
<img src="https://picsum.photos/400/300?grayscale" alt="흑백 이미지">

<!-- 블러 효과 -->
<img src="https://picsum.photos/400/300?blur=2" alt="블러 이미지">
```

### DiceBear (아바타 아이콘)
```html
<!-- 기본 아바타 -->
<img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" alt="아바타">

<!-- 다양한 스타일 -->
<img src="https://api.dicebear.com/7.x/lorelei/svg?seed=user1" alt="로렐라이">
<img src="https://api.dicebear.com/7.x/bottts/svg?seed=user1" alt="로봇">
<img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=user1" alt="픽셀아트">
<img src="https://api.dicebear.com/7.x/initials/svg?seed=JK" alt="이니셜">
```

### RandomUser (실제 인물 사진)
```javascript
// API 호출
fetch('https://randomuser.me/api/')
  .then(res => res.json())
  .then(data => {
    const user = data.results[0];
    console.log(user.picture.large);    // 큰 이미지
    console.log(user.picture.medium);   // 중간 이미지
    console.log(user.picture.thumbnail); // 썸네일
  });

// 여러 명 가져오기
fetch('https://randomuser.me/api/?results=10')
```

### 사용 예시
```typescript
// 프로필 이미지 기본값
const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg';

// 사용자별 고유 아바타
const getUserAvatar = (userId: string) => 
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;

// 썸네일 이미지
const getThumbnail = (width: number, height: number) =>
  `https://picsum.photos/${width}/${height}`;
```
