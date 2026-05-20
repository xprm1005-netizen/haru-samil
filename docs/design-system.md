# Design System

## Design Direction

하루삼일은 차분한 미래형 알람 앱처럼 느껴져야 합니다.
귀엽거나 과한 자기계발 톤은 피합니다.

## Visual Principles

- 모바일 우선
- 큰 시간 숫자
- 명확한 현재 일차
- 짧은 문장
- 넉넉한 여백
- 중첩 카드 금지
- 카드 남발 금지
- 일차 색상은 상태 구분에만 사용

## Color Tokens

```css
:root {
  --color-bg: #f7f8f5;
  --color-surface: #ffffff;
  --color-text: #161616;
  --color-muted: #6f756f;
  --color-line: #dfe3dc;

  --color-day-1: #2fbf71;
  --color-day-2: #2563eb;
  --color-day-3: #f59e0b;

  --color-danger: #dc2626;
  --color-success: #16a34a;
}
```

## Typography

- Use system font first.
- Hero-scale text only for current day and countdown.
- No negative letter spacing.
- Do not scale font size by viewport width.

Suggested sizes:

```text
Display time: 48px / 1.0
Screen title: 28px / 1.15
Section label: 13px / 1.4
Body: 16px / 1.5
Button: 16px / 1.2
Caption: 12px / 1.4
```

## Layout

Mobile baseline:

```text
max-width: 430px
page padding: 20px
section gap: 28px
button height: 52px
border radius: 8px
```

## Main Screen Hierarchy

1. Current day label
2. Time range
3. Countdown
4. Role
5. Goal
6. Actions
7. Timeline

## Buttons

Primary:

- 완료
- 첫 번째 하루 시작
- 마감하기

Secondary:

- 재시작
- 목표 바꾸기
- 설정

Buttons should be text-based because this MVP depends on strong language and clarity.

## Status Language

Use:

- 대기
- 진행
- 완료
- 놓침
- 버팀
- 해냄

Avoid:

- 실패
- 탈락
- 부족
- 경고

## Motion

Use subtle transitions only:

- Day transition fade
- Countdown no aggressive animation
- Restart modal slide up
- Completion feedback 300ms or less

