"use client";

import { useCallback, useEffect, useState } from "react";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import UsageSidebar from "@/components/UsageSidebar";
import PromptSidebar from "@/components/PromptSidebar";
import type { ColorScheme } from "@/hooks/useColorScheme";

const FORCED_SCHEME: ColorScheme = "light";

type SidebarMode = "none" | "templates" | "usage";

export default function App() {
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("none");
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const root = document.documentElement;
    root.dataset.colorScheme = FORCED_SCHEME;
    root.classList.remove("dark");
    root.style.colorScheme = FORCED_SCHEME;

    // Load sidebar mode from localStorage
    const savedMode = localStorage.getItem("sidebar-mode") as SidebarMode;
    if (savedMode && ["none", "templates", "usage"].includes(savedMode)) {
      setSidebarMode(savedMode);
    }
  }, []);

  useEffect(() => {
    // Save sidebar mode to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-mode", sidebarMode);
    }
  }, [sidebarMode]);

  const handleWidgetAction = useCallback(async (action: FactAction) => {
    if (process.env.NODE_ENV !== "production") {
      console.info("[ChatKitPanel] widget action", action);
    }
  }, []);

  const handleResponseEnd = useCallback((sessionId?: string) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[ChatKitPanel] response end", sessionId);
    }
    if (sessionId) {
      setCurrentSessionId(sessionId);
    }
  }, []);

  const handleInsertPrompt = useCallback(async (text: string) => {
    // This will be passed to ChatKitPanel to handle prompt insertion
    console.log("Insert prompt:", text);
  }, []);

  return (
    <main className="flex min-h-screen bg-white">
      {/* Sidebar Toggle Buttons */}
      <div className="fixed left-4 top-4 z-50 flex gap-2">
        <button
          onClick={() => setSidebarMode(sidebarMode === "templates" ? "none" : "templates")}
          className={`p-2 rounded-lg transition-colors ${
            sidebarMode === "templates"
              ? "bg-gray-200 text-gray-900"
              : "bg-white text-gray-600 hover:bg-gray-100"
          } shadow-sm border border-gray-200`}
          aria-label="Vorlagen"
          title="Vorlagen"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => setSidebarMode(sidebarMode === "usage" ? "none" : "usage")}
          className={`p-2 rounded-lg transition-colors ${
            sidebarMode === "usage"
              ? "bg-gray-200 text-gray-900"
              : "bg-white text-gray-600 hover:bg-gray-100"
          } shadow-sm border border-gray-200`}
          aria-label="Token-Nutzung"
          title="Token-Nutzung"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>

      {/* Prompt Templates Sidebar */}
      {sidebarMode === "templates" && (
        <div className="w-72 shrink-0 border-r border-gray-200">
          <PromptSidebar onInsert={handleInsertPrompt} />
        </div>
      )}

      {/* Usage Tracking Sidebar */}
      {sidebarMode === "usage" && (
        <div className="w-80 shrink-0 border-r border-gray-200">
          <UsageSidebar
            isOpen={true}
            currentSessionId={currentSessionId}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-end">
        {/* Chat Panel */}
        <div className="mx-auto w-full max-w-5xl px-4">
          <ChatKitPanel
            theme={FORCED_SCHEME}
            onWidgetAction={handleWidgetAction}
            onResponseEnd={handleResponseEnd}
            onThemeRequest={() => {}}
            onInsertPrompt={handleInsertPrompt}
          />
        </div>
      </div>
    </main>
  );
}
