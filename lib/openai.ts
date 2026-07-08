import OpenAI from "openai";
import { env } from "@/lib/env";

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: env.openaiApiKey,
    });
  }

  return client;
}
