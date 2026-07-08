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
        {/* Main interactive container card matching Clique layout */}
        <View style={styles.mainCard}>
          <View style={styles.inputHeader}>
            <Text style={styles.cardSectionLabel}>Original Message Draft</Text>
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
            placeholder="Type or paste a draft here..."
            placeholderTextColor="#8E8E93"
            value={draft}
            onChangeText={(text) => {
              setDraft(text);
              setError(null);
            }}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={handleRewrite}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.buttonInner}>
                <Ionicons name="refresh-circle" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.primaryButtonText}>Rewrite Message into 9 Styles</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

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
                      <Ionicons name="copy-outline" size={18} color="#8E8E93" />
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
    backgroundColor: "#F4F4F5",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
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
    height: 100,
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
  rewriteCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EBEBEB",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  rewriteCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
    paddingBottom: 8,
    marginBottom: 12,
  },
  styleLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rewriteStyleLabel: {
    fontSize: 13,
    fontWeight: "800",
  },
  copyBtn: {
    padding: 4,
  },
  rewriteContent: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 22,
  },
});
