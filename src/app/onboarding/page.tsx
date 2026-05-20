"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SplashLogo from "@/components/onboarding/SplashLogo";
import StorySlide from "@/components/onboarding/StorySlide";
import StartTimePicker from "@/components/onboarding/StartTimePicker";
import ThreeDaysPreview from "@/components/onboarding/ThreeDaysPreview";
import LifestyleSetup from "@/components/onboarding/LifestyleSetup";
import AiPlanResult from "@/components/onboarding/AiPlanResult";
import { useHaruSamilStore } from "@/store/useHaruSamilStore";
import { DayIndex } from "@/types";

type Step = "logo" | "story1" | "story2" | "time" | "preview" | "lifestyle" | "aiResult";
const STEPS: Step[] = ["logo", "story1", "story2", "time", "preview", "lifestyle", "aiResult"];

// dots exclude the auto-advance logo step
const DOT_STEPS: Step[] = ["story1", "story2", "time", "preview", "lifestyle", "aiResult"];

interface DayPlanItem {
  index: DayIndex;
  goal: string;
  tasks: string[];
}

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("logo");
  const [startTime, setStartTime] = useState("06:00");
  const [lifestyle, setLifestyle] = useState("");
  const completeOnboardingWithAiPlan = useHaruSamilStore((s) => s.completeOnboardingWithAiPlan);
  const router = useRouter();

  const stepIndex = STEPS.indexOf(step);
  const dotIndex = DOT_STEPS.indexOf(step); // -1 for logo

  // no back on logo, story1, or aiResult
  const canGoBack = stepIndex > 0 && step !== "logo" && step !== "story1" && step !== "aiResult";

  const showTopBar = step !== "logo";

  return (
    <div
      className="min-h-screen w-full flex justify-center dot-grid"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="w-full max-w-[430px] h-screen relative flex flex-col">

        {/* top bar — hidden during logo */}
        {showTopBar && (
          <div className="flex items-center justify-between px-6 pt-6">
            {/* back button */}
            <button
              onClick={() => {
                if (canGoBack) setStep(STEPS[stepIndex - 1]);
              }}
              className="mono text-[11px] tracking-[0.1em] uppercase transition-opacity active:opacity-50"
              style={{
                color: canGoBack ? "var(--text-2)" : "transparent",
                pointerEvents: canGoBack ? "auto" : "none",
              }}
            >
              ← 이전
            </button>

            {/* progress dots (DOT_STEPS 기준) */}
            <div className="flex gap-1.5">
              {DOT_STEPS.map((s, i) => (
                <div
                  key={s}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === dotIndex ? "16px" : "5px",
                    height: "5px",
                    backgroundColor:
                      i === dotIndex
                        ? "var(--text)"
                        : i < dotIndex
                        ? "var(--text-2)"
                        : "var(--text-3)",
                  }}
                />
              ))}
            </div>

            {/* spacer */}
            <div className="w-12" />
          </div>
        )}

        {/* content */}
        <div key={step} className="flex-1 fade-in overflow-hidden">
          {step === "logo" && (
            <SplashLogo onNext={() => setStep("story1")} />
          )}
          {step === "story1" && (
            <StorySlide index={1} onNext={() => setStep("story2")} />
          )}
          {step === "story2" && (
            <StorySlide index={2} onNext={() => setStep("time")} />
          )}
          {step === "time" && (
            <StartTimePicker
              defaultTime={startTime}
              onNext={(t) => { setStartTime(t); setStep("preview"); }}
            />
          )}
          {step === "preview" && (
            <ThreeDaysPreview
              startTime={startTime}
              onNext={() => setStep("lifestyle")}
            />
          )}
          {step === "lifestyle" && (
            <LifestyleSetup
              onNext={(ls) => { setLifestyle(ls); setStep("aiResult"); }}
            />
          )}
          {step === "aiResult" && (
            <AiPlanResult
              lifestyle={lifestyle}
              startTime={startTime}
              onConfirm={(plans: DayPlanItem[]) => {
                completeOnboardingWithAiPlan(startTime, plans);
                router.push("/");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
