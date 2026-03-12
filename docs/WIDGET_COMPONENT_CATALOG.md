# Widget Component Catalog  v2.0

**Directory**: `src/app/components/lcd/widgets/2.4/standard`  
**Generated**: 2026-03-12  
**Version**: 2.0 — 표준 네이밍 적용, 래퍼 항목 제거

## 📊 Overview

- **Total Widgets**: 98 (RAG 인덱싱 대상)
- **Wrappers**: 21 → **RAG에서 제외** (별도 관리)
- **이전 버전 대비 변경**: 래퍼 21개 제거, 전체 위젯 이름 표준화

---

## 🏷️ 표준 네이밍 규칙

```
[PRODUCT]_[CATEGORY]_[ComponentName]
```

| 코드 | 의미 | 예시 |
|------|------|------|
| `CM` | Common — 제품 공통 | `CM_DIALOG_Icon` |
| `WD` | Washer/Dryer — 세탁기/건조기 전용 | `WD_COURSE_List` |
| `OV` | Oven — 오븐 전용 | `OV_COOK_Finished` |

**Product별 Category 코드**

| Product | Category Code | 설명 |
|---------|---------------|------|
| CM | `CTRL` | 기본 컨트롤 (버튼, 스위치, 슬라이더) |
| CM | `TITLE` | 타이틀 바 |
| CM | `OVERLAY` | 오버레이, 토스트 알림 |
| CM | `DIALOG` | 대화상자 (아이콘, 설명, 버튼 조합) |
| CM | `LIST` | 리스트 및 그리드 |
| CM | `PICKER` | 피커 컨트롤 (롤러, 수평/수직 선택기) |
| CM | `PROGRESS` | 진행 표시기 |
| CM | `LABEL` | 텍스트 레이블 |
| CM | `ANIM` | 애니메이션 |
| CM | `DISPLAY` | 특수 화면 상태 |
| WD | `ANIM` | 부팅/감지 애니메이션 |
| WD | `DIALOG` | 세탁기 전용 대화상자 |
| WD | `CLOCK` | 시계 및 시간 표시 |
| WD | `COURSE` | 코스 선택/진행 |
| WD | `PROGRESS` | 세탁 진행 표시기 |
| WD | `TOAST` | 세탁기 토스트 알림 |
| WD | `PAGER` | 페이지 전환 기반 |
| WD | `DECORATION` | 구분선 등 장식 |
| OV | `TITLE` | 오븐 타이틀 |
| OV | `DIALOG` | 오븐 전용 대화상자 |
| OV | `COOK` | 조리 모드/완료 화면 |
| OV | `PROGRESS` | 조리 진행 표시기 |

---

## 🔄 이름 매핑 테이블 (구 → 신)

> RAG 인덱싱, 레지스트리 키 변경, 코드 마이그레이션 참조용

### Common (CM) 위젯

| 신규 표준 이름 | 구 파일명 (레거시) | 카테고리 |
|---------------|-----------------|---------|
| `CM_CTRL_Button` | `CM_Button` | Common / Controls |
| `CM_CTRL_Switch` | `CM_Switch` | Common / Controls |
| `CM_CTRL_Slider` | `Slider` | Common / Controls |
| `CM_CTRL_SliderContinuous` | `Core_Continuous_Slider` | Common / Controls |
| `CM_CTRL_SliderDiscrete` | `Core_Discrete_Slider` | Common / Controls |
| `CM_TITLE_Bar` | `CM_Title` | Common / Title |
| `CM_TITLE_WithArrow` | `TitleWithArrow` | Common / Title |
| `CM_OVERLAY_Guide` | `CM_Overlay_Guide` | Common / Overlay |
| `CM_OVERLAY_Toast` | `CM_Dialog_Toast` | Common / Overlay |
| `CM_OVERLAY_ToastQueue` | `CM_Dialog_Toast_Holder` | Common / Overlay |
| `CM_DIALOG_IconButtons` | `Core_CM_Confirmation` | Common / Dialog |
| `CM_DIALOG_TextButtons` | `Core_CM_ConfirmationButton` | Common / Dialog |
| `CM_DIALOG_ScrollDesc` | `Core_CM_Desc_Button` | Common / Dialog |
| `CM_DIALOG_DescOnly` | `Core_CM_Description_Only` | Common / Dialog |
| `CM_DIALOG_Icon` | `Core_CM_Dialogue_Icon` | Common / Dialog |
| `CM_DIALOG_IconTitleDesc` | `Core_CM_Dialogue_Icon_Title` | Common / Dialog |
| `CM_DIALOG_CustomIcon` | `Core_CM_Dialogue_MidIcon_Title` | Common / Dialog |
| `CM_DIALOG_TextOnly` | `Core_CM_Dialogue_Only` | Common / Dialog |
| `CM_DIALOG_TitleDesc` | `Core_CM_Dialogue_Title` | Common / Dialog |
| `CM_DIALOG_TitleIconStack` | `Core_CM_Dialogue_Title_Icon` | Common / Dialog |
| `CM_DIALOG_TitleWide` | `Core_CM_Dialogue_W_Title` | Common / Dialog |
| `CM_LIST_Vertical` | `Core_CM_Ver_List` | Common / List |
| `CM_LIST_Vertical2Col` | `Core_CM_Ver_List_2nd` | Common / List |
| `CM_LIST_SwitchList` | `Core_CM_Ver_Switch_List` | Common / List |
| `CM_LIST_SingleSelect` | `Core_CM_Listview_Ver_Single` | Common / List |
| `CM_LIST_MultiSelect` | `Core_CM_Listview_Ver_3rd` | Common / List |
| `CM_LIST_Reorder` | `Core_CM_Listview_Ver_Reorder` | Common / List |
| `CM_LIST_ScrollView` | `VerticalListView` | Common / List |
| `CM_LIST_ScrollView2Col` | `VerticalListView2nd` | Common / List |
| `CM_LIST_Item` | `VerticalListItem` | Common / List |
| `CM_LIST_Item2Col` | `VerticalListItem2nd` | Common / List |
| `CM_LIST_ItemFull` | `Core_CM_Ver_ListItem` | Common / List |
| `CM_LIST_Grid` | `Core_CM_gridview` | Common / List |
| `CM_LIST_HorizontalPager` | `Core_CM_Hor_List` | Common / List |
| `CM_LIST_HorizontalCarousel` | `Core_CM_Hor_Dynamic` | Common / List |
| `CM_PICKER_HorizontalSel` | `Core_CM_picker_Hor_Sel` | Common / Picker |
| `CM_PICKER_Vertical` | `Core_CM_picker_Ver` | Common / Picker |
| `CM_PICKER_VerticalTitled` | `Core_CM_picker_Ver_2nd` | Common / Picker |
| `CM_PICKER_VerticalValue` | `Core_CM_picker_Ver_List` | Common / Picker |
| `CM_PICKER_NumericCarousel` | `Core_Hor_LeftRight` | Common / Picker |
| `CM_PICKER_Vertical1st` | `VerticalList1stDepth` | Common / Picker |
| `CM_PICKER_Vertical1stItem` | `VerticalList1stDepthItem` | Common / Picker |
| `CM_PICKER_Vertical2nd` | `VerticalList2ndDepth` | Common / Picker |
| `CM_PICKER_Vertical2ndItem` | `VerticalList2ndDepthItem` | Common / Picker |
| `CM_PICKER_VerticalCore` | `VerticalListPicker` | Common / Picker |
| `CM_PICKER_Mask2nd` | `WDOptionMask2ndDepth` | Common / Picker |
| `CM_PICKER_Roller` | `WD_Roller` | Common / Picker |
| `CM_PROGRESS_Bar` | `Core_CM_Progress_Bar` | Common / Progress |
| `CM_PROGRESS_Spinner` | `Core_CM_Proress_Indicator` | Common / Progress |
| `CM_LABEL_Smart` | `NextLabelLite` | Common / Label |
| `CM_LABEL_Formatted` | `NextFmtLabelLite` | Common / Label |
| `CM_ANIM_Sequence` | `ImageSequence` | Common / Animation |
| `CM_ANIM_SequencePlayer` | `ImageSequencePlayer` | Common / Animation |
| `CM_ANIM_IntroLoop` | `imgseqopt_Intro_Loop` | Common / Animation |
| `CM_ANIM_Digit` | `DigitAnim` | Common / Animation |
| `CM_DISPLAY_Black` | `WD_Black_Widget` | Common / Display |

### Washer/Dryer (WD) 위젯

| 신규 표준 이름 | 구 파일명 (레거시) | 카테고리 |
|---------------|-----------------|---------|
| `WD_ANIM_Boot` | `WD_BootAnim` | WD / Animation |
| `WD_ANIM_BootScreen` | `WD_Booting_Widget` | WD / Animation |
| `WD_ANIM_BootUpgrade` | `WD_Booting_Upgrade_Widget` | WD / Animation |
| `WD_ANIM_Sensing` | `WD_Sensing` | WD / Animation |
| `WD_DIALOG_Basic` | `WD_Dialog_Basic` | WD / Dialog |
| `WD_DIALOG_QRCode` | `WD_Dialog_QR` | WD / Dialog |
| `WD_DIALOG_Unlock` | `WD_Dialog_Unlock` | WD / Dialog |
| `WD_DIALOG_AnimIcon` | `WD_Dialogue_Icon` | WD / Dialog |
| `WD_DIALOG_TextOnly` | `WD_Dialogue_Only` | WD / Dialog |
| `WD_DIALOG_ChildLock` | `WD_ChildLock_Widget` | WD / Dialog |
| `WD_DIALOG_Accessory` | `WD_Accessory_Widget` | WD / Dialog |
| `WD_CLOCK_Idle` | `WD_Clock_Widget` | WD / Clock |
| `WD_CLOCK_Analog` | `lv_std_clock_theme_analog` | WD / Clock |
| `WD_CLOCK_Digital` | `lv_std_clock_theme_digital` | WD / Clock |
| `WD_CLOCK_SetTime` | `WD_CM_SetClock` | WD / Clock |
| `WD_CLOCK_Picker` | `WD_TimePicker` | WD / Clock |
| `WD_CLOCK_Reservation` | `WD_FinishReservation` | WD / Clock |
| `WD_CLOCK_ReservationTime` | `WD_FinishReservationTime` | WD / Clock |
| `WD_COURSE_List` | `WD_CourseList` | WD / Course |
| `WD_COURSE_Item` | `WD_CourseList_Item` | WD / Course |
| `WD_COURSE_ItemOption` | `WD_CourseList_Item_Option` | WD / Course |
| `WD_COURSE_Editor` | `WD_CourseListEdit` | WD / Course |
| `WD_COURSE_EditorItem` | `WD_CourseListEdit_Item` | WD / Course |
| `WD_COURSE_ProgressBase` | `WD_CourseProgressBase` | WD / Course |
| `WD_COURSE_Running` | `WD_CourseRunning` | WD / Course |
| `WD_COURSE_ProgressFinish` | `WD_CourseProgressFinish` | WD / Course |
| `WD_COURSE_ProgressTitle` | `WD_CourseProgressTitle` | WD / Course |
| `WD_PROGRESS_Bar` | `WD_ProgressBar` | WD / Progress |
| `WD_PROGRESS_Circle` | `WD_Progress_Circle` | WD / Progress |
| `WD_PROGRESS_SOTA` | `WD_Progress_SOTA` | WD / Progress |
| `WD_PROGRESS_RemainTime` | `WD_RemainTime` | WD / Progress |
| `WD_PROGRESS_ValveCheck` | `WD_ValveCheck` | WD / Progress |
| `WD_TOAST_Message` | `WD_Toast` | WD / Toast |
| `WD_PAGER_Base` | `WD_Pager` | WD / Pager |
| `WD_DECORATION_Divider` | `WD_DividerVertical` | WD / Decoration |

### Oven (OV) 위젯

| 신규 표준 이름 | 구 파일명 (레거시) | 카테고리 |
|---------------|-----------------|---------|
| `OV_TITLE_2Line` | `WD_CM_oven_title_2line` | Oven / Title |
| `OV_DIALOG_TitleIcon` | `WD_CM_Title_Dialogue_Icon` | Oven / Dialog |
| `OV_COOK_Finished` | `WD_CookFinished` | Oven / Cook |
| `OV_COOK_ModeItem` | `WD_CookMode_Item` | Oven / Cook |
| `OV_COOK_ModePager` | `WD_CookMode_Pager` | Oven / Cook |
| `OV_COOK_AutoPager` | `WD_AutoCook_Pager` | Oven / Cook |
| `OV_PROGRESS_Cooking` | `WD_Oven_Progress_Widget` | Oven / Progress |

---

## 📦 위젯 카탈로그 (98개)

> 각 항목에 **Original Name**(코드 마이그레이션 기준 파일명)을 표시합니다.

---

<!-- ═══════════════════════════════════════════════ -->
## 🔵 CM — Common (제품 공통) 56개
<!-- ═══════════════════════════════════════════════ -->

---

### CM / Controls — 기본 컨트롤 (5개)

---

### CM_CTRL_Button
**Original Name**: `CM_Button`  
**Category**: Common / Controls  
**Type**: Widget

**시각적 형태**: Rounded capsule button (default 52px height, 26px border radius) with centered text, background and text colors change on focus

**설명**: Common button widget with focus state styling. Displays text in a rounded capsule shape with automatic width adjustment or fixed width. Supports focus states with inverted colors: focused (white background/black text) vs unfocused (dark background/white text). Configurable dimensions, colors, and border radius.

---

### CM_CTRL_Switch
**Original Name**: `CM_Switch`  
**Category**: Common / Controls  
**Type**: Widget

**시각적 형태**: Rounded pill switch (55x30px) with white circular knob (24px) that slides horizontally, blue track background

**설명**: Toggle switch component with ON/OFF states. Rounded pill-shaped track (55x30px) with sliding knob. Blue background with white circular knob that slides between left (OFF) and right (ON) positions. Supports click interaction and disabled states.

---

### CM_CTRL_Slider
**Original Name**: `Slider`  
**Category**: Common / Controls  
**Type**: Widget

**시각적 형태**: Horizontal slider track (customizable width, default 244px) with draggable thumb, 1px height track

**설명**: Basic HTML range slider component with customizable min/max values and width. Uses browser default styling with white accent color. Simple continuous value selector. Touch-friendly 40px height. Returns integer values via onChange callback.

---

### CM_CTRL_SliderContinuous
**Original Name**: `Core_Continuous_Slider`  
**Category**: Common / Controls  
**Type**: Widget

**시각적 형태**: Title bar with back arrow → large value display (42px) in center → slider control (244px width) at bottom (y=146)

**설명**: Continuous value slider screen with title bar, large value display, and slider control. Value shown in large font (42px) in center area. Slider positioned at bottom (146px from top). Supports min/max/step configuration. Arrow keys adjust value, Enter confirms.

---

### CM_CTRL_SliderDiscrete
**Original Name**: `Core_Discrete_Slider`  
**Category**: Common / Controls  
**Type**: Widget

**시각적 형태**: Title bar with back arrow → value text display (42px) → segmented bar (5 segments × 44px, 5px height) at y=150px

**설명**: Discrete level slider (segments instead of continuous). Shows title, current level value text, and segmented bar indicator. 5 segments (44px each) with 50px spacing. Active segments shown in primary color, inactive in track color. Arrow keys change level.

---

### CM / Title — 타이틀 바 (2개)

---

### CM_TITLE_Bar
**Original Name**: `CM_Title`  
**Category**: Common / Title  
**Type**: Widget

**시각적 형태**: Title bar strip (320x36px) at screen top with centered white text (30px)

**설명**: Simple title bar widget for displaying centered screen titles. Fixed at top of screen (320x36px), white text (30px semibold) on transparent background. Standard header component used across many screens.

---

### CM_TITLE_WithArrow
**Original Name**: `TitleWithArrow`  
**Category**: Common / Title  
**Type**: Widget

**시각적 형태**: Header bar (320x50px): back arrow icon on left (100x50px) | centered title text (30px white)

**설명**: Standard title bar component with centered title text and optional back arrow. Arrow is clickable 100x50px area at left. Title is 30px semibold centered across full width. Black background, white text. Standard header for list and settings screens.

---

### CM / Overlay — 오버레이·토스트 (3개)

---

### CM_OVERLAY_Guide
**Original Name**: `CM_Overlay_Guide`  
**Category**: Common / Overlay  
**Type**: Widget

**시각적 형태**: Full-screen semi-transparent overlay (rgba(0,0,0,0.85)) with centered white text (25px), covers entire 310x240px area

**설명**: Full-screen overlay guide message component with semi-transparent dark background. Displays centered guide text with fade-in/fade-out animations (167ms). Can auto-dismiss after duration or require manual dismissal. Supports keyboard interaction and multi-line text.

---

### CM_OVERLAY_Toast
**Original Name**: `CM_Dialog_Toast`  
**Category**: Common / Overlay  
**Type**: Widget

**시각적 형태**: Horizontal bar (310px width, variable height) with dark gray background, centered white text (25px LGSBD font), supports multi-line text

**설명**: Single toast message display component with automatic height adjustment based on text line count. Supports format slots for dynamic text replacement. Dark gray background (#313137) with white centered text. Height varies: 1-2 lines (92px), 3-4 lines (120px), 5+ lines (150px).

---

### CM_OVERLAY_ToastQueue
**Original Name**: `CM_Dialog_Toast_Holder`  
**Category**: Common / Overlay  
**Type**: Widget

**시각적 형태**: Container (310x240px) at screen bottom where toast messages slide up from bottom edge, pause, then slide back down

**설명**: Toast notification queue manager with slide-up animations. Manages multiple sequential toast messages with automatic queuing. Animates from bottom with 500ms slide-in, holds for duration, then 500ms slide-out. Supports keyboard interaction and duration customization.

---

### CM / Dialog — 대화상자 (11개)

---

### CM_DIALOG_IconButtons
**Original Name**: `Core_CM_Confirmation`  
**Category**: Common / Dialog  
**Type**: Widget

**시각적 형태**: Centered dialog layout: info icon (62x62px) at top, multi-line description text (25px) in middle, 1-2 horizontal buttons (52px height) at bottom with 12px gap

**설명**: Confirmation dialog with info icon, description text, and 1-2 action buttons at bottom. Dynamic layout adjusts spacing based on description line count. Buttons support left/right navigation with focus states. Info icon (62px) centered with description below and buttons at bottom.

---

### CM_DIALOG_TextButtons
**Original Name**: `Core_CM_ConfirmationButton`  
**Category**: Common / Dialog  
**Type**: Widget

**시각적 형태**: Vertically centered layout: description text at top, two rounded buttons (40px height default, 132px min width) in horizontal row below

**설명**: Confirmation screen with centered description and two horizontal action buttons. Simpler than CM_DIALOG_IconButtons (no icon). Buttons have rounded corners (24px radius), support focus states, and can be navigated with arrow keys. Description centered above buttons.

---

### CM_DIALOG_ScrollDesc
**Original Name**: `Core_CM_Desc_Button`  
**Category**: Common / Dialog  
**Type**: Widget

**시각적 형태**: Three sections: title bar with back arrow (50px), scrollable content area (128px) with gradient masks, button row at bottom (62px height)

**설명**: Screen with title bar, scrollable description area, and 1-2 action buttons at bottom. Description area supports vertical scrolling with up/down arrow keys. Gradient masks at top and bottom indicate scrollable content. Buttons use same styling as CM_DIALOG_IconButtons.

---

### CM_DIALOG_DescOnly
**Original Name**: `Core_CM_Description_Only`  
**Category**: Common / Dialog  
**Type**: Widget

**시각적 형태**: Title bar at top (with back arrow), large centered description area (190px height) below title for multi-line text (25px)

**설명**: Simple screen with title bar (with back arrow) and centered description text only. No buttons or additional UI elements. Useful for displaying information or instructions without user action. Supports keyboard back navigation.

---

### CM_DIALOG_Icon
**Original Name**: `Core_CM_Dialogue_Icon`  
**Category**: Common / Dialog  
**Type**: Widget

**시각적 형태**: Vertically centered: info icon (62x62px) with description text (25px) below, gap varies by text length

**설명**: Simple dialog with centered icon and description text. No title or buttons. Icon (62x62px) displays info/warning/check status. Gap between icon and text adjusts based on text line count (16px for ≤2 lines, 6px for 3+ lines). Minimal centered layout.

---

### CM_DIALOG_IconTitleDesc
**Original Name**: `Core_CM_Dialogue_Icon_Title`  
**Category**: Common / Dialog  
**Type**: Widget

**시각적 형태**: Vertically stacked centered content: icon (62x62px), title text (30px), description text (25px) with 6px spacing between title and description

**설명**: Dialog with icon, title, and description in vertical arrangement. Icon at top (62px), followed by title (30px), then description (25px) with 6px gap. All content centered. No buttons. Used for informational displays.

---

### CM_DIALOG_CustomIcon
**Original Name**: `Core_CM_Dialogue_MidIcon_Title`  
**Category**: Common / Dialog  
**Type**: Widget

**시각적 형태**: Centered vertical layout: custom icon (62x62px), optional title (30px), description (25px) below with 6px gap

**설명**: Similar to CM_DIALOG_IconTitleDesc but with customizable icon source. Displays icon, optional title, and description vertically centered. Supports custom icon images via iconSrc prop. Keyboard handles BACK action only.

---

### CM_DIALOG_TextOnly
**Original Name**: `Core_CM_Dialogue_Only`  
**Category**: Common / Dialog  
**Type**: Widget

**시각적 형태**: Description text only (25px font) centered in middle region of screen, no other UI elements

**설명**: Minimal dialog showing only description text, no icon, title bar, or buttons. Text centered in specific vertical region (y=47px, height=145px). Simplest dialog variant for brief messages. Supports OK and BACK keyboard actions.

---

### CM_DIALOG_TitleDesc
**Original Name**: `Core_CM_Dialogue_Title`  
**Category**: Common / Dialog  
**Type**: Widget

**시각적 형태**: Two text sections: title bar at very top (36px height), description centered below (starting y=80px, 116px height)

**설명**: Dialog with title bar at screen top and description in center region. Title displayed in fixed area (36px height) at top, description in center area (116px height starting at y=80px). No icon or buttons. Clean two-section layout.

---

### CM_DIALOG_TitleIconStack
**Original Name**: `Core_CM_Dialogue_Title_Icon`  
**Category**: Common / Dialog  
**Type**: Widget

**시각적 형태**: Vertically centered: icon (62x62px) → title (30px) → description (25px), all centered with 6px gap between title and description

**설명**: Dialog combining icon, title, and description in centered vertical stack. Icon at top (62x62px), title below (30px), description at bottom (25px) with 6px gap. Supports custom icon source. Handles BACK keyboard action.

---

### CM_DIALOG_TitleWide
**Original Name**: `Core_CM_Dialogue_W_Title`  
**Category**: Common / Dialog  
**Type**: Widget

**시각적 형태**: Two sections: compact title bar at top (36px), large description area below (204px height) for extensive text content

**설명**: Dialog with integrated title bar and large description area. Title in fixed bar (36px) at screen top, description fills remaining space (204px height). Maximizes description area while keeping title visible. Handles BACK action.

---

### CM / List — 리스트·그리드 (14개)

---

### CM_LIST_Vertical
**Original Name**: `Core_CM_Ver_List`  
**Category**: Common / List  
**Type**: Widget

**시각적 형태**: Title bar with back arrow (50px) → scrollable list area (190px) → top/bottom gradient masks for scroll indication

**설명**: Complete vertical list screen assembly with title bar, scrollable list view, and gradient masks. Combines CM_TITLE_WithArrow and CM_LIST_ScrollView components. Gradient masks at top and bottom indicate scrollable content. Standard layout for list-based screens.

---

### CM_LIST_Vertical2Col
**Original Name**: `Core_CM_Ver_List_2nd`  
**Category**: Common / List  
**Type**: Widget

**시각적 형태**: Title bar with back arrow (50px) → scrollable 2-column list area (190px) → gradient masks

**설명**: Two-column vertical list screen with title bar and CM_LIST_ScrollView2Col. Similar structure to CM_LIST_Vertical but uses 2-column item layout. Includes gradient masks and standard navigation. For displaying paired or comparative information.

---

### CM_LIST_SwitchList
**Original Name**: `Core_CM_Ver_Switch_List`  
**Category**: Common / List  
**Type**: Widget

**시각적 형태**: Title bar (optional) → scrollable list area (190px) with items (68px): label text | toggle switch on right side

**설명**: Vertical scrollable list where each item has a toggle switch. Items show label and switch on right. Switches can be ON (0), OFF (1), or Hidden (2). Manages internal toggle states. Title bar with optional back arrow. Items 68px height, container 190px.

---

### CM_LIST_SingleSelect
**Original Name**: `Core_CM_Listview_Ver_Single`  
**Category**: Common / List  
**Type**: Widget

**시각적 형태**: Title bar (50px) → scrollable list (190px) with items (68px): checkmark icon (if selected) | label text, disabled items shown in gray

**설명**: Vertical scrollable list with single selection (radio-style). Selected item shows blue checkmark icon. Items can be enabled/disabled (gray when disabled). Title bar with back arrow. Items 68px height, scrollable viewport 190px. Keyboard navigation and selection.

---

### CM_LIST_MultiSelect
**Original Name**: `Core_CM_Listview_Ver_3rd`  
**Category**: Common / List  
**Type**: Widget

**시각적 형태**: Title bar (50px) → scrollable list area (190px) with checkbox items (68px each): checkbox icon | label text | optional description

**설명**: Vertical scrollable list with checkboxes (multiple selection). Each item shows checkbox icon, label, and optional description. Supports checked/unchecked/disabled states. Title bar with back arrow at top. Items are 68px height, scrollable viewport is 190px. Keyboard navigation for focus and toggle.

---

### CM_LIST_Reorder
**Original Name**: `Core_CM_Listview_Ver_Reorder`  
**Category**: Common / List  
**Type**: Widget

**시각적 형태**: Title bar (50px) → scrollable list (190px) with items (68px): label text | drag handle icon on right, visual feedback during reorder

**설명**: Vertical scrollable list with drag handles for reordering items. Enter key starts reorder mode, arrows move item, Enter confirms, Escape cancels. Each item shows label and drag handle icon (right side). Title bar with back arrow. Items 68px height, viewport 190px.

---

### CM_LIST_ScrollView
**Original Name**: `VerticalListView`  
**Category**: Common / List  
**Type**: Widget

**시각적 형태**: Scrollable container (320x190px) with vertically stacked items (68px each), auto-scroll to keep selection visible

**설명**: Scrollable vertical list view managing array of CM_LIST_Item components. Calculates scroll offset to keep focused item visible. Supports enabled/disabled items, selection highlighting, and keyboard navigation. Item height 68px, viewport 190px.

---

### CM_LIST_ScrollView2Col
**Original Name**: `VerticalListView2nd`  
**Category**: Common / List  
**Type**: Widget

**시각적 형태**: Scrollable two-column list (320x190px) with items showing label | value pairs in 68px rows

**설명**: Two-column vertical list view using CM_LIST_Item2Col components. Similar scrolling behavior to CM_LIST_ScrollView but with label/value column layout. Item height 68px, viewport 190px. Keyboard navigation and auto-scroll.

---

### CM_LIST_Item
**Original Name**: `VerticalListItem`  
**Category**: Common / List  
**Type**: Widget

**시각적 형태**: List item (320x68px): label text (30px) + optional description (21px) below, white/gray colors based on enabled state

**설명**: Basic vertical list item showing main label and optional description. Supports enabled/disabled states. Description shown below label (21px font vs 30px label). Width adjusts based on presence of right-side elements. Selection background highlight.

---

### CM_LIST_Item2Col
**Original Name**: `VerticalListItem2nd`  
**Category**: Common / List  
**Type**: Widget

**시각적 형태**: Two-column item (320x68px): label (170px, left-aligned) | value (130px, right-aligned), both 30px font

**설명**: Two-column list item variant with label on left and value on right. Fixed widths: label area 170px, value area 130px. Supports enabled/disabled states. Both label and value can independently show enabled/disabled styling.

---

### CM_LIST_ItemFull
**Original Name**: `Core_CM_Ver_ListItem`  
**Category**: Common / List  
**Type**: Widget

**시각적 형태**: Horizontal layout (320x68px): [optional left icon 32px] | [label + description area] | [optional right element/label] with selection background

**설명**: Versatile list item component supporting multiple configurations: left icons (checkbox/radio/handle), main label with optional description, right elements (sub-label/switch/reorder indicator). Height 68px. Supports enabled/disabled states, selection highlighting. Base component for various list types.

---

### CM_LIST_Grid
**Original Name**: `Core_CM_gridview`  
**Category**: Common / List  
**Type**: Widget

**시각적 형태**: 2x2 grid layout (2 columns × 2 rows), page indicators dots at top, navigation arrows on left/right sides, items with dual-line text

**설명**: 2x2 grid view with pagination. Displays 4 items per page in 2-column layout. Each item shows label1 (28px white) and label2 (28px gray) stacked vertically. Supports keyboard navigation with arrows for grid movement and page switching. Page indicators at top show current page.

---

### CM_LIST_HorizontalPager
**Original Name**: `Core_CM_Hor_List`  
**Category**: Common / List  
**Type**: Widget

**시각적 형태**: Full-width horizontal pages (320x240px each), page indicator dots at top (y=6px), smooth 300ms transitions, each page fills entire screen

**설명**: Full-screen horizontal pager (320px per page) with smooth page transitions. Supports two variants: standard (large centered label + optional sub-label + optional command button) and 2nd depth (title/value/description layout). Dot indicators at top show page position.

---

### CM_LIST_HorizontalCarousel
**Original Name**: `Core_CM_Hor_Dynamic`  
**Category**: Common / List  
**Type**: Widget

**시각적 형태**: Horizontal scrolling carousel with large centered item (118px width), partial side items visible, gradient fade masks on edges, optional title bar

**설명**: Horizontal dynamic carousel picker with centered item and partial preview of adjacent items. Features smooth 300ms slide animations between items. Large centered text (49px) with fade masks on left/right edges. Optional title at top. Items arranged horizontally with 40px gaps.

---

### CM / Picker — 피커 컨트롤 (12개)

---

### CM_PICKER_HorizontalSel
**Original Name**: `Core_CM_picker_Hor_Sel`  
**Category**: Common / Picker  
**Type**: Widget

**시각적 형태**: Horizontal picker: optional title → scrolling items (118px width, 168px height area) with centered selection, optional checkboxes above text

**설명**: Horizontal scrolling picker with centered selection item. Supports two modes: single selection (no checkbox) and multiple selection (with checkboxes). Large text (49px) for items, smooth 300ms scroll animation. Optional title at top. Centered item is focused/selected.

---

### CM_PICKER_Vertical
**Original Name**: `Core_CM_picker_Ver`  
**Category**: Common / Picker  
**Type**: Widget

**시각적 형태**: Three item slots (94px each) with horizontal dividers at y=71 and y=167, centered item highlighted, gradient mask overlay, optional value text below title

**설명**: Vertical scrolling picker with 3 visible items and centered selection. Item height 94px, supports title and optional value fields. Value only shown for selected item. Divider lines above/below selection area. Mask overlay for gradient effect. Smooth 300ms scrolling.

---

### CM_PICKER_VerticalTitled
**Original Name**: `Core_CM_picker_Ver_2nd`  
**Category**: Common / Picker  
**Type**: Widget

**시각적 형태**: Title bar (36px) → picker area (204px) with 3 item slots (68px each), horizontal dividers at selection boundaries, gradient mask overlay

**설명**: Vertical picker with title bar and 3 visible items. Similar to CM_PICKER_Vertical but with integrated title at top (36px). Items are 68px height, supports small font variant. Dividers at top/bottom of selection area. Gradient mask (5px left offset).

---

### CM_PICKER_VerticalValue
**Original Name**: `Core_CM_picker_Ver_List`  
**Category**: Common / Picker  
**Type**: Widget

**시각적 형태**: Three item picker with title texts (36px), fixed value label below center (30px) with fade animation, subtle curved arrangement, dividers and mask

**설명**: Vertical picker with value label that fades in/out on selection change. Shows title in picker items (36px) and value below (30px) when selected. Value fades out (150ms), updates, then fades in on scroll. Curved offset animation for previous/next items (+9px/-10px/-19px).

---

### CM_PICKER_NumericCarousel
**Original Name**: `Core_Hor_LeftRight`  
**Category**: Common / Picker  
**Type**: Widget

**시각적 형태**: Title at top → three horizontal value slots (118px each) with center emphasis → unit label with fade transitions

**설명**: Horizontal numeric picker with title, 3 visible values, and unit label with fade effect. Values slide left/right (500ms animation). Center value is emphasized. Unit label fades out during transitions. Supports configurable start/end/stride values. Infinite scroll picker design.

---

### CM_PICKER_Vertical1st
**Original Name**: `VerticalList1stDepth`  
**Category**: Common / Picker  
**Type**: Widget

**시각적 형태**: Optional title area → 3-item vertical picker stack with centered selection → fade-in/out value display → gradient mask overlay

**설명**: Infinite scroll vertical picker with 3 visible items (TOP, MID, LOW positions). Shows title, main text, and value for selected item. Value fades out/in (100ms/167ms) on selection change. Title visibility toggles based on selection (always visible at index 0 or if titleShowAlways=true). Supports enabled/disabled states.

---

### CM_PICKER_Vertical1stItem
**Original Name**: `VerticalList1stDepthItem`  
**Category**: Common / Picker  
**Type**: Widget

**시각적 형태**: Text item (300x94px) with position-based vertical offset, centered 36px white/gray text, smooth transitions

**설명**: Individual item for CM_PICKER_Vertical1st with position-based vertical offset animation. TOP position: +12px, MID: -19px (if has value) or 0px, LOW: -12px. Supports enabled/disabled states (gray when disabled). Text centered in 94px cell.

---

### CM_PICKER_Vertical2nd
**Original Name**: `VerticalList2ndDepth`  
**Category**: Common / Picker  
**Type**: Widget

**시각적 형태**: Title bar (36px) → vertical picker with dividers (top: 104px, bottom: 172px) → optional unit label → gradient mask

**설명**: Second-depth vertical picker with title, unit label, and item list. Handles up/down navigation internally, delegates OK/LEFT/RIGHT/BACK to external handler. Shows title at top, dividers around selection area, optional unit label. Supports item-based unit hiding.

---

### CM_PICKER_Vertical2ndItem
**Original Name**: `VerticalList2ndDepthItem`  
**Category**: Common / Picker  
**Type**: Widget

**시각적 형태**: Centered text item with smooth color transition between white (selected) and gray (#cdcdcd) states, 40px font

**설명**: Item component for 2nd depth picker. Shows text with selection-based color transition (white when selected, gray when not). 40px LGSBD23 font, centered in cell. 300ms color transition for smooth selection changes.

---

### CM_PICKER_VerticalCore
**Original Name**: `VerticalListPicker`  
**Category**: Common / Picker  
**Type**: Widget

**시각적 형태**: Three vertically stacked items (68px each) with smooth translateY scrolling, center item selection

**설명**: Core vertical picker component managing 3 visible items with smooth scroll transitions. Calculates CENTER_OFFSET for alignment, applies transform for scrolling. Wrapped by CM_PICKER_Vertical2nd for full screen integration.

---

### CM_PICKER_Mask2nd
**Original Name**: `WDOptionMask2ndDepth`  
**Category**: Common / Picker  
**Type**: Widget

**시각적 형태**: Conditional overlay masks at top/bottom of picker area based on mode setting

**설명**: Configurable mask/overlay component for 2nd depth picker screens. Supports multiple display modes: hidden, top-only, bottom-only, or both masks. Displays dimming overlays or visual indicators at top/bottom of picker area. Component for visual feedback.

---

### CM_PICKER_Roller
**Original Name**: `WD_Roller`  
**Category**: Common / Picker  
**Type**: Widget

**시각적 형태**: 3-slot vertical picker with dividers (68px items), center item selected, smooth scrolling with wrapping

**설명**: Vertical roller picker component (iOS-style picker wheel). Shows 3 items with center selection. Supports infinite wrapping, smooth scroll animations. Used in clock setting and value selection. Divider lines mark selection area.

---

### CM / Progress — 진행 표시기 (2개)

---

### CM_PROGRESS_Bar
**Original Name**: `Core_CM_Progress_Bar`  
**Category**: Common / Progress  
**Type**: Widget

**시각적 형태**: Vertical layout: title at top → large time display (87px digits + 25px units) → progress bar (y=149px) → bottom labels and description

**설명**: Horizontal progress bar with title, large time display, and visual progress indicator. Shows hours and minutes in large font (87px) with units (25px). Progress bar animates across 320px width using translateX formula. Bottom description and label texts. Supports unit customization.

---

### CM_PROGRESS_Spinner
**Original Name**: `Core_CM_Proress_Indicator`  
**Category**: Common / Progress  
**Type**: Widget

**시각적 형태**: Centered layout: animated loading spinner (62x62px) at top, description text (25px) below spinner, black background

**설명**: Loading spinner widget with rotating 50-frame animation (blue spinner, 62x62px). Optional description text below spinner (25px). Spinner positioned at top-center area, label below. Continuous rotation animation for loading/processing states.

---

### CM / Label — 텍스트 레이블 (2개)

---

### CM_LABEL_Smart
**Original Name**: `NextLabelLite`  
**Category**: Common / Label  
**Type**: Widget

**시각적 형태**: Text container that auto-scales font or scrolls if needed, gradient fade masks during scrolling, alignment-aware positioning

**설명**: Smart label with automatic font fitting and scrolling. Attempts to fit text by reducing font size (minimum calculated from base). If still doesn't fit, enters scroll mode (horizontal for single-line, vertical for multi-line). 2-second delay before scroll starts. Wrap-around scrolling with gradient masks.

---

### CM_LABEL_Formatted
**Original Name**: `NextFmtLabelLite`  
**Category**: Common / Label  
**Type**: Widget

**시각적 형태**: Flexible text/image container with auto-sizing, scrolling text when too long, gradient masks during scroll, inline images and styled slots

**설명**: Advanced formatted label with slot-based templating. Supports format strings with {0}, {1} placeholders for STRING/IMAGE/NUMBER slots. Auto font fitting (scales down if overflow), scroll mode if fitting fails (horizontal/vertical). 2-second delay before scrolling. Wrap-around scrolling with masks.

---

### CM / Animation — 애니메이션 (4개)

---

### CM_ANIM_Sequence
**Original Name**: `ImageSequence`  
**Category**: Common / Animation  
**Type**: Widget

**시각적 형태**: Container (customizable width/height) displaying sequential images with timed transitions, images scaled to fit

**설명**: Core image sequence player that cycles through array of images at fixed intervals. Supports repeat mode (infinite loop) or single play with completion callback. Calculates frame duration by dividing total duration by frame count. Basic building block for animations.

---

### CM_ANIM_SequencePlayer
**Original Name**: `ImageSequencePlayer`  
**Category**: Common / Animation  
**Type**: Widget

**시각적 형태**: Black background container (100% size) playing sequential animation playlists, each with configurable dimensions and loop settings

**설명**: Advanced playlist-based image sequence player. Plays multiple sequences in order with individual durations and repeat settings. Auto-advances to next item on completion. Supports item-specific dimensions. Calls onComplete when entire playlist finishes.

---

### CM_ANIM_IntroLoop
**Original Name**: `imgseqopt_Intro_Loop`  
**Category**: Common / Animation  
**Type**: Widget

**시각적 형태**: Full-size container playing intro animation once, then seamlessly transitioning to looping animation

**설명**: Two-phase animation player: intro sequence (plays once) → loop sequence (repeats infinitely). Automatically transitions from intro to loop on completion. If no intro provided, starts with loop immediately. Useful for splash screens and idle animations.

---

### CM_ANIM_Digit
**Original Name**: `DigitAnim`  
**Category**: Common / Animation  
**Type**: Widget

**시각적 형태**: Single digit cell (85px height) with translating number that slides vertically when changing, three-slot animation system (previous/current/next)

**설명**: Animated single digit component with vertical slide transitions. Shows current digit with smooth slide animation when value changes (667ms ease-in-out). Direction determines slide up or down. Supports negative values (displays hyphen). Uses 87px font with 85px cell height.

---

### CM / Display — 특수 화면 상태 (1개)

---

### CM_DISPLAY_Black
**Original Name**: `WD_Black_Widget`  
**Category**: Common / Display  
**Type**: Widget

**시각적 형태**: Solid black rectangle (310x240px), no content or interaction

**설명**: Simple full-black screen widget for screen-off state or transitions. Minimal component that renders black rectangle (310x240px). Used between screens or for power-saving display.

---

<!-- ═══════════════════════════════════════════════ -->
## 🟢 WD — Washer/Dryer (세탁기/건조기) 35개
<!-- ═══════════════════════════════════════════════ -->

---

### WD / Animation — 부팅·감지 애니메이션 (4개)

---

### WD_ANIM_Boot
**Original Name**: `WD_BootAnim`  
**Category**: WD / Animation  
**Type**: Widget

**시각적 형태**: Full-screen sequential animation player for boot sequences (ThinQ logo → product intro)

**설명**: Boot animation orchestrator managing multiple sequential CM_ANIM_SequencePlayer playlists. Converts animation definitions into playlist format and plays them in order. Calls onReady when complete sequence finishes.

---

### WD_ANIM_BootScreen
**Original Name**: `WD_Booting_Widget`  
**Category**: WD / Animation  
**Type**: Widget

**시각적 형태**: Centered logo animation with optional loading text below

**설명**: Standard boot screen with logo animation and loading text. Shows animated logo playlist centered with status message below. Typical boot sequence component.

---

### WD_ANIM_BootUpgrade
**Original Name**: `WD_Booting_Upgrade_Widget`  
**Category**: WD / Animation  
**Type**: Widget

**시각적 형태**: Centered upgrade message text on black background during boot

**설명**: Firmware upgrade boot screen showing upgrade progress message. Displays centered text indicating system update in progress. Used during SOTA updates at boot time.

---

### WD_ANIM_Sensing
**Original Name**: `WD_Sensing`  
**Category**: WD / Animation  
**Type**: Widget

**시각적 형태**: Centered sensing animation (intro then loop) with rotating description text below showing detection status

**설명**: Fabric sensing display with intro→loop animation and rotating status descriptions. Shows sensing operation animation with text cycling through detection messages. Uses CM_ANIM_IntroLoop for animation.

---

### WD / Dialog — 세탁기 전용 대화상자 (7개)

---

### WD_DIALOG_Basic
**Original Name**: `WD_Dialog_Basic`  
**Category**: WD / Dialog  
**Type**: Widget

**시각적 형태**: Vertical centered layout: title text → icon (62x62px or custom) → multi-line description → optional bottom animation

**설명**: Full-featured basic dialog with title, icon (warning/info/check/loading/custom image), description text, and optional bottom animation. Dynamic layout based on content. Icon size 62px, supports various types and custom sources.

---

### WD_DIALOG_QRCode
**Original Name**: `WD_Dialog_QR`  
**Category**: WD / Dialog  
**Type**: Widget

**시각적 형태**: Vertical modal layout: title text (25px) → centered QR code (max 80% size) → description text below (21px)

**설명**: Error dialog displaying QR code for support links. Shows title text, centered QR code (scaled to 80% max size), and description below. QR code generated from URL prop using qrcode.react library.

---

### WD_DIALOG_Unlock
**Original Name**: `WD_Dialog_Unlock`  
**Category**: WD / Dialog  
**Type**: Widget

**시각적 형태**: Centered lock icon animation (customizable) → instruction text below, visual changes during unlock process

**설명**: Child lock unlock dialog with lock icon animation and instruction text. Shows animated lock icon during unlock gesture. Changes icon and text when isUnlocking=true. Calls onComplete when unlocked.

---

### WD_DIALOG_AnimIcon
**Original Name**: `WD_Dialogue_Icon`  
**Category**: WD / Dialog  
**Type**: Widget

**시각적 형태**: Centered animated icon (customizable size) → multi-line description text (25px) below

**설명**: Dialogue with animated icon and multi-line text. Icon animation played via CM_ANIM_SequencePlayer, text displayed below. Centered layout with keyboard support. Used for status messages with visual feedback.

---

### WD_DIALOG_TextOnly
**Original Name**: `WD_Dialogue_Only`  
**Category**: WD / Dialog  
**Type**: Widget

**시각적 형태**: Centered multi-line text message (25px) on black background, no other UI elements

**설명**: Simple dialogue showing only centered multi-line text message. No icons, title, or buttons. Minimal component for brief messages. Supports keyboard back action.

---

### WD_DIALOG_ChildLock
**Original Name**: `WD_ChildLock_Widget`  
**Category**: WD / Dialog  
**Type**: Widget

**시각적 형태**: Centered lock icon animation (62x62px) with instruction text below (25px)

**설명**: Child lock status display with lock icon animation and instruction text. Shows animated lock icon centered with text below indicating child lock is active. Keyboard interaction support.

---

### WD_DIALOG_Accessory
**Original Name**: `WD_Accessory_Widget`  
**Category**: WD / Dialog  
**Type**: Widget

**시각적 형태**: Centered text display (25px) for accessory status messages on black background

**설명**: Accessory status display widget showing text message. Simple centered layout with CM_LABEL_Smart for displaying accessory-related information (e.g., 'Steam Generator Ready'). Keyboard interaction support.

---

### WD / Clock — 시계·시간 (7개)

---

### WD_CLOCK_Idle
**Original Name**: `WD_Clock_Widget`  
**Category**: WD / Clock  
**Type**: Widget

**시각적 형태**: Centered time display (large font) → date text below → optional energy icon at bottom or top

**설명**: Clock idle screen showing current time, date, and optional energy saver icon. Large time display (LOCK3B23 font) with date below. Minimalist clock widget for idle/standby mode.

---

### WD_CLOCK_Analog
**Original Name**: `lv_std_clock_theme_analog`  
**Category**: WD / Clock  
**Type**: Widget

**시각적 형태**: Circular analog clock face (320x240) with three rotating hands (hour/minute/second), hour digit at current position, theme-colored hour hand

**설명**: Analog clock widget with rotating hands and circular hour digits. Shows hour/minute/second hands rotating around center. Current hour digit highlighted. Supports theme colors (blue/orange). Hour positions arranged in circle pattern. Hands rotate smoothly with proper angles.

---

### WD_CLOCK_Digital
**Original Name**: `lv_std_clock_theme_digital`  
**Category**: WD / Clock  
**Type**: Widget

**시각적 형태**: Centered digital display: AM/PM text (24px, colored) → large time (86px) → date text (24px) below

**설명**: Digital clock widget showing time in large format (HH:MM) with AM/PM indicator and date. AM shown in orange, PM in blue. Time displayed in extra-large LOCK3B23 font (86px). Date shown below (24px). Simple centered layout.

---

### WD_CLOCK_SetTime
**Original Name**: `WD_CM_SetClock`  
**Category**: WD / Clock  
**Type**: Widget

**시각적 형태**: Title bar → three horizontal roller pickers (hour | minute | AM/PM) for time setting

**설명**: Clock setting widget using roller pickers for hour, minute, and AM/PM selection. Three CM_PICKER_Roller components arranged horizontally. Title shows 'Set Clock' at top. Manages time selection state.

---

### WD_CLOCK_Picker
**Original Name**: `WD_TimePicker`  
**Category**: WD / Clock  
**Type**: Widget

**시각적 형태**: Three horizontal roller pickers: hour (1-12) | minute (00-59) | AM/PM selector

**설명**: Time picker component using three CM_PICKER_Roller pickers for hour, minute, and AM/PM selection. Manages time state internally. Converts between 12/24 hour formats. Fires onChange with hour/minute/isPM values.

---

### WD_CLOCK_Reservation
**Original Name**: `WD_FinishReservation`  
**Category**: WD / Clock  
**Type**: Widget

**시각적 형태**: Course info section → reservation time display (date, AM/PM, HH:MM) → progress information below

**설명**: Reservation finish time display combining course progress and reservation time. Shows when wash will complete with date, AM/PM, hour, minute. Includes course info and progress status. Theme-aware styling.

---

### WD_CLOCK_ReservationTime
**Original Name**: `WD_FinishReservationTime`  
**Category**: WD / Clock  
**Type**: Widget

**시각적 형태**: Three-line display: date text → AM/PM (colored) → HH:MM time (large font)

**설명**: Reservation time display component showing date, AM/PM indicator, and time (HH:MM format). Used within WD_CLOCK_Reservation. Theme colors for AM/PM (orange/blue).

---

### WD / Course — 코스 선택·진행 (9개)

---

### WD_COURSE_List
**Original Name**: `WD_CourseList`  
**Category**: WD / Course  
**Type**: Widget

**시각적 형태**: Horizontal scrolling course list with page indicators at top, course items showing options and icons, navigation arrows

**설명**: Multi-page horizontal list of washing courses with smooth scrolling. Shows course items with indicators, page dots, and optional titles (Cloud Cycle, Additional Cycles). Energy saver icon when enabled. Complex navigation and state management.

---

### WD_COURSE_Item
**Original Name**: `WD_CourseList_Item`  
**Category**: WD / Course  
**Type**: Widget

**시각적 형태**: Course item (310px width): title area with icons (AI/TM/Pentagon) → options list (up to 4) → optional FastDL status animation

**설명**: Complex course item displaying course name, type indicators (AI/Cloud/ThinQ), options list, and FastDL status. Supports multiple course types with distinct styling. Shows up to 4 course options. Animation for FastDL detecting state.

---

### WD_COURSE_ItemOption
**Original Name**: `WD_CourseList_Item_Option`  
**Category**: WD / Course  
**Type**: Widget

**시각적 형태**: Single line option text (21px, gray #cdcdcd) showing 'name: value unit' format

**설명**: Single course option display (name + value + unit) using CM_LABEL_Formatted. Shows formatted option text like 'Heavy Soil: 40°C'. Part of course item options list.

---

### WD_COURSE_Editor
**Original Name**: `WD_CourseListEdit`  
**Category**: WD / Course  
**Type**: Widget

**시각적 형태**: Title bar (CM_Title) → scrollable list of course items with checkboxes (68px height), gradient masks

**설명**: Scrollable vertical list for editing course favorites with checkboxes. Title bar at top, list items show checkbox state and course info. Manages internal toggle states. Mandatory courses cannot be unchecked.

---

### WD_COURSE_EditorItem
**Original Name**: `WD_CourseListEdit_Item`  
**Category**: WD / Course  
**Type**: Widget

**시각적 형태**: Horizontal item layout: checkbox icon | course title (with optional pentagon) + description | visual states for selection

**설명**: Individual checkbox list item for course editing. Shows checkbox icon, course title with optional pentagon, description text. Item height 68px. Supports checked/unchecked/mandatory states.

---

### WD_COURSE_ProgressBase
**Original Name**: `WD_CourseProgressBase`  
**Category**: WD / Course  
**Type**: Widget

**시각적 형태**: Multi-section vertical layout: course title → remaining/reservation time → progress bar → status text → description → indicators

**설명**: Base component for course progress screens. Combines course title, remaining time, progress bar, status text, and indicators. Supports reservation mode with different time display. Complex layout with multiple sub-widgets. Animation for blinking status text.

---

### WD_COURSE_Running
**Original Name**: `WD_CourseRunning`  
**Category**: WD / Course  
**Type**: Widget

**시각적 형태**: Course progress display (310x240px) showing title, time, progress, status during wash

**설명**: Active washing course display using WD_COURSE_ProgressBase. Shows all course progress information during active wash cycle. Provides proper layout dimensions and composition for the base component.

---

### WD_COURSE_ProgressFinish
**Original Name**: `WD_CourseProgressFinish`  
**Category**: WD / Course  
**Type**: Widget

**시각적 형태**: Course title at top → rotating content slot (images/animations/text) cycling through completion assets

**설명**: Course completion screen with rotating content carousel. Shows course title and cycles through completion images, image sequences, and descriptions. Toggle period controls cycle speed. Theme-aware colors.

---

### WD_COURSE_ProgressTitle
**Original Name**: `WD_CourseProgressTitle`  
**Category**: WD / Course  
**Type**: Widget

**시각적 형태**: Course name text (30px) with optional inline icons (AI: 15x15px, Pentagon: 18x18px)

**설명**: Course title component showing course name with optional AI/pentagon icons. Uses CM_LABEL_Formatted for formatted text with icon slots. Supports auto font sizing. Used in progress screens.

---

### WD / Progress — 세탁 진행 표시기 (5개)

---

### WD_PROGRESS_Bar
**Original Name**: `WD_ProgressBar`  
**Category**: WD / Progress  
**Type**: Widget

**시각적 형태**: Horizontal bar indicator showing progress percentage with animated fill, theme-colored

**설명**: Horizontal progress bar widget for washer dryer. Shows progress percentage with visual bar animation. Theme-aware colors (blue/orange). Smooth progress updates with translateX animation.

---

### WD_PROGRESS_Circle
**Original Name**: `WD_Progress_Circle`  
**Category**: WD / Progress  
**Type**: Widget

**시각적 형태**: Circular arc progress ring → center status icon → description text below, percentage displayed

**설명**: Circular progress indicator with percentage display, center icon, and description text. Arc animates around circle showing progress (0-100%). Status icon shown in center. Used for cycle progress.

---

### WD_PROGRESS_SOTA
**Original Name**: `WD_Progress_SOTA`  
**Category**: WD / Progress  
**Type**: Widget

**시각적 형태**: Title text → progress percentage display → loading animation indicator

**설명**: SOTA firmware upgrade progress display with title, percentage, and loading animation. Shows update progress during over-the-air software updates. Theme-aware styling.

---

### WD_PROGRESS_RemainTime
**Original Name**: `WD_RemainTime`  
**Category**: WD / Progress  
**Type**: Widget

**시각적 형태**: Large animated digit display: [H]H → 'hr' → [M]M → 'min' with smooth digit transitions

**설명**: Remaining time display showing hours and minutes with large animated digits. Uses CM_ANIM_Digit components for smooth number transitions. Includes 'hr' and 'min' unit labels. Shows time left in current operation.

---

### WD_PROGRESS_ValveCheck
**Original Name**: `WD_ValveCheck`  
**Category**: WD / Progress  
**Type**: Widget

**시각적 형태**: Vertically centered: progress percentage display → description text below

**설명**: Water valve check progress display showing percentage and description. Theme-aware colors. Shows status during water inlet valve testing. Simple progress indicator.

---

### WD / Toast — 알림 (1개)

---

### WD_TOAST_Message
**Original Name**: `WD_Toast`  
**Category**: WD / Toast  
**Type**: Widget

**시각적 형태**: Dark gray rounded rectangle (310px width, auto height) with centered white text (25px)

**설명**: Individual toast message component (used by CM_OVERLAY_ToastQueue). Shows formatted text in dark gray rounded rectangle. Auto-sized height based on text lines. Supports format slots.

---

### WD / Pager — 페이지 기반 (1개)

---

### WD_PAGER_Base
**Original Name**: `WD_Pager`  
**Category**: WD / Pager  
**Type**: Widget

**시각적 형태**: Horizontal page container with smooth transitions, page indicator dots at top, full-width pages (310px)

**설명**: Base horizontal pager component for multi-page content. Manages page state, transitions (300ms), and page indicators. Children rendered as full-width pages. Navigation via arrow keys. Foundation for WD_COURSE_List and other pager-based widgets.

---

### WD / Decoration — 장식 (1개)

---

### WD_DECORATION_Divider
**Original Name**: `WD_DividerVertical`  
**Category**: WD / Decoration  
**Type**: Widget

**시각적 형태**: Vertical line divider (customizable dimensions and color) for UI section separation

**설명**: Simple vertical divider line component for separating UI sections. Customizable height, width, position, and color. Basic visual separator element.

---

<!-- ═══════════════════════════════════════════════ -->
## 🟠 OV — Oven (오븐) 7개
<!-- ═══════════════════════════════════════════════ -->

---

### OV / Title — 타이틀 (1개)

---

### OV_TITLE_2Line
**Original Name**: `WD_CM_oven_title_2line`  
**Category**: Oven / Title  
**Type**: Widget

**시각적 형태**: Two-line text title display formatted for oven interface styling

**설명**: Two-line oven title component for oven-specific screens. Displays title text with proper formatting for oven UI style. Used in oven cooking mode displays.

---

### OV / Dialog — 오븐 전용 대화상자 (1개)

---

### OV_DIALOG_TitleIcon
**Original Name**: `WD_CM_Title_Dialogue_Icon`  
**Category**: Oven / Dialog  
**Type**: Widget

**시각적 형태**: Title area → centered icon (if provided) → content text below

**설명**: Dialog variant combining title text, centered content text, and optional icon. Used for oven-specific dialogs with icon support. Structured layout with title region and content area.

---

### OV / Cook — 조리 모드·완료 (4개)

---

### OV_COOK_Finished
**Original Name**: `WD_CookFinished`  
**Category**: Oven / Cook  
**Type**: Widget

**시각적 형태**: Oven title (2-line) → rotating completion visuals (images/animations) → completion text

**설명**: Cooking completion screen for oven. Shows oven title, completion message, rotating finish images/animations, and completion sound. Content cycles through visual assets. Uses oven-specific styling.

---

### OV_COOK_ModeItem
**Original Name**: `WD_CookMode_Item`  
**Category**: Oven / Cook  
**Type**: Widget

**시각적 형태**: Cooking mode display: mode name → temperature → mode icon, centered layout

**설명**: Individual cooking mode item for oven mode selection. Displays mode name, temperature, icon. Used in OV_COOK_ModePager for showing available cooking programs.

---

### OV_COOK_ModePager
**Original Name**: `WD_CookMode_Pager`  
**Category**: Oven / Cook  
**Type**: Widget

**시각적 형태**: Horizontal pager displaying cooking mode items with smooth page transitions

**설명**: Horizontal pager for oven cooking modes using WD_PAGER_Base. Each page shows OV_COOK_ModeItem with mode details. Horizontal navigation through available cooking programs.

---

### OV_COOK_AutoPager
**Original Name**: `WD_AutoCook_Pager`  
**Category**: Oven / Cook  
**Type**: Widget

**시각적 형태**: Horizontal pager for auto-cook modes with page indicators and smooth transitions

**설명**: Auto-cook mode horizontal pager using WD_PAGER_Base. Displays cooking modes across multiple pages with navigation. Shows mode labels and cycling through available auto-cook programs.

---

### OV / Progress — 조리 진행 표시기 (1개)

---

### OV_PROGRESS_Cooking
**Original Name**: `WD_Oven_Progress_Widget`  
**Category**: Oven / Progress  
**Type**: Widget

**시각적 형태**: Oven-styled progress display with cooking status, time, temperature information

**설명**: Oven cooking progress display widget. Shows oven-specific progress information during cooking. Similar to WD_COURSE_Running but adapted for oven UI patterns.

---

## 🚫 제외된 래퍼 목록 (RAG 미인덱싱)

래퍼(Wrapper)는 실제 위젯을 감싸는 화면 레벨 컴포넌트입니다. ScreenArchitectAgent가 이미 위젯을 import하는 래퍼를 LLM으로 생성하므로, RAG에 래퍼를 저장하면 "래퍼를 감싸는 래퍼" 형태로 이중 래핑 문제가 발생합니다.

| 래퍼 이름 | 관련 위젯 (신규 이름) |
|-----------|---------------------|
| `BasicDialog` | `WD_DIALOG_Basic` |
| `BootAnimEx` | `WD_ANIM_Boot` |
| `ClockThemeEx` | `WD_CLOCK_Analog`, `WD_CLOCK_Digital` |
| `CourseEx` | `WD_COURSE_List` |
| `CourseItemEx` | `WD_COURSE_Item` |
| `CourseListEditEx` | `WD_COURSE_Editor` |
| `CourseProgressEx` | `WD_COURSE_Running` |
| `DialogQREx` | `WD_DIALOG_QRCode` |
| `FinishReservationEx` | `WD_CLOCK_Reservation` |
| `ImgoptListPlayerEx` | `CM_ANIM_SequencePlayer` |
| `OverlayEx` | `CM_OVERLAY_Guide` |
| `ProgressCircleEx` | `WD_PROGRESS_Circle` |
| `ProgressFinishEx` | `WD_COURSE_ProgressFinish` |
| `ProgressSotaEx` | `WD_PROGRESS_SOTA` |
| `SensingEx` | `WD_ANIM_Sensing` |
| `ToastEx` | `CM_OVERLAY_ToastQueue` |
| `UnlockEx` | `WD_DIALOG_Unlock` |
| `ValveCheckEx` | `WD_PROGRESS_ValveCheck` |
| `VerticalList1stEx` | `CM_PICKER_Vertical1st` |
| `VerticalList2ndEx` | `CM_PICKER_Vertical2nd` |
| *(미분류 1개)* | — |

---

## 🔍 Usage Guide

### For RAG / AI Component Selection
- 이 카탈로그는 ChromaDB 인덱싱 및 AI 기반 컴포넌트 선택의 정보 소스입니다.
- **Visual Form** 필드로 UI 구조 매핑, **설명** 필드로 동작 패턴 파악
- **Original Name** 필드로 실제 파일 및 레지스트리 키를 역추적

### For Developers
- 인덱싱 시 `Original Name`을 파일명으로 사용 (파일 구조 변경 없음)
- 새 표준 이름은 **RAG 검색 키**, **레지스트리 키 우선 참조값**으로 활용
- 위젯은 직접 화면에서 사용 가능; 래퍼는 별도 테스트/데모 용도

### Component Count Summary
| Product | Category Count | Widget Count |
|---------|---------------|-------------|
| CM | 10 categories | 56 widgets |
| WD | 8 categories | 35 widgets |
| OV | 4 categories | 7 widgets |
| **Total** | **22 categories** | **98 widgets** |

---

**Last Updated**: 2026-03-12  
**Catalog Version**: 2.0.0

---
