import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { useAuth } from "../../src/utils/auth-context";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer} bounces={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#6366F1" />
        </View>
        <Text style={styles.emailText}>{user?.email || "user@example.com"}</Text>
        <View style={styles.badge}>
          <Ionicons name="sparkles" size={14} color="#F59E0B" style={{ marginRight: 4 }} />
          <Text style={styles.badgeText}>Premium Unlocked</Text>
        </View>
      </View>

      {/* Features Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Premium Features</Text>

        <View style={styles.featureItem}>
          <View style={[styles.iconWrapper, { backgroundColor: "rgba(16, 185, 129, 0.1)" }]}>
            <Ionicons name="infinite" size={20} color="#10B981" />
          </View>
          <View style={styles.featureTextWrapper}>
            <Text style={styles.featureTitle}>Unlimited Tone Rewrites</Text>
            <Text style={styles.featureDesc}>No daily limit on reply generation or style conversions.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.iconWrapper, { backgroundColor: "rgba(139, 92, 246, 0.1)" }]}>
            <Ionicons name="options-outline" size={20} color="#8B5CF6" />
          </View>
          <View style={styles.featureTextWrapper}>
            <Text style={styles.featureTitle}>Custom Style Presets</Text>
            <Text style={styles.featureDesc}>Save presets for dating, professional emails, family, or friends.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.iconWrapper, { backgroundColor: "rgba(59, 130, 246, 0.1)" }]}>
            <Ionicons name="mic-outline" size={20} color="#3B82F6" />
          </View>
          <View style={styles.featureTextWrapper}>
            <Text style={styles.featureTitle}>Voice Recognition (Coming Soon)</Text>
            <Text style={styles.featureDesc}>Draft replies using speech-to-text directly in the app.</Text>
          </View>
        </View>
      </View>

      {/* Help / Resources */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>AI Provider</Text>
          <Text style={styles.infoValue}>Gemini 3.1 Pro (Recommended)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Database Mode</Text>
          <Text style={styles.infoValue}>MongoDB Cloud Persistent</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App Version</Text>
          <Text style={styles.infoValue}>2.0.26 (Expo New Arch Ready)</Text>
        </View>
      </View>

      {/* Log Out Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.logoutButtonText}>Sign Out Account</Text>
      </TouchableOpacity>
    </ScrollView>
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
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 20,
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  emailText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: "#F59E0B",
    fontSize: 12,
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#9CA3AF",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: "#9CA3AF",
    lineHeight: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  infoLabel: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  infoValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#EF4444",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
});
