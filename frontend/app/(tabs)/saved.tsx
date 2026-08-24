import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/utils/api";
import { useTheme } from "../../src/utils/theme-context";
import { EmptyState } from "../../src/components/EmptyState";
import { RainbowStripe } from "../../src/components/RainbowStripe";
import { typography, borderRadius } from "../../src/constants/theme";

interface Favorite {
  id: string;
  original_conversation: string;
  reply_text: string;
  style_label: string;
}

interface Preset {
  id: string;
  name: string;
  goal: string;
  style: string;
  length: string;
}

const GOALS = [
  "Continue conversation",
  "Reply politely",
  "End conversation",
  "Set boundary",
  "Ask for clarification",
  "Be playful",
  "Sound confident",
  "Apologize",
  "Reconnect",
  "Say no",
  "Flirt",
  "Break up respectfully",
  "Ask out",
  "Negotiate",
  "Calm argument",
  "Be professional",
  "Follow up"
];

const LENGTHS = [
  "One sentence",
  "Short",
  "Medium",
  "Long",
  "Paragraph",
  "Bullet points",
  "Text message",
  "Email"
];

export default function SavedScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"favorites" | "presets">("favorites");
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(false);

  // Preset Form State
  const [presetName, setPresetName] = useState("");
  const [presetGoal, setPresetGoal] = useState("Continue conversation");
  const [presetLength, setPresetLength] = useState("Medium");
  const [creatingPreset, setCreatingPreset] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "favorites") {
        const data = await api.get<Favorite[]>("/chat/favorites");
        setFavorites(data || []);
      } else {
        const data = await api.get<Preset[]>("/chat/presets");
        setPresets(data || []);
      }
    } catch (e: any) {
      console.log("Failed to fetch saved data:", e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied!", "Reply text copied to clipboard.");
  };

  const deleteFavorite = async (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to remove this from favorites?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/chat/favorites/${id}`);
            setFavorites((prev) => prev.filter((fav) => fav.id !== id));
            Alert.alert("Deleted", "Favorite removed successfully");
          } catch (e: any) {
            Alert.alert("Error", e.message || "Failed to delete");
          }
        },
      },
    ]);
  };

  const deletePreset = async (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this style preset?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/chat/presets/${id}`);
            setPresets((prev) => prev.filter((p) => p.id !== id));
            Alert.alert("Deleted", "Preset deleted successfully");
          } catch (e: any) {
            Alert.alert("Error", e.message || "Failed to delete");
          }
        },
      },
    ]);
  };

  const createPreset = async () => {
    if (!presetName.trim()) {
      Alert.alert("Error", "Please provide a preset name");
      return;
    }
    setCreatingPreset(true);
    try {
      const newPreset = await api.post<Preset>("/chat/presets", {
        name: presetName,
        goal: presetGoal,
        style: "Default",
        length: presetLength,
      });
      setPresets((prev) => [newPreset as Preset, ...prev]);
      setPresetName("");
      setShowAddForm(false);
      Alert.alert("Success", "Preset created! Apply it on the 'Generate' screen.");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to create preset");
    } finally {
      setCreatingPreset(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Tabs segment */}
      <View style={[styles.segmentedControl, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}>
        <TouchableOpacity
          style={[
            styles.segmentBtn,
            activeTab === "favorites" && [styles.activeSegmentBtn, { backgroundColor: theme.primary }],
          ]}
          onPress={() => setActiveTab("favorites")}
        >
          <Ionicons
            name="star"
            size={14}
            color={activeTab === "favorites" ? theme.textInverse : theme.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.segmentText,
              { color: theme.textMuted },
              activeTab === "favorites" && [styles.activeSegmentText, { color: theme.textInverse }],
            ]}
          >
            Favorites
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentBtn,
            activeTab === "presets" && [styles.activeSegmentBtn, { backgroundColor: theme.primary }],
          ]}
          onPress={() => setActiveTab("presets")}
        >
          <Ionicons
            name="options"
            size={14}
            color={activeTab === "presets" ? theme.textInverse : theme.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.segmentText,
              { color: theme.textMuted },
              activeTab === "presets" && [styles.activeSegmentText, { color: theme.textInverse }],
            ]}
          >
            Presets
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        {loading ? (
          <ActivityIndicator color={theme.primary} size="large" style={{ marginTop: 40 }} />
        ) : activeTab === "favorites" ? (
          /* FAVORITES TAB */
          <View>
            {favorites.length === 0 ? (
              <EmptyState
                title="No Favorites Yet"
                subtitle="Save generated replies to access them here instantly."
                icon="star"
              />
            ) : (
              favorites.map((fav) => (
                <View key={fav.id} style={[styles.favCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <RainbowStripe height={2} style={styles.cardRainbow} />

                  <View style={[styles.favHeader, { borderBottomColor: theme.divider }]}>
                    <Text style={[styles.favStyle, { color: theme.textPrimary, backgroundColor: theme.inputBackground }]}>
                      {fav.style_label}
                    </Text>
                    <View style={styles.actionRow}>
                      <TouchableOpacity onPress={() => copyToClipboard(fav.reply_text)} style={styles.actionBtn}>
                        <Ionicons name="copy-outline" size={18} color={theme.textMuted} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteFavorite(fav.id)} style={styles.actionBtn}>
                        <Ionicons name="trash-outline" size={18} color={theme.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={[styles.originalLabel, { color: theme.textSecondary }]}>Original Convo:</Text>
                  <Text style={[styles.originalText, { color: theme.textSecondary }]} numberOfLines={2}>
                    {fav.original_conversation}
                  </Text>
                  <Text style={[styles.replyLabel, { color: theme.textPrimary }]}>Reply:</Text>
                  <Text style={[styles.replyText, { color: theme.textPrimary }]}>{fav.reply_text}</Text>
                </View>
              ))
            )}
          </View>
        ) : (
          /* PRESETS TAB */
          <View>
            <TouchableOpacity
              style={[styles.addPresetToggle, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => setShowAddForm(!showAddForm)}
            >
              <Ionicons name={showAddForm ? "close" : "add-circle-outline"} size={18} color={theme.primary} style={{ marginRight: 6 }} />
              <Text style={[styles.addPresetToggleText, { color: theme.textPrimary }]}>
                {showAddForm ? "Cancel Creation" : "Create New Preset"}
              </Text>
            </TouchableOpacity>

            {showAddForm && (
              <View style={[styles.presetFormCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.formTitle, { color: theme.textPrimary }]}>New Custom Preset</Text>

                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: theme.textSecondary }]}>Preset Name</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.textPrimary }]}
                    placeholder="e.g. My Dating Style, My Wife, My Boss"
                    placeholderTextColor={theme.inputPlaceholder}
                    value={presetName}
                    onChangeText={setPresetName}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: theme.textSecondary }]}>Default Goal</Text>
                  <View style={styles.dropdown}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalChips}>
                      {GOALS.map((g) => (
                        <TouchableOpacity
                          key={g}
                          style={[
                            styles.miniChip,
                            { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder },
                            presetGoal === g && [styles.activeMiniChip, { backgroundColor: theme.primary, borderColor: theme.primary }],
                          ]}
                          onPress={() => setPresetGoal(g)}
                        >
                          <Text
                            style={[
                              styles.miniChipText,
                              { color: theme.textMuted },
                              presetGoal === g && [styles.activeMiniChipText, { color: theme.textInverse }],
                            ]}
                          >
                            {g}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: theme.textSecondary }]}>Default Length</Text>
                  <View style={styles.dropdown}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalChips}>
                      {LENGTHS.map((l) => (
                        <TouchableOpacity
                          key={l}
                          style={[
                            styles.miniChip,
                            { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder },
                            presetLength === l && [styles.activeMiniChip, { backgroundColor: theme.primary, borderColor: theme.primary }],
                          ]}
                          onPress={() => setPresetLength(l)}
                        >
                          <Text
                            style={[
                              styles.miniChipText,
                              { color: theme.textMuted },
                              presetLength === l && [styles.activeMiniChipText, { color: theme.textInverse }],
                            ]}
                          >
                            {l}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>

                <RainbowStripe height={3} style={styles.formRainbow} />

                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    { backgroundColor: theme.buttonPrimary },
                    creatingPreset && [styles.disabledBtn, { backgroundColor: theme.buttonDisabled }],
                  ]}
                  onPress={createPreset}
                  disabled={creatingPreset}
                >
                  {creatingPreset ? (
                    <ActivityIndicator color={theme.buttonPrimaryText} />
                  ) : (
                    <Text style={[styles.submitBtnText, { color: theme.buttonPrimaryText }]}>Save Preset Style</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {presets.length === 0 ? (
              <EmptyState
                title="No Presets Yet"
                subtitle="Create custom presets above to quickly prefill configurations on the generate screen."
                icon="options"
              />
            ) : (
              presets.map((p) => (
                <View key={p.id} style={[styles.presetCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <RainbowStripe height={2} style={styles.cardRainbow} />

                  <View style={[styles.presetHeader, { borderBottomColor: theme.divider }]}>
                    <View style={styles.presetMetaInfo}>
                      <Ionicons name="color-wand-outline" size={16} color={theme.primary} style={{ marginRight: 6 }} />
                      <Text style={[styles.presetNameText, { color: theme.textPrimary }]}>{p.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => deletePreset(p.id)} style={styles.presetDelete}>
                      <Ionicons name="trash-outline" size={18} color={theme.error} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.presetBody}>
                    <View style={styles.metaRow}>
                      <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>Goal: </Text>
                      <Text style={[styles.metaValue, { color: theme.textPrimary }]}>{p.goal}</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>Length: </Text>
                      <Text style={[styles.metaValue, { color: theme.textPrimary }]}>{p.length}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentedControl: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    margin: 16,
    borderWidth: 1,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 38,
    borderRadius: 8,
  },
  activeSegmentBtn: {
    // color set dynamically
  },
  segmentText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.serifBold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  activeSegmentText: {
    // color set dynamically
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  favCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#8B6F5E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  cardRainbow: {
    marginBottom: 12,
  },
  favHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 10,
  },
  favStyle: {
    fontSize: 12,
    fontFamily: typography.fontFamily.serifBold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  actionRow: {
    flexDirection: "row",
  },
  actionBtn: {
    padding: 4,
    marginLeft: 12,
  },
  originalLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.serifBold,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  originalText: {
    fontSize: 13,
    marginBottom: 12,
    fontFamily: typography.fontFamily.sansRegular,
  },
  replyLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.serifBold,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  replyText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: typography.fontFamily.sansRegular,
  },
  addPresetToggle: {
    flexDirection: "row",
    borderWidth: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#8B6F5E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  addPresetToggleText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.serifBold,
  },
  presetFormCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#8B6F5E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.serifBold,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.serifBold,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: typography.fontFamily.sansRegular,
  },
  dropdown: {
    marginTop: 2,
  },
  horizontalChips: {
    flexDirection: "row",
  },
  miniChip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
  },
  activeMiniChip: {
    // colors set dynamically
  },
  miniChipText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.sansMedium,
  },
  activeMiniChipText: {
    fontFamily: typography.fontFamily.serifBold,
  },
  formRainbow: {
    marginVertical: 12,
    borderRadius: 2,
  },
  submitBtn: {
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  disabledBtn: {
    // color set dynamically
  },
  submitBtnText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.serifBold,
  },
  presetCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#8B6F5E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  presetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 10,
  },
  presetMetaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  presetNameText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.serifBold,
  },
  presetDelete: {
    padding: 4,
  },
  presetBody: {
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 12,
    fontFamily: typography.fontFamily.serifBold,
    width: 60,
  },
  metaValue: {
    fontSize: 13,
    flex: 1,
    fontFamily: typography.fontFamily.sansRegular,
  },
});
