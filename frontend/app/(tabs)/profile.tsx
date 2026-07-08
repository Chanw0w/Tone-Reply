import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "../../src/utils/auth-context";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer} bounces={false}>
      {/* Profile Header Card */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#8E8E93" />
        </View>
        <Text style={styles.emailText}>{user?.email || "user@example.com"}</Text>
        <View style={styles.badge}>
          <Ionicons name="sparkles" size={14} color="#FF9500" style={{ marginRight: 4 }} />
          <Text style={styles.badgeText}>Premium Unlocked</Text>
        </View>
      </View>

      {/* Features Overview */}
      <View style={styles.mainCard}>
        <Text style={styles.cardSectionLabel}>Your Premium Features</Text>

        <View style={styles.featureItem}>
          <View style={[styles.iconWrapper, { backgroundColor: "#F4F4F5" }]}>
            <Ionicons name="infinite" size={20} color="#111827" />
          </View>
          <View style={styles.featureTextWrapper}>
            <Text style={styles.featureTitle}>Unlimited Tone Rewrites</Text>
            <Text style={styles.featureDesc}>No daily limit on reply generation or style conversions.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.iconWrapper, { backgroundColor: "#F4F4F5" }]}>
            <Ionicons name="options-outline" size={20} color="#111827" />
          </View>
          <View style={styles.featureTextWrapper}>
            <Text style={styles.featureTitle}>Custom Style Presets</Text>
            <Text style={styles.featureDesc}>Save presets for dating, professional emails, or friends.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.iconWrapper, { backgroundColor: "#F4F4F5" }]}>
            <Ionicons name="mic-outline" size={20} color="#111827" />
          </View>
          <View style={styles.featureTextWrapper}>
            <Text style={styles.featureTitle}>Voice Recognition (Coming Soon)</Text>
            <Text style={styles.featureDesc}>Draft replies using speech-to-text directly in the app.</Text>
          </View>
        </View>
      </View>

      {/* System Info */}
      <View style={styles.mainCard}>
        <Text style={styles.cardSectionLabel}>System Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>AI Provider</Text>
          <Text style={styles.infoValue}>Gemini 3.1 Pro (Recommended)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Database Mode</Text>
          <Text style={styles.infoValue}>MongoDB Persistent</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App Version</Text>
          <Text style={styles.infoValue}>2.0.26 (Expo New Arch)</Text>
        </View>
      </View>

      {/* Danger Zone matching Clique screenshot */}
      <View style={[styles.mainCard, { borderColor: "#FFD5D2" }]}>
        <Text style={[styles.cardSectionLabel, { color: "#FF3B30" }]}>Danger Zone</Text>
        <TouchableOpacity style={styles.dangerRow} onPress={logout}>
          <View style={styles.dangerLeft}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" style={{ marginRight: 12 }} />
            <Text style={styles.dangerText}>Sign Out Account</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={16} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  profileHeaderCard: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EBEBEB",
    borderRadius: 28,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  emailText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5E6",
    borderWidth: 1,
    borderColor: "#FFE0B2",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: "#FF9500",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EBEBEB",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  cardSectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#8E8E93",
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
    borderWidth: 1,
    borderColor: "#EBEBEB",
  },
  featureTextWrapper: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: "#8E8E93",
    lineHeight: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
  },
  infoLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  infoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "800",
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
    fontWeight: "800",
    color: "#FF3B30",
  },
});
