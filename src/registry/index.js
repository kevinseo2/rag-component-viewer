'use client';

// ─── Widget Imports (direct from source) ─────────────────────────────────────
import CM_ANIM_Digit from '../widgets/2.4_inches/CM_ANIM_Digit.jsx';
import CM_ANIM_IntroLoop from '../widgets/2.4_inches/CM_ANIM_IntroLoop.jsx';
import CM_ANIM_Sequence from '../widgets/2.4_inches/CM_ANIM_Sequence.jsx';
import CM_ANIM_SequencePlayer from '../widgets/2.4_inches/CM_ANIM_SequencePlayer.jsx';
import CM_CTRL_Button from '../widgets/2.4_inches/CM_CTRL_Button.jsx';
import CM_CTRL_Slider from '../widgets/2.4_inches/CM_CTRL_Slider.jsx';
import CM_CTRL_SliderContinuous from '../widgets/2.4_inches/CM_CTRL_SliderContinuous.jsx';
import CM_CTRL_SliderDiscrete from '../widgets/2.4_inches/CM_CTRL_SliderDiscrete.jsx';
import CM_CTRL_Switch from '../widgets/2.4_inches/CM_CTRL_Switch.jsx';
import CM_DIALOG_CustomIcon from '../widgets/2.4_inches/CM_DIALOG_CustomIcon.jsx';
import CM_DIALOG_DescOnly from '../widgets/2.4_inches/CM_DIALOG_DescOnly.jsx';
import CM_DIALOG_Icon from '../widgets/2.4_inches/CM_DIALOG_Icon.jsx';
import CM_DIALOG_IconButtons from '../widgets/2.4_inches/CM_DIALOG_IconButtons.jsx';
import CM_DIALOG_IconTitleDesc from '../widgets/2.4_inches/CM_DIALOG_IconTitleDesc.jsx';
import CM_DIALOG_ScrollDesc from '../widgets/2.4_inches/CM_DIALOG_ScrollDesc.jsx';
import CM_DIALOG_TextButtons from '../widgets/2.4_inches/CM_DIALOG_TextButtons.jsx';
import CM_DIALOG_TextOnly from '../widgets/2.4_inches/CM_DIALOG_TextOnly.jsx';
import CM_DIALOG_TitleDesc from '../widgets/2.4_inches/CM_DIALOG_TitleDesc.jsx';
import CM_DIALOG_TitleIconStack from '../widgets/2.4_inches/CM_DIALOG_TitleIconStack.jsx';
import CM_DIALOG_TitleWide from '../widgets/2.4_inches/CM_DIALOG_TitleWide.jsx';
import CM_DISPLAY_Black from '../widgets/2.4_inches/CM_DISPLAY_Black.jsx';
import CM_LABEL_Formatted from '../widgets/2.4_inches/CM_LABEL_Formatted.jsx';
import CM_LABEL_Smart from '../widgets/2.4_inches/CM_LABEL_Smart.jsx';
import CM_LIST_Grid from '../widgets/2.4_inches/CM_LIST_Grid.jsx';
import CM_LIST_HorizontalCarousel from '../widgets/2.4_inches/CM_LIST_HorizontalCarousel.jsx';
import CM_LIST_HorizontalPager from '../widgets/2.4_inches/CM_LIST_HorizontalPager.jsx';
import CM_LIST_Item from '../widgets/2.4_inches/CM_LIST_Item.jsx';
import CM_LIST_Item2Col from '../widgets/2.4_inches/CM_LIST_Item2Col.jsx';
import CM_LIST_ItemFull from '../widgets/2.4_inches/CM_LIST_ItemFull.jsx';
import CM_LIST_MultiSelect from '../widgets/2.4_inches/CM_LIST_MultiSelect.jsx';
import CM_LIST_Reorder from '../widgets/2.4_inches/CM_LIST_Reorder.jsx';
import CM_LIST_ScrollView from '../widgets/2.4_inches/CM_LIST_ScrollView.jsx';
import CM_LIST_ScrollView2Col from '../widgets/2.4_inches/CM_LIST_ScrollView2Col.jsx';
import CM_LIST_SingleSelect from '../widgets/2.4_inches/CM_LIST_SingleSelect.jsx';
import CM_LIST_SwitchList from '../widgets/2.4_inches/CM_LIST_SwitchList.jsx';
import CM_LIST_Vertical from '../widgets/2.4_inches/CM_LIST_Vertical.jsx';
import CM_LIST_Vertical2Col from '../widgets/2.4_inches/CM_LIST_Vertical2Col.jsx';
import CM_OVERLAY_Guide from '../widgets/2.4_inches/CM_OVERLAY_Guide.jsx';
import CM_OVERLAY_Toast from '../widgets/2.4_inches/CM_OVERLAY_Toast.jsx';
import CM_OVERLAY_ToastQueue from '../widgets/2.4_inches/CM_OVERLAY_ToastQueue.jsx';
import CM_PICKER_HorizontalSel from '../widgets/2.4_inches/CM_PICKER_HorizontalSel.jsx';
import CM_PICKER_Mask2nd from '../widgets/2.4_inches/CM_PICKER_Mask2nd.jsx';
import CM_PICKER_NumericCarousel from '../widgets/2.4_inches/CM_PICKER_NumericCarousel.jsx';
import CM_PICKER_Roller from '../widgets/2.4_inches/CM_PICKER_Roller.jsx';
import CM_PICKER_Vertical from '../widgets/2.4_inches/CM_PICKER_Vertical.jsx';
import CM_PICKER_Vertical1st from '../widgets/2.4_inches/CM_PICKER_Vertical1st.jsx';
import CM_PICKER_Vertical1stItem from '../widgets/2.4_inches/CM_PICKER_Vertical1stItem.jsx';
import CM_PICKER_Vertical2nd from '../widgets/2.4_inches/CM_PICKER_Vertical2nd.jsx';
import CM_PICKER_Vertical2ndItem from '../widgets/2.4_inches/CM_PICKER_Vertical2ndItem.jsx';
import CM_PICKER_VerticalCore from '../widgets/2.4_inches/CM_PICKER_VerticalCore.jsx';
import CM_PICKER_VerticalTitled from '../widgets/2.4_inches/CM_PICKER_VerticalTitled.jsx';
import CM_PICKER_VerticalValue from '../widgets/2.4_inches/CM_PICKER_VerticalValue.jsx';
import CM_PROGRESS_Bar from '../widgets/2.4_inches/CM_PROGRESS_Bar.jsx';
import CM_PROGRESS_Spinner from '../widgets/2.4_inches/CM_PROGRESS_Spinner.jsx';
import CM_TITLE_Bar from '../widgets/2.4_inches/CM_TITLE_Bar.jsx';
import CM_TITLE_WithArrow from '../widgets/2.4_inches/CM_TITLE_WithArrow.jsx';
import OV_COOK_AutoPager from '../widgets/2.4_inches/OV_COOK_AutoPager.jsx';
import OV_COOK_Finished from '../widgets/2.4_inches/OV_COOK_Finished.jsx';
import OV_COOK_ModeItem from '../widgets/2.4_inches/OV_COOK_ModeItem.jsx';
import OV_COOK_ModePager from '../widgets/2.4_inches/OV_COOK_ModePager.jsx';
import OV_DIALOG_TitleIcon from '../widgets/2.4_inches/OV_DIALOG_TitleIcon.jsx';
import OV_PROGRESS_Cooking from '../widgets/2.4_inches/OV_PROGRESS_Cooking.jsx';
import OV_TITLE_2Line from '../widgets/2.4_inches/OV_TITLE_2Line.jsx';
import WD_ANIM_Boot from '../widgets/2.4_inches/WD_ANIM_Boot.jsx';
import WD_ANIM_BootScreen from '../widgets/2.4_inches/WD_ANIM_BootScreen.jsx';
import WD_ANIM_BootUpgrade from '../widgets/2.4_inches/WD_ANIM_BootUpgrade.jsx';
import WD_ANIM_Sensing from '../widgets/2.4_inches/WD_ANIM_Sensing.jsx';
import WD_CLOCK_Analog from '../widgets/2.4_inches/WD_CLOCK_Analog.jsx';
import WD_CLOCK_Digital from '../widgets/2.4_inches/WD_CLOCK_Digital.jsx';
import WD_CLOCK_Idle from '../widgets/2.4_inches/WD_CLOCK_Idle.jsx';
import WD_CLOCK_Picker from '../widgets/2.4_inches/WD_CLOCK_Picker.jsx';
import WD_CLOCK_Reservation from '../widgets/2.4_inches/WD_CLOCK_Reservation.jsx';
import WD_CLOCK_ReservationTime from '../widgets/2.4_inches/WD_CLOCK_ReservationTime.jsx';
import WD_CLOCK_SetTime from '../widgets/2.4_inches/WD_CLOCK_SetTime.jsx';
import WD_COURSE_Editor from '../widgets/2.4_inches/WD_COURSE_Editor.jsx';
import WD_COURSE_EditorItem from '../widgets/2.4_inches/WD_COURSE_EditorItem.jsx';
import WD_COURSE_Item from '../widgets/2.4_inches/WD_COURSE_Item.jsx';
import WD_COURSE_ItemOption from '../widgets/2.4_inches/WD_COURSE_ItemOption.jsx';
import WD_COURSE_List from '../widgets/2.4_inches/WD_COURSE_List.jsx';
import WD_COURSE_ProgressBase from '../widgets/2.4_inches/WD_COURSE_ProgressBase.jsx';
import WD_COURSE_ProgressFinish from '../widgets/2.4_inches/WD_COURSE_ProgressFinish.jsx';
import WD_COURSE_ProgressTitle from '../widgets/2.4_inches/WD_COURSE_ProgressTitle.jsx';
import WD_COURSE_Running from '../widgets/2.4_inches/WD_COURSE_Running.jsx';
import WD_DECORATION_Divider from '../widgets/2.4_inches/WD_DECORATION_Divider.jsx';
import WD_DIALOG_Accessory from '../widgets/2.4_inches/WD_DIALOG_Accessory.jsx';
import WD_DIALOG_AnimIcon from '../widgets/2.4_inches/WD_DIALOG_AnimIcon.jsx';
import WD_DIALOG_Basic from '../widgets/2.4_inches/WD_DIALOG_Basic.jsx';
import WD_DIALOG_ChildLock from '../widgets/2.4_inches/WD_DIALOG_ChildLock.jsx';
import WD_DIALOG_QRCode from '../widgets/2.4_inches/WD_DIALOG_QRCode.jsx';
import WD_DIALOG_TextOnly from '../widgets/2.4_inches/WD_DIALOG_TextOnly.jsx';
import WD_DIALOG_Unlock from '../widgets/2.4_inches/WD_DIALOG_Unlock.jsx';
import WD_PAGER_Base from '../widgets/2.4_inches/WD_PAGER_Base.jsx';
import WD_PROGRESS_Bar from '../widgets/2.4_inches/WD_PROGRESS_Bar.jsx';
import WD_PROGRESS_Circle from '../widgets/2.4_inches/WD_PROGRESS_Circle.jsx';
import WD_PROGRESS_RemainTime from '../widgets/2.4_inches/WD_PROGRESS_RemainTime.jsx';
import WD_PROGRESS_SOTA from '../widgets/2.4_inches/WD_PROGRESS_SOTA.jsx';
import WD_PROGRESS_ValveCheck from '../widgets/2.4_inches/WD_PROGRESS_ValveCheck.jsx';
import WD_TOAST_Message from '../widgets/2.4_inches/WD_TOAST_Message.jsx';

// ─── Shared Sample Data ───────────────────────────────────────────────────────
const sampleListData = [
    { label: 'Cotton', selected: true },
    { label: 'Synthetics' },
    { label: 'Delicates' },
    { label: 'Wool' },
    { label: 'Quick Wash' },
    { label: 'Heavy Duty' },
];

const sampleListDataWithDisabled = [
    { label: 'Normal', selected: true },
    { label: 'Eco' },
    { label: 'Turbo' },
    { label: 'Custom', disabled: true },
];

const sampleSwitchListData = [
    { label: 'Pre-wash', enabled: true },
    { label: 'Rinse +1', enabled: false },
    { label: 'Extra Spin', enabled: true },
    { label: 'Delay Start', enabled: false },
];

const sampleMultiSelectData = [
    { label: 'Rinse', selected: true },
    { label: 'Spin', selected: true },
    { label: 'Dry', selected: false },
    { label: 'Steam', selected: false },
];

const samplePickerData = Array.from({ length: 9 }, (_, i) => ({
    label: `${30 + i * 10}°C`,
    value: `${30 + i * 10}°C`,
    title: `${30 + i * 10}°C`,
}));

const samplePickerDataWash = [
    { label: '30°C', value: '30°C', title: '30°C' },
    { label: '40°C', value: '40°C', title: '40°C' },
    { label: '60°C', value: '60°C', title: '60°C' },
    { label: '90°C', value: '90°C', title: '90°C' },
];

const samplePicker1stData = Array.from({ length: 9 }, (_, i) => ({
    text: `${30 + i * 10}°C`,
    value: `${30 + i * 10}°C`,
    enabled: true,
}));

const samplePicker2ndData = Array.from({ length: 12 }, (_, i) => ({
    value_text: `${(i + 1) * 5}`,
    unit_hide: false,
}));

const samplePickerDataMin = Array.from({ length: 12 }, (_, i) => ({
    label: `${(i + 1) * 5} min`,
    value: `${(i + 1) * 5} min`,
    title: `${(i + 1) * 5} min`,
}));

const sampleClockInfo = {
    hour: 10,
    min: 30,
    date: 'Mon Mar 13',
    am_str: 'AM',
    pm_str: 'PM',
};

const sampleGridData = [
    { id: 'grid_1', label1: 'Cotton', label2: 'Standard', iconSrc: '/ui/images/ic_mode.png' },
    { id: 'grid_2', label1: 'Wool', label2: 'Gentle', iconSrc: '/ui/images/ic_mode.png' },
    { id: 'grid_3', label1: 'Synthetics', label2: 'Medium', iconSrc: '/ui/images/ic_mode.png' },
    { id: 'grid_4', label1: 'Delicates', label2: 'Soft', iconSrc: '/ui/images/ic_mode.png' },
    { id: 'grid_5', label1: 'Quick', label2: 'Wash', iconSrc: '/ui/images/ic_mode.png' },
    { id: 'grid_6', label1: 'Heavy', label2: 'Duty', iconSrc: '/ui/images/ic_mode.png' },
];

const sampleCourses = [
    {
        id: 'course_1',
        courseName: 'Cotton',
        courseDescription: '95°C · 1400rpm · 2h 30min',
        courseType: 'default',
        options: [{ title: 'Temp', value: '95°C' }, { title: 'Spin', value: '1400rpm' }],
        fastdlStatus: 'none',
        energySaverEnabled: false,
    },
    {
        id: 'course_2',
        courseName: 'AI Wash',
        courseDescription: 'Smart · Auto · 1h 15min',
        courseType: 'ai',
        options: [{ title: 'Mode', value: 'Auto' }],
        fastdlStatus: 'none',
    },
    {
        id: 'course_3',
        courseName: 'Cloud',
        courseDescription: 'LG ThinQ sync',
        courseType: 'cloud',
        options: [],
        fastdlStatus: 'none',
    },
];

const sampleCarouselItems = [
    { id: 'c1', label: 'Gentle', iconSrc: '/ui/images/ic_mode.png' },
    { id: 'c2', label: 'Normal', iconSrc: '/ui/images/ic_mode.png' },
    { id: 'c3', label: 'Strong', iconSrc: '/ui/images/ic_mode.png' },
    { id: 'c4', label: 'Eco', iconSrc: '/ui/images/ic_mode.png' },
    { id: 'c5', label: 'Turbo', iconSrc: '/ui/images/ic_mode.png' },
];

const sampleOvCookModes = [
    { id: 'mode_1', title: '최근 사용 메뉴', description: '다이얼 눌러 들어가기', showIcon: false },
    { id: 'mode_2', title: '해동', description: '냉동된 식품을 빠르게 녹이기', showIcon: false },
    { id: 'mode_3', title: '에어프라이', description: '고온의 공기로 튀김 요리를 기름 없이 바삭하게 익히기', showIcon: false },
    { id: 'mode_4', title: '레인지', description: '간편하게 음식물을 끓이거나 데우기', showIcon: false },
    { id: 'mode_5', title: '오븐', description: '열기를 이용하여 음식물을 균일하게 익히기', showIcon: false },
    { id: 'mode_6', title: '토스트', description: '다이얼 눌러 들어가기', showIcon: false },
    { id: 'mode_7', title: '구이', description: '음식물의 표면을 노릇노릇하게 굽기', showIcon: false },
    { id: 'mode_8', title: '스팀(찜)', description: '스팀을 이용하여 채소, 생선, 떡 등을 촉촉하게 요리', showIcon: false },
];

// ─── Component Registry ───────────────────────────────────────────────────────
export const ComponentRegistry = {
    // ── Animation ──────────────────────────────────────────────────────────
    CM_ANIM_Digit: {
        Component: CM_ANIM_Digit,
        defaultProps: { value: 7, direction: 1 },
        variants: [
            { id: 'v1', description: 'Value 7, Up', data: { value: 7, direction: 1 } },
            { id: 'v2', description: 'Value 3, Down', data: { value: 3, direction: -1 } },
            { id: 'v3', description: 'Value 0, No anim', data: { value: 0, direction: 0 } },
        ],
    },
    CM_ANIM_IntroLoop: {
        Component: CM_ANIM_IntroLoop,
        defaultProps: { introImages: Array.from({ length: 30 }, (_, i) => `/ui/image_sequences/img_booting_thinq/.orig_images/img_booting_thinq_${String(i + 1).padStart(2, '0')}.png`), introDuration: 2500, loopImages: Array.from({ length: 25 }, (_, i) => `/ui/image_sequences/img_intro/.orig_images/img_intro_${String(i + 1).padStart(3, '0')}.png`), loopDuration: 2100 },
        variants: [
            { id: 'v1', description: 'ThinQ Boot → Intro loop', data: { introImages: Array.from({ length: 30 }, (_, i) => `/ui/image_sequences/img_booting_thinq/.orig_images/img_booting_thinq_${String(i + 1).padStart(2, '0')}.png`), introDuration: 2500, loopImages: Array.from({ length: 25 }, (_, i) => `/ui/image_sequences/img_intro/.orig_images/img_intro_${String(i + 1).padStart(3, '0')}.png`), loopDuration: 2100 } },
            { id: 'v2', description: 'Loop only (no intro)', data: { introImages: [], introDuration: 1000, loopImages: Array.from({ length: 25 }, (_, i) => `/ui/image_sequences/img_intro/.orig_images/img_intro_${String(i + 1).padStart(3, '0')}.png`), loopDuration: 2100 } },
        ],
    },
    CM_ANIM_Sequence: {
        Component: CM_ANIM_Sequence,
        defaultProps: { images: Array.from({ length: 30 }, (_, i) => `/ui/image_sequences/img_booting_thinq/.orig_images/img_booting_thinq_${String(i + 1).padStart(2, '0')}.png`), duration: 2500, repeat: true },
        variants: [
            { id: 'v1', description: 'ThinQ Boot loop', data: { images: Array.from({ length: 30 }, (_, i) => `/ui/image_sequences/img_booting_thinq/.orig_images/img_booting_thinq_${String(i + 1).padStart(2, '0')}.png`), duration: 2500, repeat: true } },
            { id: 'v2', description: 'ThinQ Boot once', data: { images: Array.from({ length: 30 }, (_, i) => `/ui/image_sequences/img_booting_thinq/.orig_images/img_booting_thinq_${String(i + 1).padStart(2, '0')}.png`), duration: 2500, repeat: false } },
        ],
    },
    CM_ANIM_SequencePlayer: {
        Component: CM_ANIM_SequencePlayer,
        defaultProps: { playlist: [{ CM_ANIM_Sequence: { path: '/ui/image_sequences/img_booting_thinq/.orig_images/', frames: ['img_booting_thinq_01.png', 'img_booting_thinq_02.png', 'img_booting_thinq_03.png', 'img_booting_thinq_04.png', 'img_booting_thinq_05.png', 'img_booting_thinq_06.png', 'img_booting_thinq_07.png', 'img_booting_thinq_08.png', 'img_booting_thinq_09.png', 'img_booting_thinq_10.png', 'img_booting_thinq_11.png', 'img_booting_thinq_12.png', 'img_booting_thinq_13.png', 'img_booting_thinq_14.png', 'img_booting_thinq_15.png', 'img_booting_thinq_16.png', 'img_booting_thinq_17.png', 'img_booting_thinq_18.png', 'img_booting_thinq_19.png', 'img_booting_thinq_20.png', 'img_booting_thinq_21.png', 'img_booting_thinq_22.png', 'img_booting_thinq_23.png', 'img_booting_thinq_24.png', 'img_booting_thinq_25.png', 'img_booting_thinq_26.png', 'img_booting_thinq_27.png', 'img_booting_thinq_28.png', 'img_booting_thinq_29.png', 'img_booting_thinq_30.png'] }, duration: 1000, repeatCount: -1 }] },
        variants: [
            { id: 'v1', description: 'Empty playlist', data: { playlist: [] } },
            { id: 'v2', description: 'ThinQ Boot loop', data: { playlist: [{ CM_ANIM_Sequence: { path: '/ui/image_sequences/img_booting_thinq/.orig_images/', frames: ['img_booting_thinq_01.png', 'img_booting_thinq_02.png', 'img_booting_thinq_03.png', 'img_booting_thinq_04.png', 'img_booting_thinq_05.png', 'img_booting_thinq_06.png', 'img_booting_thinq_07.png', 'img_booting_thinq_08.png', 'img_booting_thinq_09.png', 'img_booting_thinq_10.png', 'img_booting_thinq_11.png', 'img_booting_thinq_12.png', 'img_booting_thinq_13.png', 'img_booting_thinq_14.png', 'img_booting_thinq_15.png', 'img_booting_thinq_16.png', 'img_booting_thinq_17.png', 'img_booting_thinq_18.png', 'img_booting_thinq_19.png', 'img_booting_thinq_20.png', 'img_booting_thinq_21.png', 'img_booting_thinq_22.png', 'img_booting_thinq_23.png', 'img_booting_thinq_24.png', 'img_booting_thinq_25.png', 'img_booting_thinq_26.png', 'img_booting_thinq_27.png', 'img_booting_thinq_28.png', 'img_booting_thinq_29.png', 'img_booting_thinq_30.png'] }, duration: 1000, repeatCount: -1 }] } },
        ],
    },

    // ── Controls ────────────────────────────────────────────────────────────
    CM_CTRL_Button: {
        Component: CM_CTRL_Button,
        defaultProps: { text: 'OK', focused: true, width: 200, height: 60, textStyle: { fontSize: '28px' } },
        variants: [
            { id: 'focused', description: 'Focused', data: { text: 'Confirm', focused: true, width: 200, height: 60, textStyle: { fontSize: '28px' } } },
            { id: 'unfocused', description: 'Unfocused', data: { text: 'Cancel', focused: false, width: 200, height: 60, textStyle: { fontSize: '28px' } } },
            { id: 'auto-width', description: 'Auto Width', data: { text: 'Start Cycle', focused: true, width: 'auto', style: { padding: '0 30px' }, height: 60, textStyle: { fontSize: '28px' } } },
        ],
    },
    CM_CTRL_Slider: {
        Component: CM_CTRL_Slider,
        defaultProps: { value: 50, min: 0, max: 100, onChange: () => { } },
        variants: [
            { id: 'mid', description: '50% (Default)', data: { value: 50, min: 0, max: 100 } },
            { id: 'low', description: '20%', data: { value: 20, min: 0, max: 100 } },
            { id: 'custom-width', description: 'Width 150px', data: { value: 50, width: 150 } },
        ],
    },
    CM_CTRL_SliderContinuous: {
        Component: CM_CTRL_SliderContinuous,
        defaultProps: { initialValue: 50, min: 0, max: 100, step: 1, isFocused: true },
        variants: [
            { id: 'mid', description: 'Default (50)', data: { initialValue: 50, isFocused: true } },
            { id: 'high-step', description: 'Step 10, Value 80', data: { initialValue: 80, step: 10, isFocused: true } },
            { id: 'with-arrow', description: 'With Back Arrow', data: { title: 'Volume', initialValue: 30, showBackArrow: true, isFocused: true } },
        ],
    },
    CM_CTRL_SliderDiscrete: {
        Component: CM_CTRL_SliderDiscrete,
        defaultProps: { title: 'Speed', level: 3, maxLevels: 5, isFocused: true },
        variants: [
            { id: 'step2', description: 'Level 2/5', data: { title: 'Speed', level: 2, maxLevels: 5, isFocused: true } },
            { id: 'step4', description: 'Level 4/5', data: { title: 'Speed', level: 4, maxLevels: 5, isFocused: true } },
            { id: 'max7', description: 'Max 7 Levels', data: { title: 'Intensity', level: 5, maxLevels: 7, isFocused: true } },
        ],
    },
    CM_CTRL_Switch: {
        Component: CM_CTRL_Switch,
        defaultProps: { checked: true, visible: true },
        variants: [
            { id: 'on', description: 'ON', data: { checked: true, visible: true } },
            { id: 'off', description: 'OFF', data: { checked: false, visible: true } },
            { id: 'hidden', description: 'Hidden', data: { checked: true, visible: false } },
        ],
    },

    // ── Dialogs ─────────────────────────────────────────────────────────────
    CM_DIALOG_CustomIcon: {
        Component: CM_DIALOG_CustomIcon,
        defaultProps: { title: 'Alert', description: 'Custom message\nLine 2', iconSrc: '/ui/images/img_info.png', isFocused: true },
        variants: [
            { id: 'v1', description: 'Default', data: { title: 'Alert', description: 'Operation complete.', iconSrc: '/ui/images/img_info.png', isFocused: true } },
        ],
    },
    CM_DIALOG_DescOnly: {
        Component: CM_DIALOG_DescOnly,
        defaultProps: { title: 'Info', description: 'This is a description-only dialog message.', isFocused: true },
        variants: [
            { id: 'v1', description: 'Short', data: { title: 'Info', description: 'Short message.', isFocused: true } },
            { id: 'v2', description: 'Multiline', data: { title: 'Notice', description: 'Longer message\nspanning two lines.', isFocused: true } },
        ],
    },
    CM_DIALOG_Icon: {
        Component: CM_DIALOG_Icon,
        defaultProps: { description: 'Information dialog', isFocused: true },
        variants: [
            { id: 'info', description: 'Info', data: { description: 'Please check settings.', isFocused: true } },
            { id: 'multiline', description: 'Multiline', data: { description: 'Please check settings.\nAnd try again.', isFocused: true } },
        ],
    },
    CM_DIALOG_IconButtons: {
        Component: CM_DIALOG_IconButtons,
        defaultProps: { description: 'Do you want to continue?', buttonCount: 2, btn1Text: 'OK', btn2Text: 'Cancel', isFocused: true },
        variants: [
            { id: 'confirm', description: 'Confirm (2 btn)', data: { description: 'Proceed with rinse?', buttonCount: 2, btn1Text: 'OK', btn2Text: 'Cancel', isFocused: true } },
            { id: 'alert', description: 'Alert (1 btn)', data: { description: 'Cycle complete!', buttonCount: 1, btn1Text: 'OK', isFocused: true } },
        ],
    },
    CM_DIALOG_IconTitleDesc: {
        Component: CM_DIALOG_IconTitleDesc,
        defaultProps: { title: 'Notice', description: 'Description text', isFocused: true },
        variants: [
            { id: 'v1', description: 'Default', data: { title: 'Notice', description: 'Please place items correctly.', isFocused: true } },
        ],
    },
    CM_DIALOG_ScrollDesc: {
        Component: CM_DIALOG_ScrollDesc,
        defaultProps: { title: 'Terms', description: 'Long scrollable description text\nLine 2\nLine 3\nLine 4\nLine 5', buttonCount: 2, btn1Text: 'Agree', btn2Text: 'Disagree', isFocused: true },
        variants: [
            { id: 'v1', description: 'Scrollable text', data: { title: 'Terms & Conditions', description: 'Long text\nLine 2\nLine 3\nLine 4\nLine 5', buttonCount: 2, btn1Text: 'Agree', btn2Text: 'Disagree', isFocused: true } },
            { id: '1btn', description: '1 Button', data: { title: 'Notice', description: 'Scrollable text...\nMore text...', buttonCount: 1, btn1Text: 'OK', isFocused: true } },
        ],
    },
    CM_DIALOG_TextButtons: {
        Component: CM_DIALOG_TextButtons,
        defaultProps: { desc: 'Confirm action?', button1Text: 'Cancel', button2Text: 'Confirm', buttonHeight: 40 },
        variants: [
            { id: 'v1', description: 'Standard', data: { desc: 'Delete this cycle?', button1Text: 'Cancel', button2Text: 'Delete', buttonHeight: 40 } },
            { id: 'tall', description: 'Tall Buttons', data: { desc: 'Are you sure?', button1Text: 'No', button2Text: 'Yes', buttonHeight: 66 } },
        ],
    },
    CM_DIALOG_TextOnly: {
        Component: CM_DIALOG_TextOnly,
        defaultProps: { description: 'Information text only', isFocused: true },
        variants: [
            { id: 'v1', description: 'Short', data: { description: 'OK', isFocused: true } },
            { id: 'v2', description: 'Long', data: { description: 'Please wait while the cycle completes...', isFocused: true } },
        ],
    },
    CM_DIALOG_TitleDesc: {
        Component: CM_DIALOG_TitleDesc,
        defaultProps: { title: 'Setting', description: 'Adjust spin speed to match fabric type.', isFocused: true },
        variants: [
            { id: 'v1', description: 'Default', data: { title: 'Temperature', description: 'Select a wash temperature.', isFocused: true } },
        ],
    },
    CM_DIALOG_TitleIconStack: {
        Component: CM_DIALOG_TitleIconStack,
        defaultProps: { title: 'Settings', description: 'Description text', iconSrc: '/ui/images/img_info.png', isFocused: true },
        variants: [{ id: 'v1', description: 'Default', data: { title: 'Quick Settings', description: 'Adjust basic preferences', iconSrc: '/ui/images/img_info.png', isFocused: true } }],
    },
    CM_DIALOG_TitleWide: {
        Component: CM_DIALOG_TitleWide,
        defaultProps: { title: 'Wide Title', description: 'Description', isFocused: true },
        variants: [{ id: 'v1', description: 'Default', data: { title: 'Wash Settings', description: 'Customize your wash cycle', isFocused: true } }],
    },

    // ── Display ─────────────────────────────────────────────────────────────
    CM_DISPLAY_Black: {
        Component: CM_DISPLAY_Black,
        defaultProps: { style: {} },
        variants: [{ id: 'v1', description: 'Black screen', data: { style: { backgroundColor: '#000000' } } }],
    },

    // ── Labels ──────────────────────────────────────────────────────────────
    CM_LABEL_Formatted: {
        Component: CM_LABEL_Formatted,
        defaultProps: {
            format: '안녕하세요, {0}!',
            slots: [{ type: 'string', value: '세탁기' }],
            align: 'center',
            style: { fontSize: 30, color: '#ffffff' },
            maxArea: { width: 320, height: 60 },
            isFocused: true
        },
        variants: [
            { id: 'string-slot', description: '문자열 슬롯', data: { format: '안녕하세요, {0}!', slots: [{ type: 'string', value: '세탁기' }], align: 'center', style: { fontSize: 30, color: '#ffffff' }, maxArea: { width: 320, height: 60 }, isFocused: true } },
            { id: 'number-slot', description: '숫자 단위', data: { format: '설정 온도 {0}°C', slots: [{ type: 'number', value: '40' }], align: 'center', style: { fontSize: 36, color: '#ffffff' }, maxArea: { width: 320, height: 60 }, isFocused: true } },
            { id: 'image-slot', description: '이미지 인라인', data: { format: '{0} 세탁 완료', slots: [{ type: 'image', value: '/ui/images/img_ok.png' }], align: 'center', style: { fontSize: 30, color: '#ffffff' }, maxArea: { width: 320, height: 60 }, isFocused: true } },
            { id: 'multiline', description: '멀티라인', data: { format: '세탁이 완료되었습니다.\n꺼내주세요.', slots: [], align: 'center', multiline: true, style: { fontSize: 28, color: '#ffffff' }, maxArea: { width: 310, height: 100 }, isFocused: true } },
            { id: 'long-scroll', description: '긴 텍스트 스크롤', data: { format: '이 텍스트는 너무 길어서 스크롤됩니다. 세탁 코스: 표준, 온도: 40°C, 탈수: 1200rpm', slots: [], align: 'left', style: { fontSize: 28, color: '#ffffff' }, maxArea: { width: 200, height: 40 }, isFocused: true, animSpeed: 50 } },
        ],
    },
    CM_LABEL_Smart: {
        Component: CM_LABEL_Smart,
        defaultProps: { text: 'Smart Label Text', align: 'center', maxArea: { width: 320, height: 40 }, isFocused: true },
        variants: [
            { id: 'short', description: 'Short text', data: { text: 'OK', align: 'center', maxArea: { width: 320, height: 40 }, isFocused: true } },
            { id: 'long', description: 'Long text', data: { text: 'This is a much longer smart label text with auto-sizing and scrolling enabled', align: 'center', maxArea: { width: 320, height: 60 }, isFocused: true, animSpeed: 50 } },
            { id: 'multiline-scroll', description: 'Multiline Scroll', data: { text: 'First Line\nSecond Line\nThird Line\nFourth Line which is long', align: 'center', multiline: true, style: { fontSize: 24, color: '#ffffff' }, maxArea: { width: 320, height: 50 }, isFocused: true, animSpeed: 30 } },
        ],
    },

    // ── Lists ───────────────────────────────────────────────────────────────
    CM_LIST_Grid: {
        Component: CM_LIST_Grid,
        defaultProps: { items: sampleGridData },
        variants: [
            { id: 'default', description: 'Grid view (2 Pages)', data: { items: sampleGridData } },
            { id: 'single-page', description: 'Single Page (3 Items)', data: { items: sampleGridData.slice(0, 3) } },
        ],
    },
    CM_LIST_HorizontalCarousel: {
        Component: CM_LIST_HorizontalCarousel,
        defaultProps: { items: sampleCarouselItems, isFocused: true },
        variants: [
            { id: 'default', description: 'Default', data: { items: sampleCarouselItems, isFocused: true } },
            { id: 'with-title', description: 'With Title', data: { title: 'Wash Modes', items: sampleCarouselItems, isFocused: true } },
            { id: 'start-mid', description: 'Start at index 2', data: { items: sampleCarouselItems, initialIndex: 2, isFocused: true } },
        ],
    },
    CM_LIST_HorizontalPager: {
        Component: CM_LIST_HorizontalPager,
        defaultProps: { items: sampleCarouselItems },
        variants: [
            { id: '1st', description: '1st Variant (Labels)', data: { variant: '1st', items: [{ label1: 'Item 1', label2: 'Sub 1' }, { label1: 'Item 2', hasCommand: true, commandText: 'Start' }] } },
            { id: '2nd', description: '2nd Variant (Title/Value/Desc)', data: { variant: '2nd', items: [{ title: 'Wash', value: 'Auto', description: 'Smart mode' }, { title: 'Spin', value: 'High' }] } },
        ],
    },
    CM_LIST_Item: {
        Component: CM_LIST_Item,
        defaultProps: { label: 'Cotton', showDescription: false, isSelected: false, enabled: true },
        variants: [
            { id: 'normal', description: 'Normal', data: { label: 'Cotton', showDescription: false, isSelected: false } },
            { id: 'selected', description: 'Selected', data: { label: 'Cotton', showDescription: false, isSelected: true } },
            { id: 'with-desc', description: 'With Description', data: { label: 'Cotton', description: 'Standard Wash', showDescription: true, isSelected: false } },
            { id: 'disabled', description: 'Disabled', data: { label: 'Cotton', showDescription: false, enabled: false } },
        ],
    },
    CM_LIST_Item2Col: {
        Component: CM_LIST_Item2Col,
        defaultProps: { label_main: 'Temperature', label: '40°C', showDescription: false, isSelected: false, enabled: true },
        variants: [
            { id: 'normal', description: 'Normal', data: { label_main: 'Temperature', label: '40°C', showDescription: false, isSelected: false } },
            { id: 'selected', description: 'Selected', data: { label_main: 'Temperature', label: '40°C', showDescription: false, isSelected: true } },
            { id: 'with-desc', description: 'With Description', data: { label_main: 'Spin', label_desc: 'Set spin speed', label: '1200rpm', showDescription: true } },
            { id: 'disabled', description: 'Disabled', data: { label_main: 'Pre-wash', label: 'Off', showDescription: false, enabled: false } },
        ],
    },
    CM_LIST_ItemFull: {
        Component: CM_LIST_ItemFull,
        defaultProps: { label_main: 'Cotton', description: 'Standard wash cycle', isSelected: true, enabled: true },
        variants: [
            { id: 'selected', description: 'Selected', data: { label_main: 'Cotton', description: 'Standard wash cycle', isSelected: true, enabled: true } },
            { id: 'with-value', description: 'With sub label', data: { label_main: 'Temperature', label_sub: '40°C', isSelected: false, enabled: true } },
            { id: 'with-switch', description: 'With switch', data: { label_main: 'Pre-wash', rightElement: 'switch', switchChecked: true, isSelected: false, enabled: true } },
            { id: 'with-reorder', description: 'With reorder', data: { label_main: 'Cotton', rightElement: 'reorder', isSelected: false, enabled: true } },
            { id: 'disabled', description: 'Disabled', data: { label_main: 'Wool', description: 'Not available', isSelected: false, enabled: false } },
        ],
    },
    CM_LIST_MultiSelect: {
        Component: CM_LIST_MultiSelect,
        defaultProps: { title: 'Options', listData: [{ label: 'Rinse', description: 'Extra rinse', checked: true }, { label: 'Spin', checked: true }, { label: 'Dry', checked: false }, { label: 'Steam', checked: false, disabled: true }], isFocused: true },
        variants: [{ id: 'v1', description: 'Multi-select', data: { title: 'Select Options', listData: [{ label: 'Rinse', description: 'Extra rinse', checked: true }, { label: 'Spin', checked: true }, { label: 'Dry', checked: false }, { label: 'Steam', checked: false, disabled: true }], isFocused: true } }],
    },
    CM_LIST_Reorder: {
        Component: CM_LIST_Reorder,
        defaultProps: { title: 'Reorder', listData: sampleListData.map(i => ({ ...i, selected: false })), isFocused: true },
        variants: [{ id: 'v1', description: 'Reorderable', data: { title: 'Reorder Items', listData: sampleListData.map(i => ({ ...i, selected: false })), isFocused: true } }],
    },
    CM_LIST_ScrollView: {
        Component: CM_LIST_ScrollView,
        defaultProps: { items: sampleListData.map(i => ({ label: i.label, description: 'Description', showDescription: true, enabled: !i.disabled })), initialSelectedIndex: 0 },
        variants: [
            { id: 'v1', description: 'Scroll list', data: { items: sampleListData.map(i => ({ label: i.label, description: 'Description', showDescription: true, enabled: !i.disabled })), initialSelectedIndex: 0 } },
            { id: 'v2', description: 'Mid selection', data: { items: sampleListData.map(i => ({ label: i.label, description: 'Description', showDescription: true, enabled: !i.disabled })), initialSelectedIndex: 3 } },
        ],
    },
    CM_LIST_ScrollView2Col: {
        Component: CM_LIST_ScrollView2Col,
        defaultProps: { items: [{ label_main: 'Temperature', label: '40°C', showDescription: false }, { label_main: 'Spin Speed', label_desc: 'Max limit', label: '1200rpm', showDescription: true }, { label_main: 'Duration', label: '1h 30min', showDescription: false }, { label_main: 'Rinse', label: '+1', showDescription: false }, { label_main: 'Dry', label: 'OFF', showDescription: false }], initialSelectedIndex: 0 },
        variants: [
            { id: 'v1', description: 'First item', data: { items: [{ label_main: 'Temperature', label: '40°C', showDescription: false }, { label_main: 'Spin Speed', label_desc: 'Max limit', label: '1200rpm', showDescription: true }, { label_main: 'Duration', label: '1h 30min', showDescription: false }, { label_main: 'Rinse', label: '+1', showDescription: false }, { label_main: 'Dry', label: 'OFF', showDescription: false }], initialSelectedIndex: 0 } },
            { id: 'v2', description: 'Mid selection', data: { items: [{ label_main: 'Temperature', label: '40°C', showDescription: false }, { label_main: 'Spin Speed', label_desc: 'Max limit', label: '1200rpm', showDescription: true }, { label_main: 'Duration', label: '1h 30min', showDescription: false }, { label_main: 'Rinse', label: '+1', showDescription: false }, { label_main: 'Dry', label: 'OFF', showDescription: false }], initialSelectedIndex: 3 } },
        ],
    },
    CM_LIST_SingleSelect: {
        Component: CM_LIST_SingleSelect,
        defaultProps: { title: 'Temperature', listData: sampleListData, showBackArrow: true, isFocused: true },
        variants: [
            { id: 'v1', description: 'Single select', data: { title: 'Wash Cycle', listData: sampleListData, showBackArrow: true, isFocused: true } },
            { id: 'v2', description: 'With disabled', data: { title: 'Spin Speed', listData: sampleListDataWithDisabled, showBackArrow: true, isFocused: true } },
        ],
    },
    CM_LIST_SwitchList: {
        Component: CM_LIST_SwitchList,
        defaultProps: { title: 'Options', items: [{ label_option: 'Pre-wash', switchState: 0 }, { label_option: 'Rinse +1', switchState: 1 }, { label_option: 'Extra Spin', switchState: 0 }, { label_option: 'Delay', switchState: 2 }], isFocused: true },
        variants: [{ id: 'v1', description: 'Switch list', data: { title: 'Wash Options', items: [{ label_option: 'Pre-wash', switchState: 0 }, { label_option: 'Rinse +1', switchState: 1 }, { label_option: 'Extra Spin', switchState: 0 }, { label_option: 'Delay', switchState: 2 }], isFocused: true } }],
    },
    CM_LIST_Vertical: {
        Component: CM_LIST_Vertical,
        defaultProps: { title: 'Cycles', items: sampleListData.map(i => ({ label: i.label, description: 'Description', showDescription: true, enabled: !i.disabled })), selectedIndex: 0, isFocused: true },
        variants: [{ id: 'v1', description: 'Vertical list', data: { title: 'Select Cycle', items: sampleListData.map(i => ({ label: i.label, description: 'Description', showDescription: true, enabled: !i.disabled })), selectedIndex: 0, isFocused: true } }],
    },
    CM_LIST_Vertical2Col: {
        Component: CM_LIST_Vertical2Col,
        defaultProps: { title: 'Settings', items: [{ label_main: 'Temperature', label: '40°C', showDescription: false }, { label_main: 'Spin Speed', label_desc: 'Max limit', label: '1200rpm', showDescription: true }, { label_main: 'Duration', label: '1h 30min', showDescription: false }], selectedIndex: 0, isFocused: true },
        variants: [{ id: 'v1', description: '2-column vertical', data: { title: 'Wash Settings', items: [{ label_main: 'Temperature', label: '40°C', showDescription: false }, { label_main: 'Spin Speed', label_desc: 'Max limit', label: '1200rpm', showDescription: true }, { label_main: 'Duration', label: '1h 30min', showDescription: false }], selectedIndex: 0, isFocused: true } }],
    },

    // ── Overlays ────────────────────────────────────────────────────────────
    CM_OVERLAY_Guide: {
        Component: CM_OVERLAY_Guide,
        defaultProps: { text: 'Close the door before starting.', isFocused: true, active: true },
        variants: [{ id: 'visible', description: 'Visible guide', data: { text: 'Please close the door.', active: true, isFocused: true } }],
    },
    CM_OVERLAY_Toast: {
        Component: CM_OVERLAY_Toast,
        defaultProps: { text: 'Settings saved.', duration: 0 },
        variants: [
            { id: 'short', description: 'Short', data: { text: 'Done!', duration: 0 } },
            { id: 'long', description: 'Long', data: { text: 'Your wash cycle has been saved successfully.', duration: 0 } },
        ],
    },
    CM_OVERLAY_ToastQueue: {
        Component: CM_OVERLAY_ToastQueue,
        defaultProps: { text: 'Notification ready', duration: 0, isFocused: true },
        variants: [{ id: 'v1', description: 'Single toast', data: { text: 'Notification ready', duration: 0, isFocused: true } }],
    },

    // ── Pickers ─────────────────────────────────────────────────────────────
    CM_PICKER_HorizontalSel: {
        Component: CM_PICKER_HorizontalSel,
        defaultProps: { items: samplePickerDataWash, currentIndex: 1, isFocused: true },
        variants: [
            { id: 'single', description: 'Single Select', data: { title: 'Wash Temp', items: samplePickerDataWash, currentIndex: 1, showCheckbox: false, isFocused: true } },
            { id: 'multi', description: 'Multi Select (Checkbox)', data: { title: 'Options', items: [{ label: 'Pre Wash', checked: true }, { label: 'Rinse+', checked: false }, { label: 'Steam', checked: false, disabled: true }], currentIndex: 0, showCheckbox: true, isFocused: true } },
        ],
    },
    CM_PICKER_Mask2nd: {
        Component: CM_PICKER_Mask2nd,
        defaultProps: { mode: 'mask', text: '', isFocused: true },
        variants: [
            { id: 'hidden', description: 'Hidden', data: { mode: 'hidden', text: '' } },
            { id: 'mask', description: 'Mask only', data: { mode: 'mask', text: '' } },
            { id: 'description', description: 'With description', data: { mode: 'description', text: 'Delicate cycle recommended' } },
        ],
    },
    CM_PICKER_NumericCarousel: {
        Component: CM_PICKER_NumericCarousel,
        defaultProps: { title: '물 양', start: 10, stride: 5, end: 200, currentIndex: 4, unit: 'ml', isFocused: true },
        variants: [
            { id: 'start', description: '시작 값 (10ml)', data: { title: '물 양', start: 10, stride: 5, end: 200, currentIndex: 0, unit: 'ml', isFocused: true } },
            { id: 'mid', description: '중간 값 (30ml)', data: { title: '물 양', start: 10, stride: 5, end: 200, currentIndex: 4, unit: 'ml', isFocused: true } },
            { id: 'triple', description: '3자리 (100ml)', data: { title: '물 양', start: 10, stride: 5, end: 200, currentIndex: 18, unit: 'ml', isFocused: true } },
            { id: 'max', description: '최대 값 (200ml)', data: { title: '물 양', start: 10, stride: 5, end: 200, currentIndex: 38, unit: 'ml', isFocused: true } },
        ],
    },
    CM_PICKER_Roller: {
        Component: CM_PICKER_Roller,
        defaultProps: { items: samplePickerDataWash.map(i => i.label), selectedIndex: 1, isFocused: true },
        variants: [{ id: 'v1', description: 'Roller', data: { items: samplePickerDataWash.map(i => i.label), selectedIndex: 1, isFocused: true } }],
    },
    CM_PICKER_Vertical: {
        Component: CM_PICKER_Vertical,
        defaultProps: { items: samplePickerData, initialSelectedIndex: 2, isFocused: true },
        variants: [
            { id: 'v1', description: 'Standard picker', data: { items: samplePickerData, initialSelectedIndex: 2, isFocused: true } },
            {
                id: 'semantic', description: 'Semantic item styles', data: {
                    items: [
                        { title: 'Normal Style', value: 'Value 1' },
                        { title: 'Small Font', value: 'Value 2', isSmallFont: true },
                        { title: 'Double Height', value: 'Value 3', isDoubleHeight: true },
                        { title: 'Hidden Value', value: 'Hidden', isValueHidden: true },
                        { title: 'Last Item', value: 'End' }
                    ],
                    initialSelectedIndex: 1, isFocused: true
                }
            }
        ],
    },
    CM_PICKER_Vertical1st: {
        Component: CM_PICKER_Vertical1st,
        defaultProps: { items: samplePicker1stData, initialIndex: 0, isFocused: true },
        variants: [
            { id: 'v1', description: 'No title', data: { items: samplePicker1stData, initialIndex: 0, isFocused: true } },
            { id: 'v2', description: 'With title', data: { items: samplePicker1stData, titleText: 'Temperature', titleShowAlways: true, initialIndex: 1, isFocused: true } },
        ],
    },
    CM_PICKER_Vertical1stItem: {
        Component: CM_PICKER_Vertical1stItem,
        defaultProps: { text: '40°C', value: '', position: 'MID', enabled: true },
        variants: [
            { id: 'mid', description: 'Mid (center)', data: { text: '40°C', value: '', position: 'MID', enabled: true } },
            { id: 'top', description: 'Top', data: { text: '30°C', value: '', position: 'TOP', enabled: true } },
            { id: 'low', description: 'Low', data: { text: '60°C', value: '', position: 'LOW', enabled: true } },
            { id: 'disabled', description: 'Disabled', data: { text: '90°C', value: '', position: 'MID', enabled: false } },
        ],
    },
    CM_PICKER_Vertical2nd: {
        Component: CM_PICKER_Vertical2nd,
        defaultProps: { title: 'Time', unit: 'min', items: samplePicker2ndData, initialSelectedIndex: 2, isFocused: true },
        variants: [
            { id: 'v1', description: 'Time (min)', data: { title: 'Time', unit: 'min', items: samplePicker2ndData, initialSelectedIndex: 2, isFocused: true } },
            { id: 'v2', description: 'With mask', data: { title: 'Time', unit: 'min', items: samplePicker2ndData, initialSelectedIndex: 0, mask: { mode: 'description', text: 'Select duration' }, isFocused: true } },
        ],
    },
    CM_PICKER_Vertical2ndItem: {
        Component: CM_PICKER_Vertical2ndItem,
        defaultProps: { text: '30 min', selected: true },
        variants: [
            { id: 'selected', description: 'Selected', data: { text: '30 min', selected: true } },
            { id: 'normal', description: 'Normal', data: { text: '45 min', selected: false } },
        ],
    },
    CM_PICKER_VerticalCore: {
        Component: CM_PICKER_VerticalCore,
        defaultProps: { items: samplePicker2ndData, selectedIndex: 0 },
        variants: [
            { id: 'v1', description: 'First item', data: { items: samplePicker2ndData, selectedIndex: 0 } },
            { id: 'v2', description: 'Third item', data: { items: samplePicker2ndData, selectedIndex: 2 } },
        ],
    },
    CM_PICKER_VerticalTitled: {
        Component: CM_PICKER_VerticalTitled,
        defaultProps: { title: 'Temperature', items: samplePickerDataWash, isFocused: true },
        variants: [{ id: 'v1', description: 'Titled picker', data: { title: 'Temperature', items: samplePickerDataWash, initialSelectedIndex: 1, isFocused: true } }],
    },
    CM_PICKER_VerticalValue: {
        Component: CM_PICKER_VerticalValue,
        defaultProps: { items: samplePickerDataWash, isFocused: true },
        variants: [
            { id: 'v1', description: 'Value picker', data: { items: samplePickerDataWash, initialSelectedIndex: 1, isFocused: true } },
            { id: 'time', description: 'Time picker', data: { items: samplePickerDataMin, initialSelectedIndex: 3, isFocused: true } },
        ],
    },

    // ── Progress ────────────────────────────────────────────────────────────
    CM_PROGRESS_Bar: {
        Component: CM_PROGRESS_Bar,
        defaultProps: { percent: 60, label_CM_PB_Title: 'Washing', label: '1', label_2: '30', label_CM_PB_Desc: 'Cotton', label_CM_PB_Desc_1: 'Rinse +1', isFocused: true },
        variants: [
            { id: '60pct', description: '60%', data: { percent: 60, label_CM_PB_Title: 'Washing', label: '1', label_2: '30', label_CM_PB_Desc: 'Cotton', label_CM_PB_Desc_1: 'Rinse +1', isFocused: true } },
            { id: '30pct', description: '30%', data: { percent: 30, label_CM_PB_Title: 'Rinsing', label: '0', label_2: '45', label_CM_PB_Desc: 'Cotton', label_CM_PB_Desc_1: '', isFocused: true } },
        ],
    },
    CM_PROGRESS_Spinner: {
        Component: CM_PROGRESS_Spinner,
        defaultProps: { desc: 'Please wait...' },
        variants: [
            { id: 'default', description: 'Loading', data: { desc: 'Loading...' } },
            { id: 'connecting', description: 'Connecting', data: { desc: 'Connecting to network...' } },
        ],
    },

    // ── Title ───────────────────────────────────────────────────────────────
    CM_TITLE_Bar: {
        Component: CM_TITLE_Bar,
        defaultProps: { title: 'Settings' },
        variants: [
            { id: 'settings', description: 'Settings', data: { title: 'Settings' } },
            { id: 'wash', description: 'Wash Cycle', data: { title: 'Wash Cycle' } },
        ],
    },
    CM_TITLE_WithArrow: {
        Component: CM_TITLE_WithArrow,
        defaultProps: { title: 'Settings', showBackArrow: true },
        variants: [
            { id: 'with_arrow', description: 'With back arrow', data: { title: 'Options', showBackArrow: true } },
            { id: 'no_arrow', description: 'No back arrow', data: { title: 'Main Menu', showBackArrow: false } },
        ],
    },

    // ── Oven ─────────────────────────────────────────────────────────────────
    OV_COOK_AutoPager: {
        Component: OV_COOK_AutoPager,
        defaultProps: { currentPage: 0, isFocused: true },
        variants: [
            { id: 'v1', description: 'First page', data: { currentPage: 0, isFocused: true } },
            { id: 'v2', description: 'Third page', data: { currentPage: 2, isFocused: true } },
        ],
    },
    OV_COOK_Finished: {
        Component: OV_COOK_Finished,
        defaultProps: { title: '요리 완료', message: '요리를 완료했어요', isFocused: true },
        variants: [{ id: 'v1', description: 'Cook finished', data: { title: '요리 완료', message: '요리를 완료했어요', isFocused: true } }],
    },
    OV_COOK_ModeItem: {
        Component: OV_COOK_ModeItem,
        defaultProps: { title: '에어프라이', description: '고온의 공기로 튀김 요리를 기름 없이 바삭하게 익히기', showIcon: false },
        variants: [
            { id: 'no-icon', description: 'Text only', data: { title: '에어프라이', description: '고온의 공기로 튀김 요리를 기름 없이 바삭하게 익히기', showIcon: false } },
            { id: 'with-icon', description: 'With icon', data: { title: '에어프라이', description: '바삭하게 익히기', image: '/ui/images/ic_mode.png', showIcon: true } },
        ],
    },
    OV_COOK_ModePager: {
        Component: OV_COOK_ModePager,
        defaultProps: { dataset: sampleOvCookModes, initialIndex: 0, isFocused: true },
        variants: [
            { id: 'v1', description: 'First mode', data: { dataset: sampleOvCookModes, initialIndex: 0, isFocused: true } },
            { id: 'v2', description: 'Third mode', data: { dataset: sampleOvCookModes, initialIndex: 2, isFocused: true } },
        ],
    },
    OV_DIALOG_TitleIcon: {
        Component: OV_DIALOG_TitleIcon,
        defaultProps: { title: '예열 중', message: '오븐이 예열되고 있어요', icon: '' },
        variants: [
            { id: 'no-icon', description: 'Text only', data: { title: '예열 중', message: '오븐이 예열되고 있어요', icon: '' } },
            { id: 'with-icon', description: 'With icon', data: { title: '예열 완료', message: '오븐 예열이 완료되었어요', icon: '/ui/images/ic_mode.png' } },
        ],
    },
    OV_PROGRESS_Cooking: {
        Component: OV_PROGRESS_Cooking,
        defaultProps: { title: '에어프라이', hour: 0, min: 30, sec: 0, percent: 65, temp: 200, weight: 0, unit: 0, rack: 0, accessory: 0, steam: 0, statusText: '조리 중', guideText: '', isFocused: true },
        variants: [
            { id: 'airfry', description: 'Air fry 65%', data: { title: '에어프라이', hour: 0, min: 30, sec: 0, percent: 65, temp: 200, statusText: '조리 중', isFocused: true } },
            { id: 'bake', description: 'Baking 30%', data: { title: '오븐', hour: 0, min: 45, sec: 0, percent: 30, temp: 180, statusText: '예열 중', isFocused: true } },
            { id: 'hour_long', description: 'With hours (1h 30m)', data: { title: '오븐', hour: 1, min: 30, sec: 0, percent: 10, temp: 230, statusText: '예열 중', isFocused: true } },
            { id: 'final_seconds', description: 'Final countdown (45s)', data: { title: '에어프라이', hour: 0, min: 0, sec: 45, percent: 95, temp: 200, statusText: '조리 중', isFocused: true } },
            { id: 'with_steam', description: 'Steam mode', data: { title: '스팀(찜)', hour: 0, min: 20, sec: 0, percent: 50, temp: 100, steam: 1, statusText: '스팀 조리 중', isFocused: true } },
            { id: 'with_guide', description: 'With guide text', data: { title: '토스트', hour: 0, min: 5, sec: 0, percent: 80, statusText: '조리 중', guideText: '완성되면 꺼내주세요', isFocused: true } },
            { id: 'with_weight', description: 'Weight display (300g)', data: { title: '해동', hour: 0, min: 15, sec: 0, percent: 40, weight: 300, statusText: '해동 중', isFocused: true } },
        ],
    },
    OV_TITLE_2Line: {
        Component: OV_TITLE_2Line,
        defaultProps: { title: '에어프라이', subtitle: '200°C / 45분', hideSubtitle: false },
        variants: [
            { id: 'title-only', description: 'Title only', data: { title: '에어프라이', hideSubtitle: true } },
            { id: 'two-lines', description: 'Title + subtitle', data: { title: '에어프라이', subtitle: '200°C / 45분', hideSubtitle: false } },
        ],
    },

    // ── Washer/Boot ──────────────────────────────────────────────────────────
    WD_ANIM_Boot: {
        Component: WD_ANIM_Boot,
        defaultProps: {
            isFocused: true,
            animations: [{
                CM_ANIM_Sequence: {
                    path: '/ui/image_sequences/img_booting_thinq/.orig_images',
                    frames: Array.from({ length: 30 }, (_, i) => `img_booting_thinq_${String(i + 1).padStart(2, '0')}.png`)
                },
                duration: 2500,
                repeatCount: 1
            }]
        },
        variants: [
            {
                id: 'v1', description: 'Boot (thinq logo)', data: {
                    isFocused: true,
                    animations: [{
                        CM_ANIM_Sequence: {
                            path: '/ui/image_sequences/img_booting_thinq/.orig_images',
                            frames: Array.from({ length: 30 }, (_, i) => `img_booting_thinq_${String(i + 1).padStart(2, '0')}.png`)
                        },
                        duration: 2500,
                        repeatCount: 1
                    }]
                }
            },
        ],
    },
    WD_ANIM_BootScreen: {
        Component: WD_ANIM_BootScreen,
        defaultProps: { text: '안녕하세요', isFocused: true },
        variants: [
            { id: 'v1', description: '안녕하세요', data: { text: '안녕하세요', isFocused: true } },
            { id: 'v2', description: '세탁 완료', data: { text: '세탁이 완료되었습니다', isFocused: true } },
        ],
    },
    WD_ANIM_BootUpgrade: {
        Component: WD_ANIM_BootUpgrade,
        defaultProps: { upgradeImageIndex: 1, isFocused: true },
        variants: [
            { id: 'autumn', description: '가을', data: { upgradeImageIndex: 0 } },
            { id: 'xmas', description: '크리스마스', data: { upgradeImageIndex: 1 } },
            { id: 'halloween', description: '할로윈', data: { upgradeImageIndex: 2 } },
            { id: 'newyear', description: '신년', data: { upgradeImageIndex: 3 } },
            { id: 'spring1', description: '봄 1', data: { upgradeImageIndex: 4 } },
            { id: 'spring2', description: '봄 2', data: { upgradeImageIndex: 5 } },
            { id: 'summer1', description: '여름 1', data: { upgradeImageIndex: 6 } },
            { id: 'summer2', description: '여름 2', data: { upgradeImageIndex: 7 } },
            { id: 'winter1', description: '겨울 1', data: { upgradeImageIndex: 8 } },
            { id: 'winter2', description: '겨울 2', data: { upgradeImageIndex: 9 } },
            { id: 'winter3', description: '겨울 3', data: { upgradeImageIndex: 10 } },
        ],
    },
    WD_ANIM_Sensing: {
        Component: WD_ANIM_Sensing,
        defaultProps: {
            introImages: Array.from({ length: 30 }, (_, i) => `/ui/image_sequences/sensing_intro/.orig_images/sensing_intro_${String(i).padStart(2, '0')}.png`),
            introDuration: 1000,
            loopImages: Array.from({ length: 60 }, (_, i) => `/ui/image_sequences/sensing_loop/.orig_images/sensing_loop_${String(i).padStart(2, '0')}.png`),
            loopDuration: 2000,
            descriptionArr: [{ text: '감지 중...' }, { text: '세탁물을\n확인 중' }],
            togglePeriod: 2000,
            isFocused: true
        },
        variants: [
            {
                id: 'with-desc', description: '문구 2개 순환', data: {
                    introImages: Array.from({ length: 30 }, (_, i) => `/ui/image_sequences/sensing_intro/.orig_images/sensing_intro_${String(i).padStart(2, '0')}.png`),
                    introDuration: 1000,
                    loopImages: Array.from({ length: 60 }, (_, i) => `/ui/image_sequences/sensing_loop/.orig_images/sensing_loop_${String(i).padStart(2, '0')}.png`),
                    loopDuration: 2000,
                    descriptionArr: [{ text: '감지 중...' }, { text: '세탁물을\n확인 중' }],
                    togglePeriod: 2000,
                    isFocused: true
                }
            },
            {
                id: 'single-desc', description: '단일 문구', data: {
                    introImages: Array.from({ length: 30 }, (_, i) => `/ui/image_sequences/sensing_intro/.orig_images/sensing_intro_${String(i).padStart(2, '0')}.png`),
                    introDuration: 1000,
                    loopImages: Array.from({ length: 60 }, (_, i) => `/ui/image_sequences/sensing_loop/.orig_images/sensing_loop_${String(i).padStart(2, '0')}.png`),
                    loopDuration: 2000,
                    descriptionArr: [{ text: '감지 중...' }],
                    togglePeriod: 2000,
                    isFocused: true
                }
            },
        ],
    },

    // ── Washer/Clock ─────────────────────────────────────────────────────────
    WD_CLOCK_Analog: {
        Component: WD_CLOCK_Analog,
        defaultProps: { clock_info: { hour: 10, min: 30, sec: 0, date: 'Mon Mar 13' }, theme_id: 1, isFocused: true },
        variants: [
            { id: 'blue', description: 'Blue theme 10:30', data: { clock_info: { hour: 10, min: 30, sec: 0, date: 'Mon Mar 13' }, theme_id: 1, isFocused: true } },
            { id: 'orange', description: 'Orange theme 3:45', data: { clock_info: { hour: 3, min: 45, sec: 20, date: 'Mon Mar 13' }, theme_id: 2, isFocused: true } },
            { id: 'noon', description: 'Blue theme 12:00', data: { clock_info: { hour: 12, min: 0, sec: 0, date: 'Mon Mar 13' }, theme_id: 1, isFocused: true } },
        ],
    },
    WD_CLOCK_Digital: {
        Component: WD_CLOCK_Digital,
        defaultProps: { clock_info: { hour: 10, min: 30, date: 'Mon Mar 13', am_str: 'AM', pm_str: 'PM' }, clock_type: 1, isFocused: true },
        variants: [
            { id: 'am', description: 'AM 10:30', data: { clock_info: { hour: 10, min: 30, date: 'Mon Mar 13', am_str: 'AM', pm_str: 'PM' }, clock_type: 1, isFocused: true } },
            { id: 'pm', description: 'PM 3:05', data: { clock_info: { hour: 15, min: 5, date: 'Mon Mar 13', am_str: 'AM', pm_str: 'PM' }, clock_type: 1, isFocused: true } },
            { id: 'midnight', description: '자정 0:00', data: { clock_info: { hour: 0, min: 0, date: 'Tue Mar 14', am_str: 'AM', pm_str: 'PM' }, clock_type: 1, isFocused: true } },
        ],
    },
    WD_CLOCK_Idle: {
        Component: WD_CLOCK_Idle,
        defaultProps: { hour: 10, minute: 30, ampm: 1, isFocused: true },
        variants: [
            { id: 'am', description: 'AM 10:30', data: { hour: 10, minute: 30, ampm: 1, isFocused: true } },
            { id: 'pm', description: 'PM 3:05', data: { hour: 3, minute: 5, ampm: 2, isFocused: true } },
            { id: 'single-digit', description: '한 자리 시 (9:00 AM)', data: { hour: 9, minute: 0, ampm: 1, isFocused: true } },
        ],
    },
    WD_CLOCK_Picker: {
        Component: WD_CLOCK_Picker,
        defaultProps: { scrollIndex: 5 },
        variants: [
            { id: 'd0', description: '0', data: { scrollIndex: 0 } },
            { id: 'd1', description: '1', data: { scrollIndex: 1 } },
            { id: 'd3', description: '3', data: { scrollIndex: 3 } },
            { id: 'd5', description: '5', data: { scrollIndex: 5 } },
            { id: 'd7', description: '7', data: { scrollIndex: 7 } },
            { id: 'd9', description: '9', data: { scrollIndex: 9 } },
        ],
    },
    WD_CLOCK_Reservation: {
        Component: WD_CLOCK_Reservation,
        defaultProps: { reservationDate: 'Today', reservationAmpm: 'AM', reservationHour: 3, reservationMin: 30, isFocused: true },
        variants: [
            { id: 'v1', description: 'AM reservation', data: { reservationDate: 'Today', reservationAmpm: 'AM', reservationHour: 3, reservationMin: 30, isFocused: true } },
            { id: 'v2', description: 'PM reservation', data: { reservationDate: 'Tomorrow', reservationAmpm: 'PM', reservationHour: 6, reservationMin: 0, isFocused: true } },
        ],
    },
    WD_CLOCK_ReservationTime: {
        Component: WD_CLOCK_ReservationTime,
        defaultProps: { reservationDate: 'Today', reservationAmpm: 'AM', reservationHour: 3, reservationMin: 30 },
        variants: [
            { id: 'v1', description: 'AM display', data: { reservationDate: 'Today', reservationAmpm: 'AM', reservationHour: 3, reservationMin: 30 } },
            { id: 'v2', description: 'PM display', data: { reservationDate: 'Tomorrow', reservationAmpm: 'PM', reservationHour: 8, reservationMin: 0 } },
        ],
    },
    WD_CLOCK_SetTime: {
        Component: WD_CLOCK_SetTime,
        defaultProps: { initialHour: 10, initialMinute: 30, initialAmPm: 1, initialFocusState: 1, isFocused: true },
        variants: [
            { id: 'am', description: '10:30 AM (Hour focus)', data: { initialHour: 10, initialMinute: 30, initialAmPm: 1, initialFocusState: 1, isFocused: true } },
            { id: 'pm', description: '6:00 PM (Minute focus)', data: { initialHour: 6, initialMinute: 0, initialAmPm: 2, initialFocusState: 2, isFocused: true } },
        ],
    },

    // ── Washer/Course ─────────────────────────────────────────────────────────
    WD_COURSE_Editor: {
        Component: WD_COURSE_Editor,
        defaultProps: { title_text: '코스 목록 편집', data: [{ id: 'item_1', label: 'Cotton', selected: true, is_mandatory: false }, { id: 'item_2', label: 'Synthetics', selected: false, is_mandatory: false }, { id: 'item_3', label: 'Wool', selected: true, is_mandatory: true }], initialSelectedIndex: 0, isFocused: true },
        variants: [
            { id: 'v1', description: '2개 항목', data: { title_text: '코스 목록 편집', data: [{ id: 'item_1', label: 'Cotton', selected: true, is_mandatory: false }, { id: 'item_2', label: 'Synthetics', selected: false, is_mandatory: false }], initialSelectedIndex: 0, isFocused: true } },
            { id: 'v2', description: '필수 포함 3개', data: { title_text: '코스 목록 편집', data: [{ id: 'item_1', label: 'Cotton', selected: true, is_mandatory: false }, { id: 'item_2', label: 'Synthetics', selected: false, is_mandatory: false }, { id: 'item_3', label: 'Wool', selected: true, is_mandatory: true }], initialSelectedIndex: 1, isFocused: true } },
            { id: 'v3', description: '5개 항목 (스크롤)', data: { title_text: '코스 목록 편집', data: [{ id: 'i1', label: 'Cotton', selected: true, is_mandatory: false }, { id: 'i2', label: 'Synthetics', selected: false, is_mandatory: false }, { id: 'i3', label: 'Wool', selected: true, is_mandatory: true }, { id: 'i4', label: 'Sports', selected: false, is_mandatory: false }, { id: 'i5', label: 'Quick 15m', selected: true, is_mandatory: false }], initialSelectedIndex: 0, isFocused: true } },
        ],
    },
    WD_COURSE_EditorItem: {
        Component: WD_COURSE_EditorItem,
        defaultProps: { value_text: '코튼', description_text: '일반 세탁 코스', selected: true, is_mandatory: false, show_pentagon: false, isFocused: true },
        variants: [
            { id: 'selected', description: 'Selected (focused)', data: { value_text: '코튼', description_text: '일반 세탁 코스', selected: true, is_mandatory: false, isFocused: true } },
            { id: 'unselected', description: 'Unselected', data: { value_text: '합성섬유', description_text: '중온 세탁', selected: false, is_mandatory: false, isFocused: false } },
            { id: 'mandatory', description: 'Mandatory (필수)', data: { value_text: '급속', description_text: '빠른 세탁', selected: true, is_mandatory: true, show_pentagon: true, isFocused: false } },
        ],
    },
    WD_COURSE_Item: {
        Component: WD_COURSE_Item,
        defaultProps: { courseName: 'Cotton', courseDescription: '40°C · 1200rpm · 1h 30min', courseType: 'default', options: [{ title: 'Temp', value: '40°C' }, { title: 'Spin', value: '1200rpm' }], fastdlStatus: 'none', fastdlDetectingText: 'Detecting...', fastdlHour: 0, fastdlMin: 0, showImgTM: false, showImgPentagon: false },
        variants: [
            { id: 'default', description: 'Default (설명 텍스트)', data: { courseName: 'Cotton', courseDescription: '40°C · 1200rpm · 1h 30min', courseType: 'default', options: [], fastdlStatus: 'none' } },
            { id: 'options_2', description: 'Options 2개 (회전 없음)', data: { courseName: 'Cotton', courseType: 'default', options: [{ title: 'Temp', value: '40', unit: '°C' }, { title: 'Spin', value: '1200', unit: 'rpm' }], fastdlStatus: 'none' } },
            { id: 'options_4', description: 'Options 4개 (A/B 회전)', data: { courseName: 'Cotton', courseType: 'default', options: [{ title: 'Temp', value: '40', unit: '°C' }, { title: 'Spin', value: '1200', unit: 'rpm' }, { title: 'Rinse', value: '3', unit: '회' }, { title: 'Time', value: '90', unit: 'min' }], fastdlStatus: 'none' } },
            { id: 'ai', description: 'AI 코스', data: { courseName: 'AI Wash', courseType: 'ai', options: [{ title: 'Mode', value: 'Auto' }], fastdlStatus: 'none', showImgTM: false } },
            { id: 'cloud', description: 'Cloud 코스', data: { courseName: 'ThinQ Special', courseType: 'cloud', options: [], fastdlStatus: 'none' } },
            { id: 'fastdl_processing', description: 'FastDL 감지 중', data: { courseName: 'Cotton', courseType: 'default', options: [{ title: 'Temp', value: '40°C' }], fastdlStatus: 'processing', fastdlDetectingText: 'Detecting...' } },
            { id: 'fastdl_remain', description: 'FastDL 남은 시간', data: { courseName: 'Cotton', courseType: 'default', options: [{ title: 'Temp', value: '40°C' }, { title: 'Spin', value: '800rpm' }], fastdlStatus: 'remain', fastdlHour: 1, fastdlMin: 30 } },
        ],
    },
    WD_COURSE_ItemOption: {
        Component: WD_COURSE_ItemOption,
        defaultProps: { title: '온도', value: '40', unit: '°C' },
        variants: [
            { id: 'temp', description: '온도', data: { title: '온도', value: '40', unit: '°C' } },
            { id: 'spin', description: '탈수', data: { title: '탈수', value: '1200', unit: 'rpm' } },
            { id: 'rinse', description: '헹굼 횟수', data: { title: '헹굼', value: '3', unit: '회' } },
            { id: 'no_value', description: '값 없음 (- 표시)', data: { title: '온도', value: '' } },
        ],
    },
    WD_COURSE_List: {
        Component: WD_COURSE_List,
        defaultProps: { courses: sampleCourses, selectedPageIndex: 0, energySaverEnabled: false, isFocused: true },
        variants: [
            { id: 'v1', description: '첫 번째 페이지', data: { courses: sampleCourses, selectedPageIndex: 0, energySaverEnabled: false, isFocused: true } },
            { id: 'v2', description: '두 번째 페이지 (AI)', data: { courses: sampleCourses, selectedPageIndex: 1, energySaverEnabled: false, isFocused: true } },
            { id: 'v3', description: 'Energy Saver 활성', data: { courses: sampleCourses, selectedPageIndex: 0, energySaverEnabled: true, isFocused: true } },
        ],
    },
    WD_COURSE_ProgressBase: {
        Component: WD_COURSE_ProgressBase,
        defaultProps: { course_name: 'Cotton', show_ai: false, show_pentagon: false, delay_text: '', course_status: 'Washing', course_progress: 55, description_text: '', remain_hour: 0, remain_min: 45, time_type: 'remain', blink_status: false, indicator_count: 5, indicator_current_idx: 1, show_indicator: true, contents_visible: true, theme: 'blue', isFocused: true },
        variants: [
            { id: 'washing', description: 'Washing 55%', data: { course_name: 'Cotton', course_status: 'Washing', course_progress: 55, remain_hour: 0, remain_min: 45, indicator_count: 5, indicator_current_idx: 1, show_indicator: true, contents_visible: true, theme: 'blue', isFocused: true } },
            { id: 'rinsing', description: 'Rinsing 80%', data: { course_name: 'Cotton', course_status: 'Rinsing', course_progress: 80, remain_hour: 0, remain_min: 12, indicator_count: 5, indicator_current_idx: 3, show_indicator: true, contents_visible: true, theme: 'blue', isFocused: true } },
            { id: 'ai_course', description: 'AI 코스', data: { course_name: 'AI Wash', show_ai: true, course_status: 'Washing', course_progress: 40, remain_hour: 0, remain_min: 30, indicator_count: 5, indicator_current_idx: 1, show_indicator: true, contents_visible: true, theme: 'blue', isFocused: true } },
            { id: 'pentagon', description: 'Pentagon 코스', data: { course_name: 'My Course', show_pentagon: true, course_status: 'Washing', course_progress: 20, remain_hour: 1, remain_min: 10, indicator_count: 5, indicator_current_idx: 0, show_indicator: true, contents_visible: true, theme: 'blue', isFocused: true } },
            { id: 'dryer_orange', description: '건조기 (orange)', data: { course_name: 'Cotton Dry', course_status: 'Drying', course_progress: 65, remain_hour: 0, remain_min: 20, indicator_count: 3, indicator_current_idx: 1, show_indicator: true, contents_visible: true, theme: 'orange', isFocused: true } },
            { id: 'reservation', description: '예약 시간 표시', data: { course_name: 'Cotton', course_status: '예약 중', course_progress: 0, time_type: 'reservation', reservation_hour: 11, reservation_min: 30, reservation_ampm: 'AM', indicator_count: 5, indicator_current_idx: 0, show_indicator: true, contents_visible: true, theme: 'blue', isFocused: true } },
            { id: 'blink', description: '상태 깜빡임', data: { course_name: 'Cotton', course_status: 'Spinning', course_progress: 90, remain_hour: 0, remain_min: 3, blink_status: true, indicator_count: 5, indicator_current_idx: 4, show_indicator: true, contents_visible: true, theme: 'blue', isFocused: true } },
            { id: 'with_desc', description: '설명 텍스트 포함', data: { course_name: 'Cotton', course_status: 'Washing', course_progress: 55, remain_hour: 0, remain_min: 45, description_text: '세탁 완료 후 꺼내주세요', indicator_count: 5, indicator_current_idx: 1, show_indicator: true, contents_visible: true, theme: 'blue', isFocused: true } },
        ],
    },
    WD_COURSE_ProgressFinish: {
        Component: WD_COURSE_ProgressFinish,
        defaultProps: { finish_info: { course_title_info: { course_name: 'Cotton', show_img_ai: false, show_img_pentagon: false }, img_arr: [{ image: '/ui/images/washer_dryer/img_ok.png' }], description_arr: [{ string_info: 'Wash complete!' }], number_of_img: 1, number_of_desc: 1, toggle_period: 1500, show_still_img: true }, theme: 'blue', isFocused: true },
        variants: [
            { id: 'v1', description: '세탁 완료', data: { finish_info: { course_title_info: { course_name: 'Cotton', show_img_ai: false, show_img_pentagon: false }, img_arr: [{ image: '/ui/images/washer_dryer/img_ok.png' }], description_arr: [{ string_info: 'Wash complete!' }], number_of_img: 1, number_of_desc: 1, toggle_period: 1500, show_still_img: true }, theme: 'blue', isFocused: true } },
            { id: 'v2', description: 'AI 코스 완료', data: { finish_info: { course_title_info: { course_name: 'AI Wash', show_img_ai: true, show_img_pentagon: false }, img_arr: [{ image: '/ui/images/washer_dryer/img_ok.png' }, { image: '/ui/images/washer_dryer/img_info.png' }], description_arr: [{ string_info: 'AI wash complete!' }, { string_info: 'Please remove laundry.' }], number_of_img: 2, number_of_desc: 2, toggle_period: 1500, show_still_img: true }, theme: 'blue', isFocused: true } },
            { id: 'v3', description: '건조 완료 (orange)', data: { finish_info: { course_title_info: { course_name: 'Cotton Dry', show_img_ai: false, show_img_pentagon: false }, img_arr: [{ image: '/ui/images/washer_dryer/img_ok.png' }], description_arr: [{ string_info: 'Dry complete!' }], number_of_img: 1, number_of_desc: 1, toggle_period: 1500, show_still_img: true }, theme: 'orange', isFocused: true } },
        ],
    },
    WD_COURSE_ProgressTitle: {
        Component: WD_COURSE_ProgressTitle,
        defaultProps: { title: 'Cotton', show_ai: false, show_pentagon: false, isFocused: false },
        variants: [
            { id: 'normal', description: 'Normal', data: { title: 'Cotton', show_ai: false, show_pentagon: false, isFocused: false } },
            { id: 'focused', description: 'Focused', data: { title: 'Cotton', show_ai: false, show_pentagon: false, isFocused: true } },
            { id: 'ai', description: 'AI 아이콘', data: { title: 'AI Wash', show_ai: true, show_pentagon: false, isFocused: false } },
            { id: 'pentagon', description: 'Pentagon 아이콘', data: { title: 'My Course', show_ai: false, show_pentagon: true, isFocused: false } },
            { id: 'ai_focused', description: 'AI + Focused', data: { title: 'AI Wash', show_ai: true, show_pentagon: false, isFocused: true } },
        ],
    },
    WD_COURSE_Running: {
        Component: WD_COURSE_Running,
        defaultProps: { course_name: 'Cotton', show_ai: false, course_status: 'Washing', course_progress: 55, remain_hour: 0, remain_min: 45, indicator_count: 5, indicator_current_idx: 1, show_indicator: true, contents_visible: true, theme: 'blue', isFocused: true },
        variants: [
            { id: 'washing', description: 'Washing 55%', data: { course_name: 'Cotton', course_status: 'Washing', course_progress: 55, remain_hour: 0, remain_min: 45, indicator_count: 5, indicator_current_idx: 1, show_indicator: true, contents_visible: true, theme: 'blue', isFocused: true } },
            { id: 'rinsing', description: 'Rinsing 80%', data: { course_name: 'Cotton', course_status: 'Rinsing', course_progress: 80, remain_hour: 0, remain_min: 10, indicator_count: 5, indicator_current_idx: 3, show_indicator: true, contents_visible: true, theme: 'blue', isFocused: true } },
            { id: 'spinning', description: 'Spinning 95%', data: { course_name: 'Cotton', course_status: 'Spinning', course_progress: 95, remain_hour: 0, remain_min: 2, blink_status: true, indicator_count: 5, indicator_current_idx: 4, show_indicator: true, contents_visible: true, theme: 'blue', isFocused: true } },
            { id: 'ai_running', description: 'AI 코스 진행', data: { course_name: 'AI Wash', show_ai: true, course_status: 'Washing', course_progress: 35, remain_hour: 0, remain_min: 52, indicator_count: 5, indicator_current_idx: 1, show_indicator: true, contents_visible: true, theme: 'blue', isFocused: true } },
            { id: 'dryer', description: '건조기 (orange)', data: { course_name: 'Cotton Dry', course_status: 'Drying', course_progress: 60, remain_hour: 0, remain_min: 25, indicator_count: 3, indicator_current_idx: 1, show_indicator: true, contents_visible: true, theme: 'orange', isFocused: true } },
        ],
    },

    // ── Washer/Decoration ────────────────────────────────────────────────────
    WD_DECORATION_Divider: {
        Component: WD_DECORATION_Divider,
        defaultProps: { id: 'WD_DECORATION_Divider' },
        variants: [
            { id: 'default', description: '기본 (2x33px, 30% white)', data: {} },
            { id: 'custom_height', description: '높이 커스텀 (2x20px)', data: { className: '!h-[20px]' } },
            { id: 'full_opacity', description: '불투명 (100%)', data: { className: '!opacity-100' } },
        ],
    },

    // ── Washer/Dialog ─────────────────────────────────────────────────────────
    WD_DIALOG_Accessory: {
        Component: WD_DIALOG_Accessory,
        defaultProps: { accessoryIndex: 1, rackIndex: 1, isFocused: true },
        variants: [
            { id: 'v1', description: '부속품 1 / 1단', data: { accessoryIndex: 1, rackIndex: 1, isFocused: true } },
            { id: 'v2', description: '부속품 2 / 2단', data: { accessoryIndex: 2, rackIndex: 2, isFocused: true } },
            { id: 'v3', description: '부속품 3 / 3단', data: { accessoryIndex: 3, rackIndex: 3, isFocused: true } },
            { id: 'v4', description: '부속품 4 / 4단', data: { accessoryIndex: 4, rackIndex: 4, isFocused: true } },
            { id: 'v5', description: '부속품 5 / 바닥', data: { accessoryIndex: 5, rackIndex: 0, isFocused: true } },
        ],
    },
    WD_DIALOG_AnimIcon: {
        Component: WD_DIALOG_AnimIcon,
        defaultProps: { text: '세탁 중...', sequenceId: 'img_loading_large_orange', showLoadingAnimation: true, showStaticImage: false, imagePath: '', gap: 16, isFocused: true },
        variants: [
            { id: 'loading-orange', description: '로딩 애니 (주황)', data: { text: '세탁 중...', sequenceId: 'img_loading_large_orange', showLoadingAnimation: true, showStaticImage: false, gap: 16, isFocused: true } },
            { id: 'loading-blue', description: '로딩 애니 (파랑)', data: { text: '연결 중...', sequenceId: 'img_loading_large_blue', showLoadingAnimation: true, showStaticImage: false, gap: 16, isFocused: true } },
            { id: 'static-ok', description: '완료 아이콘 (OK)', data: { text: '세탁 완료', imagePath: '/ui/images/img_ok.png', showStaticImage: true, showLoadingAnimation: false, gap: 16, isFocused: true } },
            { id: 'static-check', description: '확인 아이콘 (Check)', data: { text: '확인되었습니다', imagePath: '/ui/images/img_check.png', showStaticImage: true, showLoadingAnimation: false, gap: 16, isFocused: true } },
            { id: 'text-only', description: '텍스트만', data: { text: '잠시 후 다시 시도해 주세요', showLoadingAnimation: false, showStaticImage: false, gap: 16, isFocused: true } },
        ],
    },
    WD_DIALOG_Basic: {
        Component: WD_DIALOG_Basic,
        defaultProps: { titleText: '세탁 시작', descriptionText: '세탁 사이클을 시작할까요?', descriptionSize: 25, descriptionTextType: 'normal', iconType: 'none', isFocused: true },
        variants: [
            { id: 'v1', description: '기본 (제목+설명)', data: { titleText: '세탁 시작', descriptionText: '세탁 사이클을 시작할까요?', iconType: 'none', isFocused: true } },
            { id: 'text-only', description: '텍스트만 (제목 없음)', data: { descriptionText: '잠시 후 다시 시도해 주세요', iconType: 'none', isFocused: true } },
            { id: 'icon', description: '아이콘 포함 (경고)', data: { titleText: '오류 발생', descriptionText: '세탁을 일시정지합니다', iconType: 'normal', iconSource: '/ui/images/img_alert.png', isFocused: true } },
            { id: 'large-font', description: '큰 글씨 (30px)', data: { descriptionText: '세탁 완료 세탁물을 꺼내 주세요', descriptionSize: 30, iconType: 'none', isFocused: true } },
        ],
    },
    WD_DIALOG_ChildLock: {
        Component: WD_DIALOG_ChildLock,
        defaultProps: { text: '소아안전 잠금 해제 중', isFocused: true },
        variants: [
            { id: 'unlocking', description: '잠금 해제 중', data: { text: '소아안전 잠금 해제 중', isFocused: true } },
            { id: 'locked', description: '잠금 활성 안내', data: { text: '소아안전 잠금이 설정되었습니다', isFocused: true } },
            { id: 'guide', description: '잠금 해제 방법 안내', data: { text: '잠금 해제하려면 길게 누르세요', isFocused: true } },
        ],
    },
    WD_DIALOG_QRCode: {
        Component: WD_DIALOG_QRCode,
        defaultProps: { titleText: '오류 안내', descriptionText: 'QR 코드를 스캔하여\n고객센터에 문의하세요', qrUrl: 'https://www.lge.com/', isFocused: true },
        variants: [
            { id: 'error', description: '오류 안내 QR', data: { titleText: '오류 안내', descriptionText: 'QR 코드를 스캔하여\n고객센터에 문의하세요', qrUrl: 'https://www.lge.com/', isFocused: true } },
            { id: 'thinq', description: 'ThinQ 연결 QR', data: { titleText: 'ThinQ 연결', descriptionText: 'QR 코드를 스캔하여\nThinQ 앱에 연결하세요', qrUrl: 'https://www.lge.com/thinq', isFocused: true } },
        ],
    },
    WD_DIALOG_TextOnly: {
        Component: WD_DIALOG_TextOnly,
        defaultProps: { text: '잠시 후 다시 시도해 주세요', isFocused: true },
        variants: [
            { id: 'retry', description: '재시도 안내', data: { text: '잠시 후 다시 시도해 주세요', isFocused: true } },
            { id: 'paused', description: '일시정지', data: { text: '세탁을 일시정지합니다', isFocused: true } },
            { id: 'completed', description: '세탁 완료', data: { text: '세탁이 완료되었습니다 세탁물을 꺼내 주세요', isFocused: true } },
            { id: 'error', description: '오류 안내', data: { text: '오류가 발생했습니다 A/S 센터에 문의하세요', isFocused: true } },
        ],
    },
    WD_DIALOG_Unlock: {
        Component: WD_DIALOG_Unlock,
        defaultProps: { description: '소아안전 잠금 해제하려면\n길게 누르세요', isUnlocking: false, isFocused: true },
        variants: [
            { id: 'idle', description: '잠금 해제 대기', data: { description: '소아안전 잠금 해제하려면\n길게 누르세요', isUnlocking: false, isFocused: true } },
            { id: 'unlocking', description: '잠금 해제 진행 중', data: { description: '소아안전 잠금 해제 중...', isUnlocking: true, isFocused: true } },
        ],
    },

    // ── Washer/Pager ──────────────────────────────────────────────────────────
    WD_PAGER_Base: {
        Component: WD_PAGER_Base,
        defaultProps: {
            pageCount: 3,
            currentPage: 0,
            isFocused: true,
            indicatorImages: {
                normal: '/ui/images/ic_page_indicator_n.png',
                selected: '/ui/images/ic_page_indicator_s.png'
            }
        },
        variants: [
            { id: 'p1', description: 'Page 1 of 3', data: { pageCount: 3, currentPage: 0, isFocused: true } },
            { id: 'p2', description: 'Page 2 of 3', data: { pageCount: 3, currentPage: 1, isFocused: true } },
            { id: 'p3', description: 'Page 3 of 3', data: { pageCount: 3, currentPage: 2, isFocused: true } },
        ],
    },

    // ── Washer/Progress ───────────────────────────────────────────────────────
    WD_PROGRESS_Bar: {
        Component: WD_PROGRESS_Bar,
        defaultProps: { percent: 60 },
        variants: [
            { id: '0pct', description: '0%', data: { percent: 0 } },
            { id: '60pct', description: '60%', data: { percent: 60 } },
            { id: '100pct', description: '100%', data: { percent: 100 } },
        ],
    },
    WD_PROGRESS_Circle: {
        Component: WD_PROGRESS_Circle,
        defaultProps: { progressPct: 65, descriptionText: '세탁 중', showStillImage: true, infoImg: null, infoImgAnim: null, isFocused: true, progressRingAnim: { CM_ANIM_Sequence: { path: '/ui/image_sequences/washer_dryer/progress_circle_bar_combo/.orig_images', totalFrames: 10 }, duration: 1000 } },
        variants: [
            { id: '65pct', description: '65% 세탁 중', data: { progressPct: 65, descriptionText: '세탁 중', showStillImage: true, infoImg: null, isFocused: true, progressRingAnim: { CM_ANIM_Sequence: { path: '/ui/image_sequences/washer_dryer/progress_circle_bar_combo/.orig_images', totalFrames: 10 }, duration: 1000 } } },
            { id: '30pct', description: '30% 헹굼 중', data: { progressPct: 30, descriptionText: '헹굼 중', showStillImage: true, infoImg: null, isFocused: true, progressRingAnim: { CM_ANIM_Sequence: { path: '/ui/image_sequences/washer_dryer/progress_circle_bar_combo/.orig_images', totalFrames: 10 }, duration: 1000 } } },
            { id: '100pct', description: '100% 완료', data: { progressPct: 100, descriptionText: '완료', showStillImage: true, infoImg: null, isFocused: true, progressRingAnim: { CM_ANIM_Sequence: { path: '/ui/image_sequences/washer_dryer/progress_circle_bar_combo/.orig_images', totalFrames: 10 }, duration: 1000 } } },
            { id: 'ai-icon', description: 'AI 아이콘 포함 50%', data: { progressPct: 50, descriptionText: 'AI 세탁 중', showStillImage: true, infoImg: '/ui/images/ic_ai.png', isFocused: true, progressRingAnim: { CM_ANIM_Sequence: { path: '/ui/image_sequences/washer_dryer/progress_circle_bar_combo/.orig_images', totalFrames: 10 }, duration: 1000 } } },
            { id: 'spinning', description: '탈수 중 80%', data: { progressPct: 80, descriptionText: '탈수 중', showStillImage: true, infoImg: null, isFocused: true, progressRingAnim: { CM_ANIM_Sequence: { path: '/ui/image_sequences/washer_dryer/progress_circle_bar_combo/.orig_images', totalFrames: 10 }, duration: 1000 } } },
        ],
    },
    WD_PROGRESS_RemainTime: {
        Component: WD_PROGRESS_RemainTime,
        defaultProps: { remain_hour: 1, remain_min: 25 },
        variants: [
            { id: 'type1', description: 'Type 1: 시+분 (1hr 25min)', data: { remain_hour: 1, remain_min: 25 } },
            { id: 'type2', description: 'Type 2: 시만 (2hr)', data: { remain_hour: 2, remain_min: 0 } },
            { id: 'type3', description: 'Type 3: 분만 (45min)', data: { remain_hour: 0, remain_min: 45 } },
            { id: 'type4', description: 'Type 4: 미정 (--hr --min)', data: { remain_hour: -1, remain_min: -1 } },
            { id: 'single-digit', description: '한 자리 (1hr 5min)', data: { remain_hour: 1, remain_min: 5 } },
        ],
    },
    WD_PROGRESS_SOTA: {
        Component: WD_PROGRESS_SOTA,
        defaultProps: { title: '업그레이드 중', progress: 45, theme: 'blue', isFocused: true },
        variants: [
            { id: 'downloading', description: '다운로드 중 45% (세탁기)', data: { title: '다운로드 중', progress: 45, theme: 'blue', isFocused: true } },
            { id: 'installing', description: '설치 중 90% (건조기)', data: { title: '설치 중', progress: 90, theme: 'orange', isFocused: true } },
            { id: 'start', description: '시작 0%', data: { title: '업그레이드 준비 중', progress: 0, theme: 'blue', isFocused: true } },
            { id: 'complete', description: '완료 100%', data: { title: '업그레이드 완료', progress: 100, theme: 'blue', isFocused: true } },
        ],
    },
    WD_PROGRESS_ValveCheck: {
        Component: WD_PROGRESS_ValveCheck,
        defaultProps: { percent: 0, description: '급수 밸브를 점검하고 있습니다', theme: 'blue', isFocused: true },
        variants: [
            { id: 'washer-start', description: '세탁기 밸브 체크 시작', data: { percent: 0, description: '급수 밸브를 점검하고 있습니다', theme: 'blue', isFocused: true } },
            { id: 'washer-mid', description: '세탁기 밸브 체크 50%', data: { percent: 50, description: '급수 밸브를 점검하고 있습니다', theme: 'blue', isFocused: true } },
            { id: 'dryer', description: '건조기 밸브 체크', data: { percent: 30, description: '배수 밸브를 점검하고 있습니다', theme: 'orange', isFocused: true } },
        ],
    },

    // ── Washer/Toast ──────────────────────────────────────────────────────────
    WD_TOAST_Message: {
        Component: WD_TOAST_Message,
        defaultProps: { text: 'Cycle complete!', duration: 0 },
        variants: [
            { id: 'v1', description: 'Toast message', data: { text: 'Wash complete. Please remove laundry.', duration: 0 } },
            { id: 'short', description: 'Short toast', data: { text: 'Done!', duration: 0 } },
            { id: 'multiline', description: 'Multiline', data: { text: 'Wash complete.\nPlease remove laundry.', duration: 0 } },
        ],
    },
};
