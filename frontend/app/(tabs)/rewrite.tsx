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
  Alert,
  Animated,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/utils/api";
import { useTheme } from "../../src/utils/theme-context";
import { RainbowStripe } from "../../src/components/RainbowStripe";
import { typography, borderRadius } from "../../src/constants/theme";

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

export default function RewriteScreen() {
  const { theme } = useTheme();
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
      const response = await api.post<Rewrites>("/chat/rewrite", { text: draft });
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

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied!", "Rewritten reply copied to clipboard.");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        {/* Main interactive container card */}
        <View style={[styles.mainCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.inputHeader}>
            <Text style={[styles.cardSectionLabel, { color: theme.textSecondary }]}>Original Message Draft</Text>
            {draft.length > 0 && (
              <TouchableOpacity onPress={() => setDraft("")}>
                <Text style={[styles.clearText, { color: theme.error }]}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            style={[styles.textArea, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.textPrimary }]}
            multiline
            numberOfLines={4}
            placeholder="Type or paste a draft here..."
            placeholderTextColor={theme.inputPlaceholder}
            value={draft}
            onChangeText={(text) => {
              setDraft(text);
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
            onPress={handleRewrite}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.buttonPrimaryText} />
            ) : (
              <View style={styles.buttonInner}>
                <Ionicons name="refresh-circle" size={20} color={theme.buttonPrimaryText} style={{ marginRight: 6 }} />
                <Text style={[styles.primaryButtonText, { color: theme.buttonPrimaryText }]}>Rewrite Message into 9 Styles</Text>
              </View>
            )}
          </TactileButton>
        </View>

        {/* Output Options with Staggered Fade Up reveal */}
        {rewrites && (
          <View style={styles.resultsSection}>
            <Text style={[styles.resultsTitle, { color: theme.textPrimary }]}>Choose Your Rewritten Message</Text>
            {(Object.keys(STYLE_LABELS) as Array<keyof Rewrites>).map((key, index) => {
              const textVal = rewrites[key];
              if (!textVal) return null;
              const meta = STYLE_LABELS[key];

              return (
                <StaggeredCard key={key} index={index}>
                  <View style={[styles.rewriteCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    {/* Rainbow top border */}
                    <RainbowStripe height={3} style={styles.replyRainbow} />

                    <View style={[styles.rewriteCardHeader, { borderBottomColor: theme.divider }]}>
                      <View style={styles.styleLabelContainer}>
                        <Ionicons name={meta.icon as any} size={16} color={meta.color} style={{ marginRight: 6 }} />
                        <Text style={[styles.rewriteStyleLabel, { color: meta.color }]}>{meta.label}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => copyToClipboard(textVal)}
                        style={styles.copyBtn}
                      >
                        <Ionicons name="copy-outline" size={18} color={theme.textMuted} />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.rewriteContent, { color: theme.textPrimary }]}>{textVal}</Text>
                  </View>
                </StaggeredCard>
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
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  mainCard: {
    borderRadius: 24,
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
    fontFamily: typography.fontFamily.serifBold,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  clearText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.serifBold,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 16,
    fontFamily: typography.fontFamily.sansRegular,
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
    borderRadius: 14,
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
    fontFamily: typography.fontFamily.serifBold,
  },
  resultsSection: {
    marginTop: 4,
  },
  resultsTitle: {
    fontSize: 15,
    fontFamily: typography.fontFamily.serifBold,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 12,
    marginLeft: 4,
  },
  rewriteCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  replyRainbow: {
    marginBottom: 12,
  },
  rewriteCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 12,
  },
  styleLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rewriteStyleLabel: {
    fontSize: 13,
    fontFamily: typography.fontFamily.serifBold,
  },
  copyBtn: {
    padding: 4,
  },
  rewriteContent: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: typography.fontFamily.sansRegular,
  },
});
