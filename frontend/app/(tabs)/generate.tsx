import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Clipboard,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/utils/api";

const GOALS = [
  "Continue the conversation",
  "Reply politely",
  "End the conversation",
  "Set a boundary",
  "Ask for clarification",
  "Be playful",
  "Sound confident",
  "Apologize",
  "Reconnect",
  "Say no",
  "Flirt",
  "Break up respectfully",
  "Ask someone out",
  "Negotiate",
  "Calm an argument",
  "Be professional",
  "Follow up",
  "Leave them on good terms"
];

const LENGTHS = [
  "One sentence",
  "Short",
  "Medium",
  "Long",
  "Paragraph",
  "Bullet points",
  "Text message",
  "Email",
  "Voice note script"
];

interface ReplyOption {
  style: string;
  text: string;
}

interface Preset {
  id: string;
  name: string;
  goal: string;
  style: string;
  length: string;
}

export default function GenerateScreen() {
  const [convo, setConvo] = useState("");
  const [goal, setGoal] = useState("Continue the conversation");
  const [length, setLength] = useState("Medium");
  const [options, setOptions] = useState<ReplyOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [savedStatus, setSavedStatus] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    try {
      const data = await api.get("/chat/presets");
      setPresets(data || []);
    } catch (e) {
      console.log("Failed to load presets:", e);
    }
  };

  const applyPreset = (preset: Preset) => {
    setGoal(preset.goal);
    setLength(preset.length);
    Alert.alert("Preset Applied", `Loaded configuration for "${preset.name}"`);
  };

  const handleGenerate = async () => {
    if (!convo.trim()) {
      setError("Please paste a conversation first");
      return;
    }
    setError(null);
    setLoading(true);
    setOptions([]);
    setSavedStatus({});
    try {
      const response = await api.post("/chat/generate", {
        conversation_text: convo,
        goal: goal,
        length: length,
      });
      if (response && response.options) {
        setOptions(response.options);
      } else {
        setError("Invalid response received from LLM");
      }
    } catch (e: any) {
      setError(e.message || "Failed to generate replies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    Clipboard.setString(text);
    Alert.alert("Copied!", "Reply copied to clipboard.");
  };

  const saveToFavorites = async (opt: ReplyOption, index: number) => {
    try {
      await api.post("/chat/favorites", {
        original_conversation: convo,
        reply_text: opt.text,
        style_label: opt.style,
      });
      setSavedStatus((prev) => ({ ...prev, [index]: true }));
      Alert.alert("Saved!", "Successfully added to saved replies.");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to save reply.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        {/* Quick Presets Slider */}
        {presets.length > 0 && (
          <View style={styles.presetSection}>
            <Text style={styles.sectionTitle}>Apply Custom Style Presets</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsRow}>
              {presets.map((preset) => (
                <TouchableOpacity
                  key={preset.id}
                  style={styles.presetChip}
                  onPress={() => applyPreset(preset)}
                >
                  <Ionicons name="options-outline" size={14} color="#6366F1" style={{ marginRight: 4 }} />
                  <Text style={styles.presetChipText}>{preset.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input Box */}
        <View style={styles.inputCard}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputTitle}>Paste Conversation</Text>
            {convo.length > 0 && (
              <TouchableOpacity onPress={() => setConvo("")}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={5}
            placeholder="Paste text messages, WhatsApp chat history, Bumble conversations, emails here..."
            placeholderTextColor="#6B7280"
            value={convo}
            onChangeText={(text) => {
              setConvo(text);
              setError(null);
            }}
          />
        </View>

        {/* Goal Selector */}
        <View style={styles.inputCard}>
          <Text style={styles.inputTitle}>Choose Response Goal</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.goalRow}>
            {GOALS.map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.goalChip, goal === g && styles.activeGoalChip]}
                onPress={() => setGoal(g)}
              >
                <Text style={[styles.goalChipText, goal === g && styles.activeGoalChipText]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Length Selector */}
        <View style={styles.inputCard}>
          <Text style={styles.inputTitle}>Choose Output Format & Length</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.goalRow}>
            {LENGTHS.map((len) => (
              <TouchableOpacity
                key={len}
                style={[styles.goalChip, length === len && styles.activeGoalChip]}
                onPress={() => setLength(len)}
              >
                <Text style={[styles.goalChipText, length === len && styles.activeGoalChipText]}>{len}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Generate Button */}
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          style={[styles.generateButton, loading && styles.disabledButton]}
          onPress={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.buttonInner}>
              <Ionicons name="sparkles" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.generateButtonText}>Generate Side-by-Side Replies</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Output Options */}
        {options.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Side-by-Side Styled Replies</Text>
            {options.map((opt, index) => (
              <View key={index} style={styles.replyCard}>
                <View style={styles.replyCardHeader}>
                  <Text style={styles.replyStyleLabel}>{opt.style}</Text>
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      onPress={() => saveToFavorites(opt, index)}
                      style={styles.actionBtn}
                    >
                      <Ionicons
                        name={savedStatus[index] ? "star" : "star-outline"}
                        size={18}
                        color={savedStatus[index] ? "#F59E0B" : "#9CA3AF"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => copyToClipboard(opt.text, index)}
                      style={styles.actionBtn}
                    >
                      <Ionicons name="copy-outline" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.replyContent}>{opt.text}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F19",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  presetSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#9CA3AF",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  presetsRow: {
    flexDirection: "row",
  },
  presetChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  presetChipText: {
    color: "#6366F1",
    fontSize: 13,
    fontWeight: "600",
  },
  inputCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  inputTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  clearText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "600",
  },
  textArea: {
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 14,
    height: 120,
    textAlignVertical: "top",
  },
  goalRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  goalChip: {
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  activeGoalChip: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  goalChipText: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "500",
  },
  activeGoalChipText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  errorText: {
    color: "#F87171",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  generateButton: {
    backgroundColor: "#6366F1",
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#4B5563",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultsSection: {
    marginTop: 8,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  replyCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  replyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
    paddingBottom: 10,
    marginBottom: 12,
  },
  replyStyleLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6366F1",
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  actionRow: {
    flexDirection: "row",
  },
  actionBtn: {
    padding: 6,
    marginLeft: 8,
  },
  replyContent: {
    fontSize: 15,
    color: "#E5E7EB",
    lineHeight: 22,
  },
});
