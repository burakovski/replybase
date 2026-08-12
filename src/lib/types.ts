export type PlanId = "free" | "starter" | "growth";

export type User = {
  id: string;
  email: string;
  name: string;
  plan: PlanId;
  createdAt: string;
};

export type Bot = {
  id: string;
  userId: string;
  name: string;
  publicKey: string;
  systemPrompt: string;
  welcomeMessage: string;
  primaryColor: string;
  createdAt: string;
};

export type Document = {
  id: string;
  botId: string;
  title: string;
  content: string;
  createdAt: string;
};

export type Chunk = {
  id: string;
  botId: string;
  documentId: string;
  text: string;
  embedding?: number[];
};
