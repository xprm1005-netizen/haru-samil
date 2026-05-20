"use client";

import { useState } from "react";

interface Props {
  defaultTime?: string;
  onNext: (time: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "30"];

export default function StartTimePicker({
  defaultTime = "06:00",
  onNext,
}: Props) {
  const [hour, setHour] = useState(defaultTime.split(":")[0]);
  const [minute, setMinute] = useState(defaultTime.split(":")[1]);

  return (
    <div className="flex flex-col justify-between h-full px-6 py-16">
      <div className="flex-1 flex flex-col justify-center gap-12">
        <div className="flex flex-col gap-4">
          <span
            className="mono text-[11px] tracking-[0.22em] uppercase"
            style={{ color: "var(--text-3)" }}
          >
            시작 시간
          </span>
          <h2
            className="text-[30px] font-bold leading-tight tracking-tight"
            style={{ color: "var(--text)" }}
          >
            첫 번째 하루는
            <br />
            언제 시작하나요?
          </h2>
          <p className="text-[14px]" style={{ color: "var(--text-2)" }}>
            6시간마다 새 하루가 열립니다.
          </p>
        </div>

        {/* time picker */}
        <div
          className="flex items-center gap-0 py-6"
          style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
        >
          <select
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="mono text-[56px] font-bold appearance-none bg-transparent flex-1 text-center transition-opacity"
            style={{ color: "var(--text)", cursor: "pointer" }}
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          <span
            className="mono text-[56px] font-bold pb-1"
            style={{ color: "var(--text-3)" }}
          >
            :
          </span>

          <select
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className="mono text-[56px] font-bold appearance-none bg-transparent flex-1 text-center"
            style={{ color: "var(--text)", cursor: "pointer" }}
          >
            {MINUTES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <p
          className="mono text-[11px] tracking-[0.1em]"
          style={{ color: "var(--text-3)" }}
        >
          설정에서 언제든 변경할 수 있습니다.
        </p>
      </div>

      <button
        onClick={() => onNext(`${hour}:${minute}`)}
        className="w-full h-[52px] font-semibold tracking-wide transition-opacity active:opacity-70"
        style={{
          backgroundColor: "var(--text)",
          color: "var(--bg)",
          borderRadius: "4px",
          fontSize: "15px",
        }}
      >
        다음
      </button>
    </div>
  );
}
