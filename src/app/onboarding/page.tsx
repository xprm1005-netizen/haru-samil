"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConceptIntro from "@/components/onboarding/ConceptIntro";
import StartTimePicker from "@/components/onboarding/StartTimePicker";
import ThreeDaysPreview from "@/components/onboarding/ThreeDaysPreview";
import FirstGoalSetup from "@/components/onboarding/FirstGoalSetup";
import { useHaruSamilStore } from "@/store/useHaruSamilStore";

type Step = "intro" | "time" | "preview" | "goal";
const STEPS: Step[] = ["intro", "time", "preview", "goal"];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("intro");
  const [startTime, setStartTime] = useState("06:00");
  const completeOnboarding = useHaruSamilStore((s) => s.completeOnboarding);
  const router = useRouter();

  const stepIndex = STEPS.indexOf(step);

  return (
    <div
      className="min-h-screen w-full flex justify-center dot-grid"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="w-full max-w-[430px] h-screen relative flex flex-col">
        {/* top bar */}
        <div className="flex items-center justify-between px-6 pt-6">
          {/* back button */}
          <button
            onClick={() => {
              if (stepIndex > 0) setStep(STEPS[stepIndex - 1]);
            }}
            className="mono text-[11px] tracking-[0.1em] uppercase transition-opacity active:opacity-50"
            style={{
              color: stepIndex > 0 ? "var(--text-2)" : "transparent",
              pointerEvents: stepIndex > 0 ? "auto" : "none",
            }}
          >
            ← 이전
          </button>

          {/* progress dots */}
          <div className="flex gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === stepIndex ? "16px" : "5px",
                  height: "5px",
                  backgroundColor:
                    i === stepIndex
                      ? "var(--text)"
                      : i < stepIndex
                      ? "var(--text-2)"
                      : "var(--text-3)",
                }}
              />
            ))}
          </div>

          {/* spacer */}
          <div className="w-12" />
        </div>

        {/* content — fade key forces re-animation on step change */}
        <div key={step} className="flex-1 fade-in">
          {step === "intro" && (
            <ConceptIntro onNext={() => setStep("time")} />
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
              onNext={() => setStep("goal")}
            />
          )}
          {step === "goal" && (
            <FirstGoalSetup
              onDone={(goal) => {
                completeOnboarding(startTime, goal);
                router.push("/");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
