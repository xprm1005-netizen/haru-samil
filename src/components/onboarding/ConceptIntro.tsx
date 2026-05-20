"use client";

interface Props {
  onNext: () => void;
}

const SEGMENTS = [
  { label: "1일차", color: "var(--day-1)", time: "06:00", index: 0 },
  { label: "2일차", color: "var(--day-2)", time: "14:00", index: 1 },
  { label: "3일차", color: "var(--day-3)", time: "22:00", index: 2 },
];

export default function ConceptIntro({ onNext }: Props) {
  return (
    <div className="flex flex-col justify-between h-full px-6 py-14">
      <div className="flex flex-col gap-10 flex-1 justify-center">

        {/* brand row */}
        <div className="flex items-center justify-between stagger stagger-0">
          <span
            className="mono text-[11px] tracking-[0.22em] uppercase"
            style={{ color: "var(--text-3)" }}
          >
            하루삼일
          </span>
          <span
            className="text-[11px]"
            style={{ color: "var(--text-3)" }}
          >
            하루를 3일처럼 사는 사람들
          </span>
        </div>

        {/* headline */}
        <div className="flex flex-col gap-1 stagger stagger-2">
          <h1
            className="text-[42px] font-bold leading-[1.08] tracking-tight"
            style={{ color: "var(--text)" }}
          >
            당신의 하루는
            <br />
            <span style={{ color: "var(--text-2)" }}>24시간이</span>
            <br />
            아니라 3일
            <span style={{ color: "var(--text-2)" }}>입니다.</span>
          </h1>
        </div>

        {/* 3-part timeline visual */}
        <div className="flex flex-col gap-3">
          {/* bar */}
          <div className="flex gap-[2px]">
            {SEGMENTS.map((seg) => (
              <div
                key={seg.index}
                className={`bar-seg bar-seg-${seg.index}`}
                style={{
                  flex: 1,
                  height: "3px",
                  backgroundColor: seg.color,
                  borderRadius: "1px",
                }}
              />
            ))}
          </div>

          {/* labels row */}
          <div className="flex">
            {SEGMENTS.map((seg) => (
              <div
                key={seg.index}
                className={`flex-1 flex flex-col gap-0.5 stagger stagger-3`}
                style={{ animationDelay: `${620 + seg.index * 120}ms` }}
              >
                <span
                  className="mono text-[11px] font-bold"
                  style={{ color: seg.color }}
                >
                  {seg.label}
                </span>
                <span
                  className="mono text-[10px]"
                  style={{ color: "var(--text-3)" }}
                >
                  {seg.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* sub copy */}
        <div className="flex flex-col gap-2">
          <p
            className="text-[15px] leading-[1.6] stagger stagger-4"
            style={{ color: "var(--text-2)" }}
          >
            8시간마다 새 하루가 시작됩니다.
          </p>
          <p
            className="text-[13px] leading-[1.6] stagger stagger-5"
            style={{ color: "var(--text-3)" }}
          >
            오늘 하루, 아직 이틀 남았습니다.
          </p>
        </div>

      </div>

      {/* CTA */}
      <button
        onClick={onNext}
        className="w-full h-[52px] font-semibold tracking-wide transition-opacity active:opacity-70 stagger stagger-6"
        style={{
          backgroundColor: "var(--text)",
          color: "var(--bg)",
          borderRadius: "4px",
          fontSize: "15px",
        }}
      >
        시작하기
      </button>
    </div>
  );
}
