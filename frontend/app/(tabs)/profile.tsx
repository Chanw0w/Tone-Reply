import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useAuth } from "../../src/utils/auth-context";
import { useTheme } from "../../src/utils/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/utils/api";
import { RainbowStripe } from "../../src/components/RainbowStripe";
import { typography, borderRadius } from "../../src/constants/theme";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "This feature will be available in a future update.",
      [{ text: "OK" }]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete("/auth/me");
              await logout();
            } catch (e: any) {
              Alert.alert("Error", e.message || "Failed to delete account");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContainer}
      bounces={false}
    >
      {/* Profile Header Card */}
      <View style={[styles.profileHeaderCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.primaryMuted }]}>
            <Ionicons name="person" size={50} color={theme.primary} />
          </View>
        </View>

        <Text style={[styles.emailText, { color: theme.textPrimary }]}>{user?.email || "user@example.com"}</Text>

        <RainbowStripe height={3} style={styles.headerRainbow} />
      </View>

      {/* Theme Toggle */}
      <View style={[styles.mainCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardSectionLabel, { color: theme.textSecondary }]}>Appearance</Text>

        <TouchableOpacity style={styles.featureItem} onPress={toggleTheme}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.primaryMuted }]}>
            <Ionicons name={isDark ? "moon" : "sunny"} size={20} color={theme.primary} />
          </View>
          <View style={styles.featureTextWrapper}>
            <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>
              {isDark ? "Dark Mode" : "Light Mode"}
            </Text>
            <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
              Currently using {isDark ? "dark" : "light"} theme
            </Text>
          </View>
          <Ionicons name="toggle-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Account Actions */}
      <View style={[styles.mainCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardSectionLabel, { color: theme.textSecondary }]}>Account</Text>

        <TouchableOpacity style={styles.featureItem} onPress={handleChangePassword}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.secondaryMuted }]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.secondary} />
          </View>
          <View style={styles.featureTextWrapper}>
            <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>Change Password</Text>
            <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>Update your account password</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={16} color={theme.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureItem} onPress={logout}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.accent.orange + "20" }]}>
            <Ionicons name="log-out-outline" size={20} color={theme.accent.orange} />
          </View>
          <View style={styles.featureTextWrapper}>
            <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>Sign Out</Text>
            <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>Sign out of your account</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={16} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      {/* System Info */}
      <View style={[styles.mainCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardSectionLabel, { color: theme.textSecondary }]}>System Info</Text>
        <View style={[styles.infoRow, { borderBottomColor: theme.divider }]}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>AI Provider</Text>
          <Text style={[styles.infoValue, { color: theme.textPrimary }]}>Gemini (Configurable)</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomColor: theme.divider }]}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Database</Text>
          <Text style={[styles.infoValue, { color: theme.textPrimary }]}>MongoDB</Text>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={[styles.mainCard, { backgroundColor: theme.surface, borderColor: theme.errorBorder }]}>
        <Text style={[styles.cardSectionLabel, { color: theme.error }]}>Danger Zone</Text>
        <TouchableOpacity style={styles.dangerRow} onPress={handleDeleteAccount}>
          <View style={styles.dangerLeft}>
            <Ionicons name="trash-outline" size={20} color={theme.error} style={{ marginRight: 12 }} />
            <Text style={[styles.dangerText, { color: theme.error }]}>Delete Account</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={16} color={theme.error} />
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  profileHeaderCard: {
    alignItems: "center",
    paddingVertical: 24,
    borderWidth: 1,
    borderRadius: 24,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#8B6F5E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  emailText: {
    fontSize: 18,
    fontFamily: typography.fontFamily.serifBold,
    marginBottom: 16,
  },
  headerRainbow: {
    width: "100%",
    height: 3,
  },
  mainCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#8B6F5E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 1,
  },
  cardSectionLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.serifBold,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  featureTextWrapper: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.serifBold,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: typography.fontFamily.sansRegular,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: typography.fontFamily.sansRegular,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: typography.fontFamily.serifBold,
  },
  dangerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  dangerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  dangerText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.serifBold,
  },
});
