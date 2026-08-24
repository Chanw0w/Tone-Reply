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
import { PhoneIllustration } from "../src/components/PhoneIllustration";
import { RainbowStripe } from "../src/components/RainbowStripe";
import { SparkleDecoration } from "../src/components/SparkleDecoration";
import { OrganicBackground } from "../src/components/OrganicBackground";
import { BotanicalDecoration } from "../src/components/BotanicalDecoration";

export default function RegisterScreen() {
  const { register } = useAuth();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register(email, password);
    } catch (e: any) {
      setError(e.message || "Failed to create account");
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
          {/* Organic background decoration */}
          <OrganicBackground />

          {/* Top sparkle decoration */}
          <SparkleDecoration
            count={2}
            size={10}
            color={theme.accent.gold}
            style={[styles.topSparkles, { top: insets.top + 20 }]}
          />

          {/* Phone illustration */}
          <View style={styles.illustrationContainer}>
            <PhoneIllustration size={140} showBubbles={true} />
            <SparkleDecoration
              count={2}
              size={8}
              color={theme.accent.gold}
              style={styles.phoneSparkles}
            />
          </View>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={[styles.logoText, { color: theme.textPrimary }]}>
              Tone Reply
            </Text>
          </View>

          {/* Rainbow stripe */}
          <RainbowStripe height={4} style={styles.rainbowStripe} />

          {/* Form card */}
          <View style={[styles.formCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.formTitle, { color: theme.textPrimary }]}>Create Account</Text>
            <Text style={[styles.formSubtitle, { color: theme.textSecondary }]}>
              Sign up for intelligent assistant access
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
                  placeholder="Choose password (min 6 chars)"
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

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Confirm Password</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.textPrimary }]}
                placeholder="Confirm your password"
                placeholderTextColor={theme.inputPlaceholder}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError(null);
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.buttonPrimary }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.buttonPrimaryText} />
              ) : (
                <Text style={[styles.primaryButtonText, { color: theme.buttonPrimaryText }]}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.textSecondary }]}>Already have an account? </Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text style={[styles.linkText, { color: theme.primary }]}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Bottom botanical decoration */}
          <BotanicalDecoration
            size={50}
            color={theme.botanicalSilhouette}
            variant="mixed"
            style={styles.bottomBotanical}
          />
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
  topSparkles: {
    position: "absolute",
    right: 40,
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  phoneSparkles: {
    position: "absolute",
    top: -10,
    right: -40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1,
    fontStyle: "italic",
  },
  rainbowStripe: {
    marginBottom: 24,
    borderRadius: 2,
  },
  formCard: {
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    shadowColor: "#8B6F5E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
  },
  passwordInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  eyeIcon: {
    padding: 12,
  },
  primaryButton: {
    height: 48,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#8B6F5E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 1,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
  },
  linkText: {
    fontSize: 13,
    fontWeight: "800",
  },
  bottomBotanical: {
    alignSelf: "center",
    marginTop: 24,
    opacity: 0.5,
  },
});
