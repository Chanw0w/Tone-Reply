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
  Clipboard,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/utils/api";

interface Rewrites {
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

const STYLE_LABELS: Record<keyof Rewrites, { label: string; icon: string; color: string }> = {
  confident: { label: "😎 More Confident", icon: "checkmark-circle", color: "#10B981" },
  romantic: { label: "❤️ More Romantic", icon: "heart", color: "#EC4899" },
  flirty: { label: "✨ More Flirty", icon: "sparkles", color: "#8B5CF6" },
  less_needy: { label: "🎯 Less Needy", icon: "shield-checkmark", color: "#3B82F6" },
  respectful: { label: "🤝 More Respectful", icon: "people", color: "#14B8A6" },
  mysterious: { label: "🕵️ More Mysterious", icon: "eye-off", color: "#4B5563" },
  masculine: { label: "💪 More Masculine", icon: "fitness", color: "#EF4444" },
  feminine: { label: "🌸 More Feminine", icon: "flower", color: "#F43F5E" },
  professional: { label: "💼 More Professional", icon: "briefcase", color: "#D97706" },
};

export default function RewriteScreen() {
  const [draft, setDraft] = useState("");
  const [rewrites, setRewrites] = useState<Rewrites | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRewrite = async () => {
    if (!draft.trim()) {
      setError("Please paste a draft to rewrite first");
      return;
    }
    setError(null);
    setLoading(true);
    setRewrites(null);
    try {
      const response = await api.post("/chat/rewrite", { text: draft });
      if (response) {
        setRewrites(response);
      } else {
        setError("Invalid response received from server");
      }
    } catch (e: any) {
      setError(e.message || "Failed to rewrite. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert("Copied!", "Rewritten reply copied to clipboard.");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        {/* Paste Box */}
        <View style={styles.inputCard}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputTitle}>Your Message Draft</Text>
            {draft.length > 0 && (
              <TouchableOpacity onPress={() => setDraft("")}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Type or paste a draft here to elevate its tone..."
            placeholderTextColor="#9CA3AF"
            value={draft}
            onChangeText={(text) => {
              setDraft(text);
              setError(null);
            }}
          />
        </View>

        {/* Action Button */}
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          style={[styles.rewriteButton, loading && styles.disabledButton]}
          onPress={handleRewrite}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.buttonInner}>
              <Ionicons name="refresh-circle" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.rewriteButtonText}>Rewrite Message into 9 Styles</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Output Options */}
        {rewrites && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Choose Your Rewritten Message</Text>
            {(Object.keys(STYLE_LABELS) as Array<keyof Rewrites>).map((key) => {
              const textVal = rewrites[key];
              if (!textVal) return null;
              const meta = STYLE_LABELS[key];

              return (
                <View key={key} style={styles.rewriteCard}>
                  <View style={styles.rewriteCardHeader}>
                    <View style={styles.styleLabelContainer}>
                      <Ionicons name={meta.icon as any} size={16} color={meta.color} style={{ marginRight: 6 }} />
                      <Text style={[styles.rewriteStyleLabel, { color: meta.color }]}>{meta.label}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => copyToClipboard(textVal)}
                      style={styles.copyBtn}
                    >
                      <Ionicons name="copy-outline" size={18} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.rewriteContent}>{textVal}</Text>
                </View>
              );
            })}
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
    height: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  rewriteButton: {
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
  rewriteButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  resultsSection: {
    marginTop: 8,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },
  rewriteCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  rewriteCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 10,
    marginBottom: 12,
  },
  styleLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rewriteStyleLabel: {
    fontSize: 14,
    fontWeight: "800",
  },
  copyBtn: {
    padding: 4,
  },
  rewriteContent: {
    fontSize: 15,
    color: "#1F2937",
    lineHeight: 22,
  },
});
