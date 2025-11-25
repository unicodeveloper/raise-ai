"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { memo } from "react";
import type { ChatMessage } from "@/lib/types";
import { Suggestion } from "./elements/suggestion";
import type { VisibilityType } from "./visibility-selector";

type SuggestedActionsProps = {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  selectedVisibilityType: VisibilityType;
  onEnableDeepSearch?: () => void;
};

function PureSuggestedActions({ chatId, sendMessage, onEnableDeepSearch }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: "SEC Filings Analysis",
      description: "Find mentions of AI strategy in Microsoft's 2024 SEC filings",
      icon: "📊",
      color: "from-blue-500/10 to-cyan-500/10",
      border: "hover:border-cyan-500/50",
    },
    {
      title: "Market Comparison",
      description: "Compare Tesla's stock performance against GM and Ford over the past year",
      icon: "📈",
      color: "from-emerald-500/10 to-green-500/10",
      border: "hover:border-emerald-500/50",
    },
    {
      title: "Regulatory Impact",
      description: "Analyze how EU AI Act and US AI orders affect big tech",
      icon: "⚖️",
      color: "from-purple-500/10 to-pink-500/10",
      border: "hover:border-purple-500/50",
    },
    {
      title: "Funding Flows",
      description: "Map international development funds and UN programs supporting tech",
      icon: "🌍",
      color: "from-amber-500/10 to-orange-500/10",
      border: "hover:border-amber-500/50",
    },
  ];

  return (
    <div
      className="grid w-full gap-3 sm:grid-cols-2"
      data-testid="suggested-actions"
    >
      {suggestedActions.map((action, index) => (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          initial={{ opacity: 0, y: 20 }}
          key={action.title}
          transition={{ delay: 0.05 * index }}
        >
          <Suggestion
            className={`h-full w-full justify-start whitespace-normal border-muted bg-gradient-to-br ${action.color} p-4 text-left font-normal text-sm shadow-sm transition-all duration-300 hover:-translate-y-0.5 ${action.border} hover:shadow-md`}
            onClick={(suggestion) => {
              // Enable Deep Search for these complex queries
              onEnableDeepSearch?.();
              
              window.history.replaceState({}, "", `/chat/${chatId}`);
              sendMessage({
                role: "user",
                parts: [{ type: "text", text: action.description }],
              }, {
                // Force enable Valyu Search for this specific request
                body: { enableValyuSearch: true }
              });
            }}
            suggestion={action.description}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-lg">{action.icon}</span>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-foreground/90 text-xs">
                  {action.title}
                </span>
                <span className="text-muted-foreground text-xs leading-relaxed">
                  {action.description}
                </span>
              </div>
            </div>
          </Suggestion>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) {
      return false;
    }
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType) {
      return false;
    }

    return true;
  }
);
