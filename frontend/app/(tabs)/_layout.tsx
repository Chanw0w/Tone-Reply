import React from "react";
import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/utils/auth-context";
import { useTheme } from "../../src/utils/theme-context";
import { ActivityIndicator, View, Text, StyleSheet, Platform } from "react-native";
import { RainbowStripe } from "../../src/components/RainbowStripe";
import { StaticSparkle } from "../../src/components/SparkleDecoration";

export default function TabsLayout() {
  const { user, isLoading } = useAuth();
  const { theme, isDark } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: theme.tabBarBorder,
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
        header: () => (
          <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.tabBarBorder }]}>
            <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <StaticSparkle size={10} color={theme.accent.gold} style={styles.logoSparkle} />
                <Text style={[styles.headerLogo, { color: theme.textPrimary }]}>
                  Tone Reply
                </Text>
              </View>
            </View>
            <RainbowStripe height={3} style={styles.headerRainbow} />
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
            <View style={[styles.tabIconWrapper, focused && [styles.tabIconWrapperActive, { backgroundColor: theme.primaryMuted }]]}>
              <Ionicons
                name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"}
                size={18}
                color={focused ? theme.tabBarActive : theme.tabBarInactive}
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
            <View style={[styles.tabIconWrapper, focused && [styles.tabIconWrapperActive, { backgroundColor: theme.primaryMuted }]]}>
              <Ionicons
                name={focused ? "create" : "create-outline"}
                size={18}
                color={focused ? theme.tabBarActive : theme.tabBarInactive}
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
            <View style={[styles.tabIconWrapper, focused && [styles.tabIconWrapperActive, { backgroundColor: theme.primaryMuted }]]}>
              <Ionicons
                name={focused ? "bulb" : "bulb-outline"}
                size={18}
                color={focused ? theme.tabBarActive : theme.tabBarInactive}
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
            <View style={[styles.tabIconWrapper, focused && [styles.tabIconWrapperActive, { backgroundColor: theme.primaryMuted }]]}>
              <Ionicons
                name={focused ? "bookmark" : "bookmark-outline"}
                size={18}
                color={focused ? theme.tabBarActive : theme.tabBarInactive}
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
            <View style={[styles.tabIconWrapper, focused && [styles.tabIconWrapperActive, { backgroundColor: theme.primaryMuted }]]}>
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={18}
                color={focused ? theme.tabBarActive : theme.tabBarInactive}
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
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    borderBottomWidth: 1,
    paddingTop: Platform.OS === "ios" ? 54 : 36,
    paddingBottom: 0,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoSparkle: {
    marginRight: 8,
  },
  headerLogo: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
    fontStyle: "italic",
  },
  headerRainbow: {
    height: 3,
  },
  tabIconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 52,
    height: 32,
    borderRadius: 16,
  },
  tabIconWrapperActive: {
    // backgroundColor set dynamically
  },
});
