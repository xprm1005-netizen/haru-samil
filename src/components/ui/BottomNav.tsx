"use client";

import Link from "next/link";

type Tab = "today" | "report" | "settings";

const tabs: { key: Tab; label: string; href: string }[] = [
  { key: "today",    label: "오늘",   href: "/" },
  { key: "report",   label: "리포트", href: "/report" },
  { key: "settings", label: "설정",   href: "/settings" },
];

interface Props {
  active: Tab;
}

export default function BottomNav({ active }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex justify-center z-40"
      style={{
        backgroundColor: "var(--bg)",
        borderTop: "1px solid var(--line)",
      }}
    >
      <div className="w-full max-w-[430px] flex">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center py-4 gap-0 transition-opacity active:opacity-50"
            >
              <span
                className="mono text-[11px] tracking-[0.12em] uppercase font-medium"
                style={{
                  color: isActive ? "var(--text)" : "var(--text-3)",
                }}
              >
                {isActive ? `[ ${tab.label} ]` : tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
