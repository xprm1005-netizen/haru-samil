"use client";

import { useState } from "react";
import { DayIndex } from "@/types";

interface Props {
  dayIndex: DayIndex;
  goal: string;
  timeRange: string;
  totalDays: number;
}

const DAY_COLORS: Record<DayIndex, string> = {
  1: "#22c55e",
  2: "#60a5fa",
  3: "#fbbf24",
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split("");
  const lines: string[] = [];
  let line = "";
  for (const char of words) {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line.length > 0) {
      lines.push(line);
      line = char;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function generateShareCard(
  dayIndex: DayIndex,
  goal: string,
  timeRange: string,
  totalDays: number
): string {
  const SIZE = 900;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;

  // background
  ctx.fillStyle = "#080808";
  ctx.fillRect(0, 0, SIZE, SIZE);

  // subtle dot grid
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  const GRID = 28;
  for (let x = GRID; x < SIZE; x += GRID) {
    for (let y = GRID; y < SIZE; y += GRID) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const color = DAY_COLORS[dayIndex];
  const PAD = 72;

  // top label
  ctx.fillStyle = "#555";
  ctx.font = "600 26px -apple-system, 'Helvetica Neue', sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("HARU-SAMIL", PAD, PAD + 12);

  // day index chip
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(PAD, PAD + 60, 136, 72, 8);
  ctx.fill();
  ctx.fillStyle = "#080808";
  ctx.font = "700 30px -apple-system, 'Helvetica Neue', sans-serif";
  ctx.fillText(`${dayIndex}일차`, PAD + 20, PAD + 106);

  // goal text
  ctx.fillStyle = "#efefef";
  ctx.font = "700 60px -apple-system, 'Helvetica Neue', sans-serif";
  const goalLines = wrapText(ctx, goal || "목표를 세워보세요", SIZE - PAD * 2);
  const goalStartY = PAD + 200;
  goalLines.slice(0, 3).forEach((line, i) => {
    ctx.fillText(line, PAD, goalStartY + i * 76);
  });

  // time range
  ctx.fillStyle = "#444";
  ctx.font = "500 32px -apple-system, 'Helvetica Neue', sans-serif";
  ctx.fillText(timeRange, PAD, SIZE - PAD - 100);

  // divider line
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, SIZE - PAD - 64);
  ctx.lineTo(SIZE - PAD, SIZE - PAD - 64);
  ctx.stroke();

  // bottom branding
  ctx.fillStyle = "#333";
  ctx.font = "500 28px -apple-system, 'Helvetica Neue', sans-serif";
  ctx.fillText("하루를 3일처럼", PAD, SIZE - PAD - 16);

  if (totalDays >= 2) {
    ctx.fillStyle = color;
    ctx.font = "600 28px -apple-system, 'Helvetica Neue', sans-serif";
    const streakText = `${totalDays}일째`;
    const textW = ctx.measureText(streakText).width;
    ctx.fillText(streakText, SIZE - PAD - textW, SIZE - PAD - 16);
  }

  return canvas.toDataURL("image/png");
}

export default function ShareButton({ dayIndex, goal, timeRange, totalDays }: Props) {
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const dataUrl = generateShareCard(dayIndex, goal, timeRange, totalDays);
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "haru-samil.png", { type: "image/png" });

      const shareText = `하루삼일 ${dayIndex}일차 · ${goal || "오늘의 목표"}\n하루를 3일처럼 — haru-samil.vercel.app`;

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText });
      } else if (navigator.share) {
        await navigator.share({ text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert("링크가 복사됐습니다.");
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        console.error("share error", e);
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={sharing}
      className="mono text-[11px] tracking-[0.12em] uppercase transition-opacity active:opacity-50 disabled:opacity-30"
      style={{ color: "var(--text-3)" }}
    >
      {sharing ? "생성 중..." : "공유 ↗"}
    </button>
  );
}
