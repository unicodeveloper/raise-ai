export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model",
    name: "Claude 4.5 Opus",
    description: "Most intelligent model for highly complex tasks",
  },
  {
    id: "chat-model-gemini",
    name: "Gemini 3 Pro Preview",
    description: "Next-generation multimodal capabilities",
  },
  {
    id: "chat-model-grok",
    name: "Grok 4.1 Fast Reasoning",
    description: "xAI's fastest reasoning model",
  },
  {
    id: "chat-model-sonnet",
    name: "Claude 4.5 Sonnet",
    description: "Balanced intelligence and speed",
  },
];
