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
          Understand the dynamics of your chat. We formulate observations and possibilities as guides rather than definitive mind-reading conclusions.
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
            placeholder="Paste SMS, WhatsApp logs, Instagram DMs, Discord, or dating app chats..."
            placeholderTextColor="#6B7280"
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
              <Ionicons name="analytics" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.analyzeButtonText}>Analyze Conversation & Get Coach Tips</Text>
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
                  <Ionicons name="school" size={20} color="#6366F1" style={{ marginRight: 8 }} />
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
                <Ionicons name="help-circle-outline" size={18} color="#F59E0B" />
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
    backgroundColor: "#0B0F19",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  introText: {
    fontSize: 14,
    color: "#9CA3AF",
    lineHeight: 20,
    marginBottom: 16,
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
  errorText: {
    color: "#F87171",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  analyzeButton: {
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
  analyzeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  analysisSection: {
    marginTop: 8,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  coachingCard: {
    backgroundColor: "rgba(99, 102, 241, 0.05)",
    borderColor: "rgba(99, 102, 241, 0.2)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  coachingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(99, 102, 241, 0.1)",
    paddingBottom: 8,
  },
  coachingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
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
    color: "#E5E7EB",
    flex: 1,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#9CA3AF",
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoContent: {
    fontSize: 15,
    color: "#E5E7EB",
    lineHeight: 22,
  },
});
