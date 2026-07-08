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
  Clipboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/utils/api";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "favorites") {
        const data = await api.get("/chat/favorites");
        setFavorites(data || []);
      } else {
        const data = await api.get("/chat/presets");
        setPresets(data || []);
      }
    } catch (e: any) {
      console.log("Failed to fetch saved data:", e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
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
      const newPreset = await api.post("/chat/presets", {
        name: presetName,
        goal: presetGoal,
        style: "Default",
        length: presetLength,
      });
      setPresets((prev) => [newPreset, ...prev]);
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
    <View style={styles.container}>
      {/* Tabs segment */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === "favorites" && styles.activeSegmentBtn]}
          onPress={() => setActiveTab("favorites")}
        >
          <Ionicons
            name="star"
            size={16}
            color={activeTab === "favorites" ? "#FFFFFF" : "#6B7280"}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.segmentText, activeTab === "favorites" && styles.activeSegmentText]}>
            Favorites
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === "presets" && styles.activeSegmentBtn]}
          onPress={() => setActiveTab("presets")}
        >
          <Ionicons
            name="options"
            size={16}
            color={activeTab === "presets" ? "#FFFFFF" : "#6B7280"}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.segmentText, activeTab === "presets" && styles.activeSegmentText]}>
            My Presets
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        {loading ? (
          <ActivityIndicator color="#8B5CF6" size="large" style={{ marginTop: 40 }} />
        ) : activeTab === "favorites" ? (
          /* FAVORITES TAB */
          <View>
            {favorites.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="star-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>No Favorite Replies Yet</Text>
                <Text style={styles.emptySubtitle}>
                  Generate replies and tap the star icon to save them here for quick access.
                </Text>
              </View>
            ) : (
              favorites.map((fav) => (
                <View key={fav.id} style={styles.favCard}>
                  <View style={styles.favHeader}>
                    <Text style={styles.favStyle}>{fav.style_label}</Text>
                    <View style={styles.actionRow}>
                      <TouchableOpacity onPress={() => copyToClipboard(fav.reply_text)} style={styles.actionBtn}>
                        <Ionicons name="copy-outline" size={18} color="#6B7280" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteFavorite(fav.id)} style={styles.actionBtn}>
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.originalLabel}>Original Convo:</Text>
                  <Text style={styles.originalText} numberOfLines={2}>
                    {fav.original_conversation}
                  </Text>
                  <Text style={styles.replyLabel}>Reply:</Text>
                  <Text style={styles.replyText}>{fav.reply_text}</Text>
                </View>
              ))
            )}
          </View>
        ) : (
          /* PRESETS TAB */
          <View>
            <TouchableOpacity
              style={styles.addPresetToggle}
              onPress={() => setShowAddForm(!showAddForm)}
            >
              <Ionicons name={showAddForm ? "close" : "add-circle"} size={20} color="#8B5CF6" style={{ marginRight: 6 }} />
              <Text style={styles.addPresetToggleText}>
                {showAddForm ? "Cancel Creation" : "Create New Style Preset"}
              </Text>
            </TouchableOpacity>

            {showAddForm && (
              <View style={styles.presetForm}>
                <Text style={styles.formTitle}>New Custom Preset</Text>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Preset Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. My Dating Style, My Wife, My Boss"
                    placeholderTextColor="#9CA3AF"
                    value={presetName}
                    onChangeText={setPresetName}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Default Goal</Text>
                  <View style={styles.dropdown}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalChips}>
                      {GOALS.map((g) => (
                        <TouchableOpacity
                          key={g}
                          style={[styles.miniChip, presetGoal === g && styles.activeMiniChip]}
                          onPress={() => setPresetGoal(g)}
                        >
                          <Text style={[styles.miniChipText, presetGoal === g && styles.activeMiniChipText]}>{g}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Default Length</Text>
                  <View style={styles.dropdown}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalChips}>
                      {LENGTHS.map((l) => (
                        <TouchableOpacity
                          key={l}
                          style={[styles.miniChip, presetLength === l && styles.activeMiniChip]}
                          onPress={() => setPresetLength(l)}
                        >
                          <Text style={[styles.miniChipText, presetLength === l && styles.activeMiniChipText]}>{l}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.submitBtn, creatingPreset && styles.disabledBtn]}
                  onPress={createPreset}
                  disabled={creatingPreset}
                >
                  {creatingPreset ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitBtnText}>Save Preset Style</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {presets.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="options-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>No Custom Presets</Text>
                <Text style={styles.emptySubtitle}>
                  Create custom presets above to quickly prefill configurations on the generate screen.
                </Text>
              </View>
            ) : (
              presets.map((p) => (
                <View key={p.id} style={styles.presetCard}>
                  <View style={styles.presetHeader}>
                    <View style={styles.presetMetaInfo}>
                      <Ionicons name="color-wand" size={16} color="#8B5CF6" style={{ marginRight: 6 }} />
                      <Text style={styles.presetNameText}>{p.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => deletePreset(p.id)} style={styles.presetDelete}>
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.presetBody}>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaLabel}>Goal: </Text>
                      <Text style={styles.metaValue}>{p.goal}</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaLabel}>Length: </Text>
                      <Text style={styles.metaValue}>{p.length}</Text>
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
    backgroundColor: "#F9FAFB",
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    padding: 4,
    borderRadius: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    backgroundColor: "#8B5CF6",
  },
  segmentText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "700",
  },
  activeSegmentText: {
    color: "#FFFFFF",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  favCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  favHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 8,
    marginBottom: 10,
  },
  favStyle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#8B5CF6",
    backgroundColor: "rgba(139, 92, 246, 0.08)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
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
    fontWeight: "800",
    color: "#9CA3AF",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  originalText: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 12,
  },
  replyLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#8B5CF6",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  replyText: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 22,
  },
  addPresetToggle: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  addPresetToggleText: {
    color: "#8B5CF6",
    fontSize: 14,
    fontWeight: "800",
  },
  presetForm: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#4B5563",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    height: 44,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "#111827",
    fontSize: 14,
  },
  dropdown: {
    marginTop: 2,
  },
  horizontalChips: {
    flexDirection: "row",
  },
  miniChip: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
  },
  activeMiniChip: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  miniChipText: {
    color: "#4B5563",
    fontSize: 12,
    fontWeight: "600",
  },
  activeMiniChipText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  submitBtn: {
    backgroundColor: "#8B5CF6",
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  disabledBtn: {
    backgroundColor: "#9CA3AF",
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  presetCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  presetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 8,
    marginBottom: 10,
  },
  presetMetaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  presetNameText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
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
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    width: 60,
  },
  metaValue: {
    fontSize: 13,
    color: "#1F2937",
    flex: 1,
  },
});
