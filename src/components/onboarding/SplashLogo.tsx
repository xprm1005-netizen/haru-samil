"use client";

import { useEffect } from "react";

interface Props {
  onNext: () => void;
}

export default function SplashLogo({ onNext }: Props) {
  useEffect(() => {
    const id = setTimeout(onNext, 1500);
    return () => clearTimeout(id);
  }, [onNext]);

  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-5 fade-in"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <h1
        className="text-[40px] font-bold tracking-tight"
        style={{ color: "var(--text)" }}
      >
        하루삼일
      </h1>

      <div className="flex gap-3">
        {(["var(--day-1)", "var(--day-2)", "var(--day-3)"] as const).map((color, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{ width: 10, height: 10, backgroundColor: color }}
          />
        ))}
      </div>

      <span
        className="mono text-[12px] tracking-[0.18em] uppercase"
        style={{ color: "var(--text-3)" }}
      >
        하루를 3일처럼
      </span>
    </div>
  );
}
