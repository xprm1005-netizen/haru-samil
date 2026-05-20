"use client";

interface Props {
  index: 1 | 2;
  onNext: () => void;
}

export default function StorySlide({ index, onNext }: Props) {
  if (index === 1) {
    return (
      <div className="flex flex-col justify-between h-full px-6 py-14 fade-in">
        <div className="flex flex-col gap-10 flex-1 justify-center">

          <span
            className="mono text-[11px] tracking-[0.22em] uppercase"
            style={{ color: "var(--text-3)" }}
          >
            HARU-SAMIL
          </span>

          <div className="flex flex-col gap-6">
            <blockquote
              className="text-[30px] font-bold leading-[1.2] tracking-tight"
              style={{ color: "var(--text)" }}
            >
              &ldquo;시간은 금이다.<br />
              젊음을 낭비하지 말라.&rdquo;
            </blockquote>

            <div style={{ width: 40, height: 1, backgroundColor: "var(--line-2)" }} />

            <div className="flex flex-col gap-2">
              <p className="text-[18px] leading-[1.6]" style={{ color: "var(--text-2)" }}>
                이 말이 와닿은 날이<br />
                몇 번이나 있었나요?
              </p>
              <p className="text-[15px] leading-[1.7]" style={{ color: "var(--text-3)" }}>
                도대체 어떻게 살아야<br />
                시간을 금처럼 쓸 수 있을까요.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onNext}
            className="mono text-[12px] tracking-[0.12em] uppercase transition-opacity active:opacity-50"
            style={{ color: "var(--text-3)" }}
          >
            다음 →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-full px-6 py-14 fade-in">
      <div className="flex flex-col gap-10 flex-1 justify-center">

        <span
          className="mono text-[11px] tracking-[0.22em] uppercase"
          style={{ color: "var(--text-3)" }}
        >
          HARU-SAMIL
        </span>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-[28px] font-bold leading-[1.2] tracking-tight" style={{ color: "var(--text-2)" }}>
              남들이 하루를
            </p>
            <p className="text-[28px] font-bold leading-[1.2] tracking-tight" style={{ color: "var(--text-2)" }}>
              1번 살 때,
            </p>
            <p className="text-[28px] font-bold leading-[1.2] tracking-tight mt-2" style={{ color: "var(--text-2)" }}>
              당신은
            </p>
            <p className="text-[52px] font-bold leading-[1.1] tracking-tight" style={{ color: "var(--text)" }}>
              3번 삽니다.
            </p>
          </div>

          {/* 3-block timeline bar */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-1.5">
              {[
                { color: "var(--day-1)", label: "1일차" },
                { color: "var(--day-2)", label: "2일차" },
                { color: "var(--day-3)", label: "3일차" },
              ].map(({ color, label }, i) => (
                <div key={label} className="flex-1 flex flex-col gap-1.5">
                  <div
                    className={`h-[6px] rounded-full bar-seg bar-seg-${i}`}
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>
                      {label}
                    </span>
                    <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>
                      8h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-[16px] leading-[1.6]" style={{ color: "var(--text-2)" }}>
              매일 3번의 새로운 기회.
            </p>
            <p className="text-[15px] leading-[1.7]" style={{ color: "var(--text-3)" }}>
              놓쳐도 괜찮습니다.<br />
              다음 하루가 있습니다.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full h-[52px] font-semibold tracking-wide transition-opacity active:opacity-70"
        style={{
          backgroundColor: "var(--text)",
          color: "var(--bg)",
          borderRadius: "4px",
          fontSize: "15px",
        }}
      >
        하루삼일 시작하기 →
      </button>
    </div>
  );
}
