import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../src/utils/auth-context";
import { useTheme } from "../src/utils/theme-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RainbowStripe } from "../src/components/RainbowStripe";
import { StaticSparkle } from "../src/components/SparkleDecoration";
import { typography, borderRadius } from "../src/constants/theme";

export default function LoginScreen() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (e: any) {
      setError(e.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
          {/* Top sparkle decorations */}
          <View style={[styles.sparkleRow, { top: insets.top + 20 }]}>
            <StaticSparkle size={10} color={theme.accent.gold} />
            <StaticSparkle size={8} color="#E87898" />
          </View>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <StaticSparkle size={16} color={theme.accent.gold} />
            <Text style={[styles.logoText, { color: theme.textPrimary }]}>
              Tone Reply
            </Text>
          </View>

          {/* Form card */}
          <View style={[styles.formCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <RainbowStripe height={8} style={styles.formRainbow} />

            <Text style={[styles.formTitle, { color: theme.textPrimary }]}>Welcome Back</Text>
            <Text style={[styles.formSubtitle, { color: theme.textSecondary }]}>
              Sign in to your communication assistant
            </Text>

            {error && (
              <View style={[styles.errorContainer, { backgroundColor: theme.errorBackground, borderColor: theme.errorBorder }]}>
                <Ionicons name="alert-circle" size={18} color={theme.error} style={{ marginRight: 6 }} />
                <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.textPrimary }]}
                placeholder="name@example.com"
                placeholderTextColor={theme.inputPlaceholder}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Password</Text>
              <View style={[styles.passwordWrapper, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}>
                <TextInput
                  style={[styles.passwordInput, { color: theme.textPrimary }]}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.inputPlaceholder}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError(null);
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={theme.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.buttonPrimary }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.buttonPrimaryText} />
              ) : (
                <Text style={[styles.primaryButtonText, { color: theme.buttonPrimaryText }]}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.textSecondary }]}>Don't have an account? </Text>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text style={[styles.linkText, { color: theme.primary }]}>Create Account</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  sparkleRow: {
    position: "absolute",
    right: 40,
    flexDirection: "row",
    gap: 8,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  logoText: {
    fontSize: 28,
    fontFamily: typography.fontFamily.serifBlack,
    letterSpacing: -0.5,
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    backgroundColor: "#FDF6EC",
    shadowColor: "#8B6F5E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  formRainbow: {
    width: "100%",
  },
  formTitle: {
    fontSize: 22,
    fontFamily: typography.fontFamily.serifBlack,
    textAlign: "center",
    marginTop: 24,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 24,
    fontFamily: typography.fontFamily.sansRegular,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
    marginBottom: 20,
    marginHorizontal: 24,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  inputContainer: {
    marginBottom: 18,
    marginHorizontal: 24,
  },
  label: {
    fontSize: 11,
    fontFamily: typography.fontFamily.serifBold,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: typography.fontFamily.sansRegular,
    backgroundColor: "#FFFFFF",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  passwordInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: typography.fontFamily.sansRegular,
  },
  eyeIcon: {
    padding: 12,
  },
  primaryButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginHorizontal: 24,
    backgroundColor: "#3D6B4F",
  },
  primaryButtonText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.serifBlack,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.sansRegular,
  },
  linkText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.serifBlack,
  },
});
