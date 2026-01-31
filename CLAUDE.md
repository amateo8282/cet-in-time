# Claude Code 규칙

이 파일은 Claude Code와 프로젝트 작업 시 따라야 할 규칙을 정의합니다.

## 기본 원칙

- **한국어 사용**: 모든 커밋 메시지, 주석, 문서는 한국어로 작성
- **이모지 사용 금지**: 코드, 커밋 메시지, 문서에서 이모지 사용 지양
- **점진적 구현**: 한 번에 많은 변경보다 작은 단위로 구현 후 테스트

## 문서 참조 원칙

- 새 라이브러리 도입 시 context7로 최신 문서 확인
- 메이저 버전 업그레이드 전 breaking changes 체크
- 공식 문서 우선, 블로그/SO는 참고만

## Git 워크플로우

### 커밋 규칙
- 기능이 구현될 때마다 커밋 (또는 TDD 사이클 완료 시)
- 커밋 메시지는 한글로 구체적으로 작성
  - 좋은 예: "로그인 기능 구현", "회원가입 폼 유효성 검사 추가", "사용자 조회 유스케이스: TDD 사이클 완료"
  - 나쁜 예: "수정", "업데이트", "fix"
- 하나의 커밋에는 하나의 논리적 변경만 포함

### 브랜치 전략
- `main`: 안정적인 프로덕션 코드
- `dev`: 개발 중인 코드
- 기능 브랜치: `feature/기능명` (예: `feature/login`)

## 보안 규칙

### 절대 커밋하지 않을 파일
- `.env`, `.env.local`, `.env.production`
- API 키, 시크릿 키가 포함된 파일
- 인증 정보 (credentials.json, service-account.json 등)
- 개인 정보가 포함된 데이터 파일

### .gitignore 필수 항목
```
.env*
*.pem
*.key
credentials*.json
```

## 코드 스타일

### 파일/폴더 명명 규칙
- 컴포넌트: PascalCase (예: `LoginForm.tsx`)
- 유틸리티: camelCase (예: `formatDate.ts`)
- 스타일: kebab-case (예: `login-form.css`)

### 주석 작성
- 복잡한 로직에는 반드시 한글 주석 추가
- TODO 주석 형식: `// TODO: 설명`
- FIXME 주석 형식: `// FIXME: 설명`

## TDD (Test-Driven Development)

### TDD 사이클 (Red-Green-Refactor)
1. **Red**: 실패하는 테스트 작성
2. **Green**: 테스트를 통과하는 최소한의 코드 작성
3. **Refactor**: 코드 리팩토링 (테스트는 계속 통과해야 함)

### 테스트 작성 규칙
- 모든 새로운 기능은 테스트부터 작성
- 테스트 파일 위치:
  - 단위 테스트: 소스 파일과 같은 디렉토리 또는 `*.test.ts` 형식
  - 통합/E2E 테스트: `__tests__/integration/`, `__tests__/e2e/` 폴더에 위치
- 테스트 파일 명명: `*.test.ts`, `*.test.tsx`, `*.spec.ts`
- 테스트는 독립적이어야 하며, 다른 테스트에 의존하지 않아야 함
- 각 테스트는 하나의 동작만 검증

### 테스트 커버리지
- 핵심 비즈니스 로직: 최소 80% 이상
- 유틸리티 함수: 100% 목표
- UI 컴포넌트: 주요 사용자 플로우 테스트

### 테스트 작성 예시
```typescript
// lib/utils/formatDate.test.ts (단위 테스트 예시)
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD 형식으로 변환해야 함', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('2024-01-15');
  });

  it('null이 주어지면 빈 문자열을 반환해야 함', () => {
    expect(formatDate(null)).toBe('');
  });
});
```

## 클린 아키텍처

### 계층 구조
프로젝트는 다음 계층으로 구성됩니다:

1. **Domain Layer (도메인 계층)**
   - 비즈니스 로직의 핵심
   - 엔티티, 값 객체, 도메인 서비스
   - 외부 의존성 없음

2. **Application Layer (애플리케이션 계층)**
   - 유스케이스 구현
   - 도메인 계층을 조합하여 비즈니스 흐름 구성
   - 인터페이스 정의 (Repository, Service 등)

3. **Infrastructure Layer (인프라 계층)**
   - 외부 라이브러리, 프레임워크 연동
   - 데이터베이스, API 클라이언트 구현
   - 애플리케이션 계층의 인터페이스 구현

4. **Presentation Layer (프레젠테이션 계층)**
   - UI 컴포넌트
   - 사용자 입력 처리
   - 상태 관리

### 의존성 규칙
- **의존성 방향**: 외부 → 내부
- Presentation → Application → Domain
- Infrastructure → Application (인터페이스 구현)
- **절대 금지**: Domain이 외부 계층에 의존

### 폴더 구조 예시
클린 아키텍처를 적용한 프로젝트 구조는 아래 "프로젝트 구조" 섹션을 참고하세요.

### 인터페이스 분리 원칙
- Repository 인터페이스는 Application 계층에 정의
- Infrastructure 계층에서 인터페이스 구현
- 의존성 주입(DI)을 통해 결합도 낮춤

### 예시 코드

#### Domain Entity
```typescript
// domain/entities/User.ts
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string
  ) {}

  // 도메인 로직
  isValid(): boolean {
    return this.email.includes('@') && this.name.length > 0;
  }
}
```

#### Application Interface
```typescript
// application/interfaces/IUserRepository.ts
import { User } from '../../domain/entities/User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
```

#### Use Case
```typescript
// application/use-cases/GetUserUseCase.ts
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../interfaces/IUserRepository';

export class GetUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User | null> {
    return await this.userRepository.findById(userId);
  }
}
```

#### Infrastructure Implementation
```typescript
// infrastructure/repositories/UserRepository.ts
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../application/interfaces/IUserRepository';

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    // 데이터베이스 조회 로직
    // ...
  }

  async save(user: User): Promise<void> {
    // 데이터베이스 저장 로직
    // ...
  }
}
```

## 프로젝트 구조

클린 아키텍처를 적용한 프로젝트 구조 예시:

```
project/
├── src/                      # 소스 코드 (또는 프로젝트 루트)
│   ├── domain/               # 도메인 계층
│   │   ├── entities/         # 엔티티
│   │   ├── value-objects/   # 값 객체
│   │   └── services/        # 도메인 서비스
│   ├── application/          # 애플리케이션 계층
│   │   ├── use-cases/        # 유스케이스
│   │   ├── interfaces/      # 인터페이스
│   │   └── dto/              # 데이터 전송 객체
│   ├── infrastructure/       # 인프라 계층
│   │   ├── repositories/     # Repository 구현
│   │   ├── api/              # API 클라이언트
│   │   └── database/         # 데이터베이스 설정
│   └── presentation/         # 프레젠테이션 계층
│       ├── components/       # UI 컴포넌트
│       ├── pages/            # 페이지 컴포넌트
│       ├── hooks/            # 커스텀 훅
│       ├── stores/           # 상태 관리
│       └── styles/           # 스타일 파일
├── public/                   # 정적 파일
├── docs/                     # 문서
│   └── plans/                # 기능 계획 문서
└── __tests__/                # 통합/E2E 테스트
    ├── integration/          # 통합 테스트
    └── e2e/                  # E2E 테스트
```

**참고**: 
- Next.js App Router를 사용하는 경우 `src/` 대신 루트에 `app/` 폴더를 사용할 수 있습니다.
- 단위 테스트는 소스 파일과 같은 디렉토리에 위치합니다.
- 통합/E2E 테스트는 `__tests__/` 폴더에 구조화하여 관리합니다.

## 작업 흐름 (TDD 기반)

1. **기능 요구사항 확인**
   - 사용자 스토리 또는 요구사항 명확화
   - 도메인 모델 설계

2. **계획 문서 작성**
   - `docs/plans/`에 계획 문서 작성
   - 최소 다음의 문서 생성: `Plan.md`, `PRD.md`, `TRD.md`, `TASK.md`
   - 클린 아키텍처 계층별 설계 포함

3. **TDD 사이클 실행**
   - **Red**: 실패하는 테스트 작성
     - 도메인 계층 테스트부터 시작
     - 유스케이스 테스트 작성
     - 프레젠테이션 계층 테스트 작성
   - **Green**: 테스트를 통과하는 최소한의 코드 작성
     - Domain → Application → Infrastructure → Presentation 순서로 구현
   - **Refactor**: 코드 개선 (테스트는 계속 통과해야 함)
     - 중복 제거
     - 네이밍 개선
     - 구조 최적화

4. **통합 테스트**
   - 계층 간 통합 테스트 작성
   - E2E 테스트 (필요시)

5. **커밋 및 푸시**
   - 각 TDD 사이클 완료 시 또는 기능 단위로 커밋 및 푸시
   - 커밋 메시지는 한글로 구체적으로 작성 (예: "사용자 조회 유스케이스 구현", "로그인 폼 유효성 검사 추가")
   - 최종 E2E 테스트 통과 시 푸시

6. **문서 업데이트**
   - 구현 내용 반영
   - API 문서 업데이트 (필요시)
   - 이 문서는 최종적으로 프로젝트가 푸시되면 프로젝트에 대한 내용을 알기 쉽게 본 파일에 업데이트해서 작성해.
