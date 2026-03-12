# RAG 컨텍스트 설계 — 샘플 Props 제공 전략

## 배경

LLM을 이용해 위젯 컴포넌트 코드를 생성할 때, 컴포넌트 소스(.jsx)와 PropTypes만으로는 올바른 props를 생성하지 못하는 사례가 반복적으로 발생했습니다. `src/registry/index.js` 레지스트리 감사 결과, 이 문제의 원인과 해결 방향이 명확해졌습니다.

---

## 문제: 코드만으로 충분하지 않은 이유

### 실제 발생 오류 사례

| 위젯 | LLM 추측 props | 실제 props | 원인 |
|------|---------------|-----------|------|
| `WD_PROGRESS_RemainTime` | `hour`, `min`, `isFocused` | `remain_hour`, `remain_min` | 컴포넌트명에서 오해 유발 |
| `CM_LABEL_Formatted` | `text: '...'`, `slots: ['World']` | `format: '...'`, `slots: [{type, value}]` | 레거시 경로 혼용으로 타입 불명확 |
| `WD_CLOCK_Picker` | `hour`, `min`, `isFocused` | `scrollIndex` (0~9) | 컴포넌트명과 실제 역할 불일치 |
| `WD_CLOCK_Digital` | `clock_type: 'digital'` | `clock_type: 1` (number) | PropTypes에서 `number`를 놓침 |
| `WD_CLOCK_Idle` | `clock_info: {...}` | `hour`, `minute`, `ampm` | 유사 위젯(Analog)과 구조 다름 |
| `WD_CLOCK_Analog` | `clock_info` (sec 없음) | `clock_info: {hour, min, sec, date}` | `sec` 누락 시 NaN 오류 |
| image sequences | 경로 패턴 추측 불가 | `/ui/image_sequences/sensing_intro/.orig_images/sensing_intro_00.png` | 완전히 프로젝트 특화 지식 |

### 핵심 원인 3가지

1. **PropTypes는 타입만 알려주고, 샘플은 의도와 구체적 형태를 전달**
   - `descriptionArr: PropTypes.arrayOf(PropTypes.shape({text: PropTypes.string}))` 보다
   - `descriptionArr: [{ text: '감지 중...' }, { text: '세탁물을\n확인 중' }]`이 `\n` 줄바꿈과 복수 항목 순환까지 전달

2. **프로젝트 특화 매직 넘버는 코드에서 추론 불가**
   - `ampm: 1`(AM) vs `ampm: 2`(PM)
   - `theme_id: 1`(blue) vs `theme_id: 2`(orange)
   - PropTypes 없이는 `true/false` 또는 문자열로 잘못 생성됨

3. **image sequence 경로는 반드시 샘플 필요**
   - `.orig_images` 서브폴더 패턴, 파일명 prefix, zero-padding 자리수 등
   - 검색 없이는 절대 추론 불가

---

## 해결 방향: RAG 컨텍스트에 포함할 정보

### ✅ 반드시 포함

| 항목 | 이유 |
|------|------|
| `defaultProps` (검증된 값) | 최소 동작 예시, 타입과 구조를 동시에 전달 |
| image sequence 경로 패턴 | 프로젝트 특화 지식, 추론 불가 |
| 매직 넘버 → 의미 매핑 | `ampm: 1 = AM`, `theme_id: 1 = blue` 등 |
| 중첩 객체 구조 예시 | `finish_info`, `clock_info` 등 |

### ⬜ 생략 가능 (토큰 절약)

| 항목 | 이유 |
|------|------|
| 모든 variants | `defaultProps` 하나로 충분 |
| 30프레임 전체 배열 | `Array.from({length: 30}, ...)` 패턴으로 대체 |
| style/className props | LLM이 컨텍스트에 맞게 자유 생성 가능 |
| onKey 콜백 | 생성 목적에 따라 생략 가능 |

---

## 구현 계획

### 현재 상태

`src/registry/index.js`의 `defaultProps`가 이미 **"최소한의 올바른 사용 예시"** 역할을 수행합니다.

### 할 일

- [ ] 컴포넌트 소스(.jsx) + `defaultProps` 를 함께 추출하는 RAG 인제스트 스크립트 작성
- [ ] 각 위젯에 대해 **"사용 예시 스니펫"** 을 `defaultProps` 기반으로 자동 생성하는 빌드 스텝 추가
- [ ] `docs/component_catalog.json` 에 `defaultProps`와 대표 variant 1개를 `example` 필드로 포함
- [ ] image sequence 경로 패턴을 상수/문서로 명세화 (`.orig_images` 규칙, zero-padding 규칙 등)

### 제안 컨텍스트 포맷 (위젯 1개당)

```
## ComponentName

### 소스 코드
{jsx 소스}

### Props
{PropTypes 목록}

### 사용 예시 (defaultProps 기반)
<ComponentName
  propA={...}
  propB={...}
/>
```

---

## 참고

- 레지스트리 파일: `src/registry/index.js`
- 위젯 소스 위치: `src/widgets/2.4_inches/*.jsx`
- 이미지 에셋: `public/ui/images/`, `public/ui/image_sequences/`
- image sequence 패턴: `public/ui/image_sequences/<name>/.orig_images/<name>_NN.png`
