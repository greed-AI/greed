function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  get openaiApiKey(): string {
    return requireEnv("OPENAI_API_KEY");
  },

  get openaiModel(): string {
    return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  },
};
