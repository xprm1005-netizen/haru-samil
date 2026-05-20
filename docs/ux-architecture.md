# UX Architecture

## Experience Goal

사용자가 앱을 여는 순간 "오늘은 아직 끝나지 않았다"는 감각을 받게 한다.

## Information Architecture

```text
App
├─ Onboarding
│  ├─ ConceptIntro
│  ├─ StartTimeSetup
│  ├─ ThreeDaysPreview
│  └─ FirstGoalSetup
├─ Today
│  ├─ CurrentDayStatus
│  ├─ RemainingTime
│  ├─ CurrentGoal
│  ├─ PrimaryActions
│  └─ ThreeDayTimeline
├─ CheckIn
│  ├─ DayScore
│  ├─ OneLineNote
│  └─ NextDayPreview
├─ Report
│  ├─ TodaySummary
│  ├─ ThreeDayResult
│  └─ WeeklyPattern
└─ Settings
   ├─ StartTime
   ├─ DayLabels
   ├─ Notifications
   └─ Premium
```

## Onboarding Flow

### 1. Concept Intro

Primary copy:

```text
하루는 하나가 아닙니다.

당신의 24시간을
3개의 하루로 나눕니다.
```

CTA:

```text
시작하기
```

### 2. Start Time Setup

사용자가 첫 번째 하루의 시작 시간을 정합니다.

Default:

```text
06:00
```

Copy:

```text
당신의 첫 번째 하루는 언제 시작하나요?
```

### 3. Three Days Preview

설정된 시작 시간을 기준으로 8시간씩 3개 하루를 보여줍니다.

Example:

```text
1일차 06:00 - 14:00
2일차 14:00 - 22:00
3일차 22:00 - 06:00
```

### 4. First Goal Setup

첫 번째 하루의 목표를 1개만 입력합니다.

Copy:

```text
첫 번째 하루에서
이것 하나만 하면 성공입니다.
```

## Today Screen

홈 화면은 앱의 중심입니다.

Priority order:

1. 현재 일차
2. 남은 시간
3. 이번 하루의 역할
4. 목표 1개
5. 완료/재시작
6. 3일 타임라인

Wireframe:

```text
오늘의 2일차
14:00 - 22:00

03:42:18
남은 시간

이번 하루의 역할
실행하는 나

목표
[ 제안서 1개 보내기 ]

[완료] [재시작]

1일차 완료 · 2일차 진행 · 3일차 대기
```

## Check-in Flow

완료 또는 일차 종료 시 체크인을 띄웁니다.

```text
2일차를 어떻게 살았나요?

[놓쳤다] [버텼다] [해냈다]

한 줄 기록
[                       ]

[2일차 마감하기]
```

## Restart Flow

재시작은 이 앱의 시그니처 기능입니다.

```text
2일차를 다시 시작합니다.

방금 전까지는
이전 장면에 두고 오세요.

[같은 목표로 재시작]
[목표 바꾸기]
```

## Notification Copy

```text
오늘의 2일차가 시작됐습니다.
첫 번째 하루는 끝났고, 새 하루가 열렸어요.
```

```text
오늘의 3일차입니다.
아직 오늘은 끝나지 않았습니다.
```

```text
1일차 마감 시간입니다.
살았든 놓쳤든, 다음 하루로 넘어갑니다.
```

