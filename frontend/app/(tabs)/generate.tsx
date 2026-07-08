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
];

const LENGTHS = [
  "One sentence",
  "Short",
  "Medium",
  "Long",
  "Paragraph",
  "Bullet points",
  "Text message",
  "Email"
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
  const [goal, setGoal] = useState("Continue conversation");
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
                  <Ionicons name="color-wand-outline" size={14} color="#111827" style={{ marginRight: 4 }} />
                  <Text style={styles.presetChipText}>{preset.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Large Rounded White Card Sitting on Soft Grey Background */}
        <View style={styles.mainCard}>
          {/* Input Box */}
          <View style={styles.inputSection}>
            <View style={styles.inputHeader}>
              <Text style={styles.cardSectionLabel}>Paste Conversation</Text>
              {convo.length > 0 && (
                <TouchableOpacity onPress={() => setConvo("")}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              placeholder="Paste chat history, DMs, or emails here..."
              placeholderTextColor="#8E8E93"
              value={convo}
              onChangeText={(text) => {
                setConvo(text);
                setError(null);
              }}
            />
          </View>

          <View style={styles.divider} />

          {/* Goal Selector */}
          <View style={styles.inputSection}>
            <Text style={styles.cardSectionLabel}>Choose Response Goal</Text>
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

          <View style={styles.divider} />

          {/* Length Selector */}
          <View style={styles.inputSection}>
            <Text style={styles.cardSectionLabel}>Choose Format & Length</Text>
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

          {/* Generate Button inside the card matching Clique Join Call style */}
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
                <Ionicons name="sparkles" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.generateButtonText}>Generate Styled Replies</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

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
                        color={savedStatus[index] ? "#FFCC00" : "#8E8E93"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => copyToClipboard(opt.text, index)}
                      style={styles.actionBtn}
                    >
                      <Ionicons name="copy-outline" size={18} color="#8E8E93" />
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
    backgroundColor: "#F4F4F5",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  presetSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#8E8E93",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  presetsRow: {
    flexDirection: "row",
  },
  presetChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EBEBEB",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  presetChipText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "800",
  },
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  inputSection: {
    marginBottom: 16,
  },
  cardSectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#8E8E93",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  clearText: {
    color: "#FF3B30",
    fontSize: 12,
    fontWeight: "800",
  },
  textArea: {
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#EBEBEB",
    borderRadius: 18,
    padding: 14,
    color: "#111827",
    fontSize: 14,
    height: 100,
    textAlignVertical: "top",
  },
  divider: {
    height: 1,
    backgroundColor: "#EBEBEB",
    marginVertical: 14,
  },
  goalRow: {
    flexDirection: "row",
  },
  goalChip: {
    backgroundColor: "#F4F4F5",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#EBEBEB",
  },
  activeGoalChip: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  goalChipText: {
    color: "#8E8E93",
    fontSize: 13,
    fontWeight: "700",
  },
  activeGoalChipText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
  },
  generateButton: {
    backgroundColor: "#8E8E93",
    borderRadius: 20,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  disabledButton: {
    backgroundColor: "#D1D1D6",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  resultsSection: {
    marginTop: 4,
  },
  resultsTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 12,
    marginLeft: 4,
  },
  replyCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EBEBEB",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  replyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
    paddingBottom: 8,
    marginBottom: 12,
  },
  replyStyleLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
    backgroundColor: "#F4F4F5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  actionRow: {
    flexDirection: "row",
  },
  actionBtn: {
    padding: 4,
    marginLeft: 8,
  },
  replyContent: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 22,
  },
});
