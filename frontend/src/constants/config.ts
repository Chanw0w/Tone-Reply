export const GOALS = [
  "Continue conversation",
  "Reply politely",
  "End conversation",
  "Set boundary",
  "Ask for clarification",
  "Be playful",
  "Sound confident",
  "Apologize",
  "Reconnect",
  "Say no",
  "Flirt",
  "Break up respectfully",
  "Ask out",
  "Negotiate",
  "Calm argument",
  "Be professional",
  "Follow up"
] as const;

export const LENGTHS = [
  "One sentence",
  "Short",
  "Medium",
  "Long",
  "Paragraph",
  "Bullet points",
  "Text message",
  "Email"
] as const;

export interface Rewrites {
  confident?: string;
  romantic?: string;
  flirty?: string;
  less_needy?: string;
  respectful?: string;
  mysterious?: string;
  masculine?: string;
  feminine?: string;
  professional?: string;
}

export const STYLE_LABELS: Record<keyof Rewrites, { label: string; icon: string; color: string }> = {
  confident: { label: "😎 More Confident", icon: "checkmark-circle", color: "#111827" },
  romantic: { label: "❤️ More Romantic", icon: "heart", color: "#FF2D55" },
  flirty: { label: "✨ More Flirty", icon: "sparkles", color: "#5856D6" },
  less_needy: { label: "🎯 Less Needy", icon: "shield-checkmark", color: "#007AFF" },
  respectful: { label: "🤝 More Respectful", icon: "people", color: "#34C759" },
  mysterious: { label: "🕵️ More Mysterious", icon: "eye-off", color: "#8E8E93" },
  masculine: { label: "💪 More Masculine", icon: "fitness", color: "#FF3B30" },
  feminine: { label: "🌸 More Feminine", icon: "flower", color: "#FF1493" },
  professional: { label: "💼 More Professional", icon: "briefcase", color: "#FF9500" },
};
