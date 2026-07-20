import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useAuth } from "../../src/utils/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/utils/api";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer} bounces={false}>
      {/* Profile Header Card */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#8E8E93" />
        </View>
        <Text style={styles.emailText}>{user?.email || "user@example.com"}</Text>
      </View>

      {/* Account Actions */}
      <View style={styles.mainCard}>
        <Text style={styles.cardSectionLabel}>Account</Text>

        <TouchableOpacity style={styles.featureItem} onPress={handleChangePassword}>
          <View style={[styles.iconWrapper, { backgroundColor: "#F4F4F5" }]}>
            <Ionicons name="lock-closed-outline" size={20} color="#111827" />
          </View>
          <View style={styles.featureTextWrapper}>
            <Text style={styles.featureTitle}>Change Password</Text>
            <Text style={styles.featureDesc}>Update your account password</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={16} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureItem} onPress={logout}>
          <View style={[styles.iconWrapper, { backgroundColor: "#F4F4F5" }]}>
            <Ionicons name="log-out-outline" size={20} color="#111827" />
          </View>
          <View style={styles.featureTextWrapper}>
            <Text style={styles.featureTitle}>Sign Out</Text>
            <Text style={styles.featureDesc}>Sign out of your account</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={16} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* System Info */}
      <View style={styles.mainCard}>
        <Text style={styles.cardSectionLabel}>System Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>AI Provider</Text>
          <Text style={styles.infoValue}>Gemini (Configurable)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Database</Text>
          <Text style={styles.infoValue}>MongoDB</Text>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={[styles.mainCard, { borderColor: "#FFD5D2" }]}>
        <Text style={[styles.cardSectionLabel, { color: "#FF3B30" }]}>Danger Zone</Text>
        <TouchableOpacity style={styles.dangerRow} onPress={handleDeleteAccount}>
          <View style={styles.dangerLeft}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" style={{ marginRight: 12 }} />
            <Text style={styles.dangerText}>Delete Account</Text>
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
