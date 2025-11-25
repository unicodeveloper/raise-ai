import { gateway } from "@ai-sdk/gateway";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        "chat-model": gateway.languageModel("anthropic/claude-opus-4.5"),
        "chat-model-gemini": gateway.languageModel("google/gemini-3-pro-preview"),
        "chat-model-grok": gateway.languageModel("xai/grok-4.1-fast-reasoning"),
        "chat-model-sonnet": gateway.languageModel("anthropic/claude-sonnet-4.5"),
        "title-model": gateway.languageModel("anthropic/claude-sonnet-4.5"),
        "artifact-model": gateway.languageModel("anthropic/claude-sonnet-4.5"),
      },
    });
