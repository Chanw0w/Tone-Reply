import React, { useState } from "react";
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

        {/* Input Card */}
        <View style={styles.inputCard}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputTitle}>Paste Your Conversation</Text>
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
            placeholderTextColor="#9CA3AF"
            value={convo}
            onChangeText={(text) => {
              setConvo(text);
              setError(null);
            }}
          />
        </View>

        {/* Action Button */}
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          style={[styles.analyzeButton, loading && styles.disabledButton]}
          onPress={handleAnalyze}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.buttonInner}>
              <Ionicons name="analytics" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.analyzeButtonText}>Analyze Conversation & Coach Tips</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Analysis Output */}
        {analysis && (
          <View style={styles.analysisSection}>
            <Text style={styles.sectionHeading}>Coaching & Conversation Insights</Text>

            {/* Coaching Tips Dashboard */}
            {analysis.coaching_tips && analysis.coaching_tips.length > 0 && (
              <View style={styles.coachingCard}>
                <View style={styles.coachingHeader}>
                  <Ionicons name="school" size={20} color="#8B5CF6" style={{ marginRight: 8 }} />
                  <Text style={styles.coachingTitle}>Communication Coaching Tips</Text>
                </View>
                {analysis.coaching_tips.map((tip, index) => (
                  <View key={index} style={styles.tipRow}>
                    <Ionicons name="sparkles" size={16} color="#8B5CF6" style={styles.tipIcon} />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Conversation Balance Widget */}
            <View style={styles.infoCard}>
              <View style={styles.infoTitleRow}>
                <Ionicons name="git-compare" size={18} color="#10B981" />
                <Text style={styles.infoTitle}>Conversation Balance</Text>
              </View>
              <Text style={styles.infoContent}>{analysis.conversation_balance}</Text>
            </View>

            {/* What Happened Summary */}
            <View style={styles.infoCard}>
              <View style={styles.infoTitleRow}>
                <Ionicons name="document-text-outline" size={18} color="#3B82F6" />
                <Text style={styles.infoTitle}>What Happened (Summary)</Text>
              </View>
              <Text style={styles.infoContent}>{analysis.summary}</Text>
            </View>

            {/* Emotional Tone */}
            <View style={styles.infoCard}>
              <View style={styles.infoTitleRow}>
                <Ionicons name="happy-outline" size={18} color="#EC4899" />
                <Text style={styles.infoTitle}>Emotional Tone</Text>
              </View>
              <Text style={styles.infoContent}>{analysis.emotional_tone}</Text>
            </View>

            {/* Misunderstanding Risks */}
            <View style={styles.infoCard}>
              <View style={styles.infoTitleRow}>
                <Ionicons name="warning-outline" size={18} color="#EF4444" />
                <Text style={styles.infoTitle}>Possible Misunderstandings</Text>
              </View>
              <Text style={styles.infoContent}>{analysis.misunderstandings}</Text>
            </View>

            {/* Unanswered Questions */}
            <View style={styles.infoCard}>
              <View style={styles.infoTitleRow}>
                <Ionicons name="help-circle-outline" size={18} color="#D97706" />
                <Text style={styles.infoTitle}>Question Status</Text>
              </View>
              <Text style={styles.infoContent}>{analysis.answered_questions}</Text>
            </View>

            {/* Ambiguities */}
            <View style={styles.infoCard}>
              <View style={styles.infoTitleRow}>
                <Ionicons name="help-buoy-outline" size={18} color="#14B8A6" />
                <Text style={styles.infoTitle}>Potential Ambiguity</Text>
              </View>
              <Text style={styles.infoContent}>{analysis.potential_ambiguity}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  introText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 16,
  },
  inputCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  inputTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  clearText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "700",
  },
  textArea: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    color: "#111827",
    fontSize: 14,
    height: 120,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  analyzeButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 14,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  analyzeButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  analysisSection: {
    marginTop: 8,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },
  coachingCard: {
    backgroundColor: "rgba(139, 92, 246, 0.03)",
    borderColor: "rgba(139, 92, 246, 0.15)",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  coachingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(139, 92, 246, 0.08)",
    paddingBottom: 8,
  },
  coachingTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
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
    color: "#374151",
    flex: 1,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  infoTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6B7280",
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoContent: {
    fontSize: 15,
    color: "#1F2937",
    lineHeight: 22,
  },
});
