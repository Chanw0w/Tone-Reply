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
      const response = await api.post("/chat/analyze", { conversation_text: convo });
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
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        {/* Intro */}
        <Text style={styles.introText}>
          Understand conversational dynamics. We present observations and possibilities as analytical insights rather than definitive mind-reading conclusions.
        </Text>

        {/* Main card matching Clique design */}
        <View style={styles.mainCard}>
          <View style={styles.inputHeader}>
            <Text style={styles.cardSectionLabel}>Paste Your Conversation</Text>
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
            placeholder="Paste SMS, WhatsApp logs, DMs, or emails..."
            placeholderTextColor="#8E8E93"
            value={convo}
            onChangeText={(text) => {
              setConvo(text);
              setError(null);
            }}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <TactileButton
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={handleAnalyze}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.buttonInner}>
                <Ionicons name="analytics-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.primaryButtonText}>Analyze Conversation & Coach</Text>
              </View>
            )}
          </TactileButton>
        </View>

        {/* Analysis Output with staggered card entry reveals */}
        {analysis && (
          <View style={styles.analysisSection}>
            <Text style={styles.resultsTitle}>Coaching & Conversation Insights</Text>

            {/* Coaching Tips Dashboard */}
            {analysis.coaching_tips && analysis.coaching_tips.length > 0 && (
              <StaggeredCard index={0}>
                <View style={styles.coachingCard}>
                  <View style={styles.coachingHeader}>
                    <Ionicons name="school" size={20} color="#111827" style={{ marginRight: 8 }} />
                    <Text style={styles.coachingTitle}>Communication Coaching Tips</Text>
                  </View>
                  {analysis.coaching_tips.map((tip, index) => (
                    <View key={index} style={styles.tipRow}>
                      <Ionicons name="sparkles" size={16} color="#8E8E93" style={styles.tipIcon} />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              </StaggeredCard>
            )}

            {/* Conversation Balance Widget */}
            <StaggeredCard index={1}>
              <View style={styles.infoCard}>
                <View style={styles.infoTitleRow}>
                  <Ionicons name="git-compare-outline" size={18} color="#000000" />
                  <Text style={styles.infoTitle}>Conversation Balance</Text>
                </View>
                <Text style={styles.infoContent}>{analysis.conversation_balance}</Text>
              </View>
            </StaggeredCard>

            {/* What Happened Summary */}
            <StaggeredCard index={2}>
              <View style={styles.infoCard}>
                <View style={styles.infoTitleRow}>
                  <Ionicons name="document-text-outline" size={18} color="#000000" />
                  <Text style={styles.infoTitle}>What Happened (Summary)</Text>
                </View>
                <Text style={styles.infoContent}>{analysis.summary}</Text>
              </View>
            </StaggeredCard>

            {/* Emotional Tone */}
            <StaggeredCard index={3}>
              <View style={styles.infoCard}>
                <View style={styles.infoTitleRow}>
                  <Ionicons name="happy-outline" size={18} color="#000000" />
                  <Text style={styles.infoTitle}>Emotional Tone</Text>
                </View>
                <Text style={styles.infoContent}>{analysis.emotional_tone}</Text>
              </View>
            </StaggeredCard>

            {/* Misunderstanding Risks */}
            <StaggeredCard index={4}>
              <View style={styles.infoCard}>
                <View style={styles.infoTitleRow}>
                  <Ionicons name="warning-outline" size={18} color="#000000" />
                  <Text style={styles.infoTitle}>Possible Misunderstandings</Text>
                </View>
                <Text style={styles.infoContent}>{analysis.misunderstandings}</Text>
              </View>
            </StaggeredCard>

            {/* Unanswered Questions */}
            <StaggeredCard index={5}>
              <View style={styles.infoCard}>
                <View style={styles.infoTitleRow}>
                  <Ionicons name="help-circle-outline" size={18} color="#000000" />
                  <Text style={styles.infoTitle}>Question Status</Text>
                </View>
                <Text style={styles.infoContent}>{analysis.answered_questions}</Text>
              </View>
            </StaggeredCard>

            {/* Ambiguities */}
            <StaggeredCard index={6}>
              <View style={styles.infoCard}>
                <View style={styles.infoTitleRow}>
                  <Ionicons name="help-buoy-outline" size={18} color="#000000" />
                  <Text style={styles.infoTitle}>Potential Ambiguity</Text>
                </View>
                <Text style={styles.infoContent}>{analysis.potential_ambiguity}</Text>
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
    backgroundColor: "#F4F4F5",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  introText: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 4,
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
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardSectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#8E8E93",
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
    height: 120,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#8E8E93",
    borderRadius: 18,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    width: "100%",
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
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  analysisSection: {
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
  coachingCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EBEBEB",
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
    borderBottomColor: "#F4F4F5",
    paddingBottom: 8,
  },
  coachingTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
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
    color: "#111827",
    flex: 1,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EBEBEB",
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
    color: "#8E8E93",
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  infoContent: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 22,
  },
});
