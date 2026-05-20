# Frontend Architecture

## MVP App Type

초기 검증은 모바일 웹 MVP로 시작합니다.
네이티브 알림과 위젯이 중요해지는 시점에 Expo React Native로 확장합니다.

## Suggested Stack

- React or Next.js
- TypeScript
- Tailwind CSS
- Zustand or lightweight Context state
- LocalStorage persistence
- date-fns for time calculation

## Domain Model

```ts
type DayIndex = 1 | 2 | 3;

type DayStatus = "waiting" | "active" | "completed" | "missed" | "endured";

type DayPart = {
  index: DayIndex;
  label: string;
  role: string;
  startTime: string;
  endTime: string;
  goal: string;
  status: DayStatus;
  note?: string;
};

type DailyCycle = {
  date: string;
  startTime: string;
  parts: DayPart[];
};

type UserSettings = {
  startTime: string;
  notificationsEnabled: boolean;
  dayRoles: Record<DayIndex, string>;
};
```

## Component Tree

```text
App
├─ AppShell
│  ├─ TodayScreen
│  │  ├─ DayHeader
│  │  ├─ TimeRemaining
│  │  ├─ CurrentGoal
│  │  ├─ PrimaryActions
│  │  └─ ThreeDayTimeline
│  ├─ ReportScreen
│  └─ SettingsScreen
├─ OnboardingFlow
│  ├─ ConceptIntro
│  ├─ StartTimePicker
│  ├─ ThreeDaysPreview
│  └─ FirstGoalSetup
└─ Modals
   ├─ CheckInModal
   └─ RestartModal
```

## State Slices

### settings

- startTime
- notificationsEnabled
- dayRoles
- hasCompletedOnboarding

### today

- currentCycle
- currentDayIndex
- currentGoal
- checkInResults

### ui

- activeModal
- selectedTab
- isEditingGoal

## Time Calculation Rules

1. User sets a `startTime`.
2. The app creates 3 parts of 8 hours each.
3. Current day part is calculated by checking now against the 3 time ranges.
4. If the third part crosses midnight, the cycle still belongs to the start date.

Example:

```text
startTime: 06:00
1일차: 06:00 - 14:00
2일차: 14:00 - 22:00
3일차: 22:00 - 06:00
```

## Key Utilities

```text
src/lib/time/createDailyCycle.ts
src/lib/time/getCurrentDayPart.ts
src/lib/time/getRemainingTime.ts
src/lib/time/formatTimeRange.ts
```

## Suggested File Structure

```text
src/
├─ app/
│  ├─ page.tsx
│  └─ layout.tsx
├─ components/
│  ├─ today/
│  │  ├─ DayHeader.tsx
│  │  ├─ TimeRemaining.tsx
│  │  ├─ CurrentGoal.tsx
│  │  ├─ PrimaryActions.tsx
│  │  └─ ThreeDayTimeline.tsx
│  ├─ onboarding/
│  ├─ report/
│  └─ ui/
├─ lib/
│  ├─ time/
│  └─ storage/
├─ store/
│  └─ useHaruSamilStore.ts
├─ types/
│  └─ index.ts
└─ styles/
```

## MVP Routes

```text
/              Today
/onboarding    First setup
/report        Today and weekly report
/settings      Start time, labels, notification settings
```

## Implementation Notes

- Keep the first build local-first.
- Do not add auth in MVP.
- Do not add social features in MVP.
- Do not overbuild task management.
- A day part has only one goal.

