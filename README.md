# RAG Component Viewer

LG NXI UX Simulator MVP의 **2.4인치 디스플레이 위젯 컴포넌트 카탈로그 뷰어**입니다.  
세탁기·건조기·오븐 등 가전 제품 UI를 구성하는 98개의 React 컴포넌트를 브라우저에서 시각적으로 탐색하고 검증할 수 있습니다.

---

## 주요 기능

- **컴포넌트 카탈로그** — 98개 위젯을 카테고리별로 탐색
- **실시간 Props 편집** — JSON 에디터로 props를 직접 수정하고 즉시 미리보기
- **Variants 전환** — 각 위젯의 사전 정의된 상태/변형을 원클릭으로 전환
- **320×240 LCD 프레임** — 실제 2.4인치 디스플레이 비율로 렌더링
- **카탈로그 메타데이터 편집** — 위젯 설명, props 목록, 키워드 등 문서화

---

## 시작하기

### 요구 사항

- Node.js 18 이상
- npm

### 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3002](http://localhost:3002) 접속

### 빌드

```bash
npm run build
npm run start
```

---

## 프로젝트 구조

```
rag-component-viewer/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/
│   │   └── CatalogViewer.js    # 메인 카탈로그 UI
│   ├── registry/
│   │   └── index.js            # 컴포넌트 레지스트리 (defaultProps + variants)
│   └── widgets/
│       └── 2.4_inches/         # 98개 위젯 컴포넌트 (.jsx)
├── public/
│   └── ui/
│       ├── images/             # 정적 이미지 에셋
│       └── image_sequences/    # 프레임 애니메이션 시퀀스
└── docs/
    └── WIDGET_COMPONENT_CATALOG.md
```

---

## 컴포넌트 목록 (98개)

### CM_ — 공통 컴포넌트

| 카테고리 | 컴포넌트 |
|----------|----------|
| **애니메이션** | `CM_ANIM_Digit` `CM_ANIM_IntroLoop` `CM_ANIM_Sequence` `CM_ANIM_SequencePlayer` |
| **컨트롤** | `CM_CTRL_Button` `CM_CTRL_Slider` `CM_CTRL_SliderContinuous` `CM_CTRL_SliderDiscrete` `CM_CTRL_Switch` |
| **다이얼로그** | `CM_DIALOG_CustomIcon` `CM_DIALOG_DescOnly` `CM_DIALOG_Icon` `CM_DIALOG_IconButtons` `CM_DIALOG_IconTitleDesc` `CM_DIALOG_ScrollDesc` `CM_DIALOG_TextButtons` `CM_DIALOG_TextOnly` `CM_DIALOG_TitleDesc` `CM_DIALOG_TitleIconStack` `CM_DIALOG_TitleWide` |
| **디스플레이** | `CM_DISPLAY_Black` |
| **레이블** | `CM_LABEL_Formatted` `CM_LABEL_Smart` |
| **리스트** | `CM_LIST_Grid` `CM_LIST_HorizontalCarousel` `CM_LIST_HorizontalPager` `CM_LIST_Item` `CM_LIST_Item2Col` `CM_LIST_ItemFull` `CM_LIST_MultiSelect` `CM_LIST_Reorder` `CM_LIST_ScrollView` `CM_LIST_ScrollView2Col` `CM_LIST_SingleSelect` `CM_LIST_SwitchList` `CM_LIST_Vertical` `CM_LIST_Vertical2Col` |
| **오버레이** | `CM_OVERLAY_Guide` `CM_OVERLAY_Toast` `CM_OVERLAY_ToastQueue` |
| **피커** | `CM_PICKER_HorizontalSel` `CM_PICKER_Mask2nd` `CM_PICKER_NumericCarousel` `CM_PICKER_Roller` `CM_PICKER_Vertical` `CM_PICKER_Vertical1st` `CM_PICKER_Vertical1stItem` `CM_PICKER_Vertical2nd` `CM_PICKER_Vertical2ndItem` `CM_PICKER_VerticalCore` `CM_PICKER_VerticalTitled` `CM_PICKER_VerticalValue` |
| **프로그레스** | `CM_PROGRESS_Bar` `CM_PROGRESS_Spinner` |
| **타이틀** | `CM_TITLE_Bar` `CM_TITLE_WithArrow` |

### OV_ — 오븐 전용

| 컴포넌트 |
|----------|
| `OV_COOK_AutoPager` `OV_COOK_Finished` `OV_COOK_ModeItem` `OV_COOK_ModePager` `OV_DIALOG_TitleIcon` `OV_PROGRESS_Cooking` `OV_TITLE_2Line` |

### WD_ — 세탁기/건조기 전용

| 카테고리 | 컴포넌트 |
|----------|----------|
| **애니메이션** | `WD_ANIM_Boot` `WD_ANIM_BootScreen` `WD_ANIM_BootUpgrade` `WD_ANIM_Sensing` |
| **시계** | `WD_CLOCK_Analog` `WD_CLOCK_Digital` `WD_CLOCK_Idle` `WD_CLOCK_Picker` `WD_CLOCK_Reservation` `WD_CLOCK_ReservationTime` `WD_CLOCK_SetTime` |
| **코스** | `WD_COURSE_Editor` `WD_COURSE_EditorItem` `WD_COURSE_Item` `WD_COURSE_ItemOption` `WD_COURSE_List` `WD_COURSE_ProgressBase` `WD_COURSE_ProgressFinish` `WD_COURSE_ProgressTitle` `WD_COURSE_Running` |
| **장식** | `WD_DECORATION_Divider` |
| **다이얼로그** | `WD_DIALOG_Accessory` `WD_DIALOG_AnimIcon` `WD_DIALOG_Basic` `WD_DIALOG_ChildLock` `WD_DIALOG_QRCode` `WD_DIALOG_TextOnly` `WD_DIALOG_Unlock` |
| **페이저** | `WD_PAGER_Base` |
| **프로그레스** | `WD_PROGRESS_Bar` `WD_PROGRESS_Circle` `WD_PROGRESS_RemainTime` `WD_PROGRESS_SOTA` `WD_PROGRESS_ValveCheck` |
| **토스트** | `WD_TOAST_Message` |

---

## 레지스트리 구조

`src/registry/index.js`의 `ComponentRegistry`에 각 위젯의 `defaultProps`와 `variants`를 정의합니다.

```js
ComponentName: {
    Component: ComponentImport,
    defaultProps: { /* 기본 props */ },
    variants: [
        { id: 'v1', description: '설명', data: { /* props 오버라이드 */ } },
    ],
}
```

---

## 기술 스택

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS 3**
- **Framer Motion**
- **Chakra UI 2**

---

## 라이선스

Private — LG Electronics NXI UX Team
