import React, { useState, useEffect, useRef } from "react";
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
  Alert,
  Animated,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/utils/api";
import { useTheme } from "../../src/utils/theme-context";
import { RainbowStripe } from "../../src/components/RainbowStripe";

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

interface GenerateResponse {
  options: ReplyOption[];
}

interface Preset {
  id: string;
  name: string;
  goal: string;
  style: string;
  length: string;
}

// 3D Tactile Pressable Wrapper
function TactileButton({ children, onPress, style, disabled }: any) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.94,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

// Staggered Entry Reveal Card
function StaggeredCard({ children, index }: { children: React.ReactNode; index: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 120),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, [index]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

export default function GenerateScreen() {
  const { theme } = useTheme();
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
      const data = await api.get<Preset[]>("/chat/presets");
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
      const response = await api.post<GenerateResponse>("/chat/generate", {
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

  const copyToClipboard = async (text: string, index: number) => {
    await Clipboard.setStringAsync(text);
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
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        {/* Quick Presets Slider */}
        {presets.length > 0 && (
          <View style={styles.presetSection}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Apply Custom Style Presets</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsRow}>
              {presets.map((preset) => (
                <TouchableOpacity
                  key={preset.id}
                  style={[styles.presetChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={() => applyPreset(preset)}
                >
                  <Ionicons name="color-wand-outline" size={14} color={theme.textPrimary} style={{ marginRight: 4 }} />
                  <Text style={[styles.presetChipText, { color: theme.textPrimary }]}>{preset.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Main Card */}
        <View style={[styles.mainCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Input Box */}
          <View style={styles.inputSection}>
            <View style={styles.inputHeader}>
              <Text style={[styles.cardSectionLabel, { color: theme.textSecondary }]}>Paste Conversation</Text>
              {convo.length > 0 && (
                <TouchableOpacity onPress={() => setConvo("")}>
                  <Text style={[styles.clearText, { color: theme.error }]}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={[styles.textArea, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.textPrimary }]}
              multiline
              numberOfLines={4}
              placeholder="Paste chat history, DMs, or emails here..."
              placeholderTextColor={theme.inputPlaceholder}
              value={convo}
              onChangeText={(text) => {
                setConvo(text);
                setError(null);
              }}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          {/* Goal Selector */}
          <View style={styles.inputSection}>
            <Text style={[styles.cardSectionLabel, { color: theme.textSecondary }]}>Choose Response Goal</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.goalRow}>
              {GOALS.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.goalChip,
                    { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder },
                    goal === g && [styles.activeGoalChip, { backgroundColor: theme.primary, borderColor: theme.primary }]
                  ]}
                  onPress={() => setGoal(g)}
                >
                  <Text style={[
                    styles.goalChipText,
                    { color: theme.textMuted },
                    goal === g && [styles.activeGoalChipText, { color: theme.textInverse }]
                  ]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          {/* Length Selector */}
          <View style={styles.inputSection}>
            <Text style={[styles.cardSectionLabel, { color: theme.textSecondary }]}>Choose Format & Length</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.goalRow}>
              {LENGTHS.map((len) => (
                <TouchableOpacity
                  key={len}
                  style={[
                    styles.goalChip,
                    { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder },
                    length === len && [styles.activeGoalChip, { backgroundColor: theme.primary, borderColor: theme.primary }]
                  ]}
                  onPress={() => setLength(len)}
                >
                  <Text style={[
                    styles.goalChipText,
                    { color: theme.textMuted },
                    length === len && [styles.activeGoalChipText, { color: theme.textInverse }]
                  ]}>
                    {len}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Rainbow stripe accent */}
          <RainbowStripe height={3} style={styles.rainbowAccent} />

          {/* Tactile Generate Button */}
          {error && <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>}
          <TactileButton
            style={[
              styles.generateButton,
              { backgroundColor: theme.buttonPrimary },
              loading && [styles.disabledButton, { backgroundColor: theme.buttonDisabled }]
            ]}
            onPress={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.buttonPrimaryText} />
            ) : (
              <View style={styles.buttonInner}>
                <Ionicons name="sparkles" size={16} color={theme.buttonPrimaryText} style={{ marginRight: 6 }} />
                <Text style={[styles.generateButtonText, { color: theme.buttonPrimaryText }]}>Generate Styled Replies</Text>
              </View>
            )}
          </TactileButton>
        </View>

        {/* Output Options with Sequential Reveal Stagger Animation */}
        {options.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={[styles.resultsTitle, { color: theme.textPrimary }]}>Side-by-Side Styled Replies</Text>
            {options.map((opt, index) => (
              <StaggeredCard key={index} index={index}>
                <View style={[styles.replyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  {/* Rainbow top border */}
                  <RainbowStripe height={3} style={styles.replyRainbow} />

                  <View style={[styles.replyCardHeader, { borderBottomColor: theme.divider }]}>
                    <Text style={[styles.replyStyleLabel, { color: theme.textPrimary, backgroundColor: theme.inputBackground }]}>
                      {opt.style}
                    </Text>
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        onPress={() => saveToFavorites(opt, index)}
                        style={styles.actionBtn}
                      >
                        <Ionicons
                          name={savedStatus[index] ? "star" : "star-outline"}
                          size={18}
                          color={savedStatus[index] ? theme.accent.gold : theme.textMuted}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => copyToClipboard(opt.text, index)}
                        style={styles.actionBtn}
                      >
                        <Ionicons name="copy-outline" size={18} color={theme.textMuted} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={[styles.replyContent, { color: theme.textPrimary }]}>{opt.text}</Text>
                </View>
              </StaggeredCard>
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
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  presetChipText: {
    fontSize: 13,
    fontWeight: "800",
  },
  mainCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#8B6F5E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  inputSection: {
    marginBottom: 16,
  },
  cardSectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  clearText: {
    fontSize: 12,
    fontWeight: "800",
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    fontSize: 14,
    height: 100,
    textAlignVertical: "top",
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  goalRow: {
    flexDirection: "row",
  },
  goalChip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
  },
  activeGoalChip: {
    // colors set dynamically
  },
  goalChipText: {
    fontSize: 13,
    fontWeight: "700",
  },
  activeGoalChipText: {
    fontWeight: "800",
  },
  rainbowAccent: {
    marginVertical: 12,
    borderRadius: 2,
  },
  errorText: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
  },
  generateButton: {
    borderRadius: 20,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#8B6F5E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    width: "100%",
  },
  disabledButton: {
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  generateButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  resultsSection: {
    marginTop: 4,
  },
  resultsTitle: {
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 12,
    marginLeft: 4,
  },
  replyCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  replyRainbow: {
    marginBottom: 12,
  },
  replyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 12,
  },
  replyStyleLabel: {
    fontSize: 12,
    fontWeight: "800",
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
    lineHeight: 22,
  },
});
