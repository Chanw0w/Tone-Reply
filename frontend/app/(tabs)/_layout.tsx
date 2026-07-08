import React from "react";
import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/utils/auth-context";
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";

export default function TabsLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#111827",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          height: 68,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "800",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginTop: 2,
        },
        // Custom header layout to look EXACTLY like the Clique screenshot
        header: () => (
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerLogo}>💬 TONEREPLY</Text>
              <TouchableOpacity style={styles.themeToggle}>
                <Ionicons name="moon-outline" size={16} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="generate"
        options={{
          title: "Generate",
          tabBarLabel: "Generate",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIconWrapper, focused && styles.tabIconWrapperActive]}>
              <Ionicons
                name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"}
                size={18}
                color={focused ? "#111827" : "#8E8E93"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="rewrite"
        options={{
          title: "Rewrite",
          tabBarLabel: "Rewrite",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIconWrapper, focused && styles.tabIconWrapperActive]}>
              <Ionicons
                name={focused ? "create" : "create-outline"}
                size={18}
                color={focused ? "#111827" : "#8E8E93"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explain"
        options={{
          title: "Coach",
          tabBarLabel: "Coach",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIconWrapper, focused && styles.tabIconWrapperActive]}>
              <Ionicons
                name={focused ? "bulb" : "bulb-outline"}
                size={18}
                color={focused ? "#111827" : "#8E8E93"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarLabel: "Saved",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIconWrapper, focused && styles.tabIconWrapperActive]}>
              <Ionicons
                name={focused ? "bookmark" : "bookmark-outline"}
                size={18}
                color={focused ? "#111827" : "#8E8E93"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIconWrapper, focused && styles.tabIconWrapperActive]}>
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={18}
                color={focused ? "#111827" : "#8E8E93"}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F4F4F5",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingTop: Platform.OS === "ios" ? 54 : 36,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLogo: {
    fontSize: 22,
    fontWeight: "900",
    color: "#000000",
    letterSpacing: -0.5,
  },
  themeToggle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  tabIconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 52,
    height: 32,
    borderRadius: 16,
  },
  tabIconWrapperActive: {
    backgroundColor: "#F2F2F7",
  },
});
