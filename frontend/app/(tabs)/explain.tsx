import React, { useState, useRef, useEffect } from "react";
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
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/utils/api";
import { useTheme } from "../../src/utils/theme-context";
import { RainbowStripe } from "../../src/components/RainbowStripe";

interface AnalyzeResponse {
  analysis: AnalysisResult;
}

interface AnalysisResult {
  summary: string;
  emotional_tone: string;
  misunderstandings: string;
  answered_questions: string;
  conversation_balance: string;
  potential_ambiguity: string;
  coaching_tips: string[];
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
      Animated.delay(index * 100),
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

export default function ExplainScreen() {
  const { theme } = useTheme();
  const [convo, setConvo] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!convo.trim()) {
      setError("Please paste a conversation first");
      return;
    }
    setError(null);
    setLoading(true);
    setAnalysis(null);
    try {
      const response = await api.post<AnalyzeResponse>("/chat/analyze", { conversation_text: convo });
      if (response && response.analysis) {
        setAnalysis(response.analysis);
      } else {
        setError("Invalid response received from server");
      }
    } catch (e: any) {
      setError(e.message || "Failed to analyze conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        {/* Intro */}
        <Text style={[styles.introText, { color: theme.textSecondary }]}>
          Understand conversational dynamics. We present observations and possibilities as analytical insights rather than definitive mind-reading conclusions.
        </Text>

        {/* Main card */}
        <View style={[styles.mainCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.inputHeader}>
            <Text style={[styles.cardSectionLabel, { color: theme.textSecondary }]}>Paste Your Conversation</Text>
            {convo.length > 0 && (
              <TouchableOpacity onPress={() => setConvo("")}>
                <Text style={[styles.clearText, { color: theme.error }]}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.textPrimary }]}
            multiline
            numberOfLines={5}
            placeholder="Paste SMS, WhatsApp logs, DMs, or emails..."
            placeholderTextColor={theme.inputPlaceholder}
            value={convo}
            onChangeText={(text) => {
              setConvo(text);
              setError(null);
            }}
          />

          {/* Rainbow accent */}
          <RainbowStripe height={3} style={styles.rainbowAccent} />

          {error && <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>}

          <TactileButton
            style={[
              styles.primaryButton,
              { backgroundColor: theme.buttonPrimary },
              loading && [styles.disabledButton, { backgroundColor: theme.buttonDisabled }]
            ]}
            onPress={handleAnalyze}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.buttonPrimaryText} />
            ) : (
              <View style={styles.buttonInner}>
                <Ionicons name="analytics-outline" size={18} color={theme.buttonPrimaryText} style={{ marginRight: 6 }} />
                <Text style={[styles.primaryButtonText, { color: theme.buttonPrimaryText }]}>Analyze Conversation & Coach</Text>
              </View>
            )}
          </TactileButton>
        </View>

        {/* Analysis Output with staggered card entry reveals */}
        {analysis && (
          <View style={styles.analysisSection}>
            <Text style={[styles.resultsTitle, { color: theme.textPrimary }]}>Coaching & Conversation Insights</Text>

            {/* Coaching Tips Dashboard */}
            {analysis.coaching_tips && analysis.coaching_tips.length > 0 && (
              <StaggeredCard index={0}>
                <View style={[styles.coachingCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={[styles.coachingHeader, { borderBottomColor: theme.divider }]}>
                    <Ionicons name="school" size={20} color={theme.primary} style={{ marginRight: 8 }} />
                    <Text style={[styles.coachingTitle, { color: theme.textPrimary }]}>Communication Coaching Tips</Text>
                  </View>
                  {analysis.coaching_tips.map((tip, index) => (
                    <View key={index} style={styles.tipRow}>
                      <Ionicons name="sparkles" size={16} color={theme.accent.gold} style={styles.tipIcon} />
                      <Text style={[styles.tipText, { color: theme.textPrimary }]}>{tip}</Text>
                    </View>
                  ))}
                </View>
              </StaggeredCard>
            )}

            {/* Conversation Balance Widget */}
            <StaggeredCard index={1}>
              <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.infoTitleRow}>
                  <Ionicons name="git-compare-outline" size={18} color={theme.accent.teal} />
                  <Text style={[styles.infoTitle, { color: theme.textSecondary }]}>Conversation Balance</Text>
                </View>
                <Text style={[styles.infoContent, { color: theme.textPrimary }]}>{analysis.conversation_balance}</Text>
              </View>
            </StaggeredCard>

            {/* What Happened Summary */}
            <StaggeredCard index={2}>
              <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.infoTitleRow}>
                  <Ionicons name="document-text-outline" size={18} color={theme.accent.purple} />
                  <Text style={[styles.infoTitle, { color: theme.textSecondary }]}>What Happened (Summary)</Text>
                </View>
                <Text style={[styles.infoContent, { color: theme.textPrimary }]}>{analysis.summary}</Text>
              </View>
            </StaggeredCard>

            {/* Emotional Tone */}
            <StaggeredCard index={3}>
              <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.infoTitleRow}>
                  <Ionicons name="happy-outline" size={18} color={theme.accent.orange} />
                  <Text style={[styles.infoTitle, { color: theme.textSecondary }]}>Emotional Tone</Text>
                </View>
                <Text style={[styles.infoContent, { color: theme.textPrimary }]}>{analysis.emotional_tone}</Text>
              </View>
            </StaggeredCard>

            {/* Misunderstanding Risks */}
            <StaggeredCard index={4}>
              <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.infoTitleRow}>
                  <Ionicons name="warning-outline" size={18} color={theme.warning} />
                  <Text style={[styles.infoTitle, { color: theme.textSecondary }]}>Possible Misunderstandings</Text>
                </View>
                <Text style={[styles.infoContent, { color: theme.textPrimary }]}>{analysis.misunderstandings}</Text>
              </View>
            </StaggeredCard>

            {/* Unanswered Questions */}
            <StaggeredCard index={5}>
              <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.infoTitleRow}>
                  <Ionicons name="help-circle-outline" size={18} color={theme.accent.gold} />
                  <Text style={[styles.infoTitle, { color: theme.textSecondary }]}>Question Status</Text>
                </View>
                <Text style={[styles.infoContent, { color: theme.textPrimary }]}>{analysis.answered_questions}</Text>
              </View>
            </StaggeredCard>

            {/* Ambiguities */}
            <StaggeredCard index={6}>
              <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.infoTitleRow}>
                  <Ionicons name="help-buoy-outline" size={18} color={theme.accent.pink} />
                  <Text style={[styles.infoTitle, { color: theme.textSecondary }]}>Potential Ambiguity</Text>
                </View>
                <Text style={[styles.infoContent, { color: theme.textPrimary }]}>{analysis.potential_ambiguity}</Text>
              </View>
            </StaggeredCard>
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
  introText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 4,
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
  cardSectionLabel: {
    fontSize: 11,
    fontWeight: "800",
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
    height: 120,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  rainbowAccent: {
    marginBottom: 12,
    borderRadius: 2,
  },
  errorText: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
  },
  primaryButton: {
    borderRadius: 18,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
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
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  analysisSection: {
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
  coachingCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  coachingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  coachingTitle: {
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  tipIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  infoTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: "800",
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  infoContent: {
    fontSize: 15,
    lineHeight: 22,
  },
});
