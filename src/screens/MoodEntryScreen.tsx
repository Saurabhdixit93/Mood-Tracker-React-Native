import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { useMoodContext, MoodEntry } from "../context/MoodContext";
import { Alert } from "react-native";

type MoodEntryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MoodEntry"
>;

interface Props {
  navigation: MoodEntryScreenNavigationProp;
}

const MoodEntryScreen: React.FC<Props> = ({ navigation }) => {
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState("");
  const [saving, setSaving] = useState(false);
  const { addMoodEntry, loadMoodEntries } = useMoodContext();

  const getMoodLabel = (value: number) => {
    switch (value) {
      case 1:
        return "Very Sad";
      case 2:
        return "Sad";
      case 3:
        return "Neutral";
      case 4:
        return "Happy";
      case 5:
        return "Very Happy";
      default:
        return "Neutral";
    }
  };

  const getMoodEmoji = (value: number) => {
    switch (value) {
      case 1:
        return "😢";
      case 2:
        return "😕";
      case 3:
        return "😐";
      case 4:
        return "😊";
      case 5:
        return "😄";
      default:
        return "😐";
    }
  };

  const handleSave = async () => {
    if (note.trim().split(/\s+/).length < 2) {
      setNoteError("Please enter at least 2 words to describe your mood");
      return;
    }

    setNoteError("");
    setSaving(true);

    const moodEntry: MoodEntry = {
      mood,
      moodEmoji: getMoodEmoji(mood),
      moodLabel: getMoodLabel(mood),
      note: note.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      const savedEntry = await addMoodEntry(moodEntry);
      setSaving(false);
      // Navigate to insights screen with the new entry
      navigation.replace("Insights", {
        newEntry: true,
        latestMood: savedEntry,
      });
    } catch (error) {
      console.error("Error saving mood:", error);
      setSaving(false);
      Alert.alert("Error", "Failed to save your mood. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>

      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{getMoodEmoji(mood)}</Text>
        <Text style={styles.moodLabel}>{getMoodLabel(mood)}</Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={mood}
        onValueChange={setMood}
        minimumTrackTintColor="#4CAF50"
        maximumTrackTintColor="#000000"
        thumbTintColor="#4CAF50"
      />

      <View style={styles.sliderLabels}>
        <Text>😢</Text>
        <Text>😕</Text>
        <Text>😐</Text>
        <Text>🙂</Text>
        <Text>😄</Text>
      </View>

      <TextInput
        style={[
          styles.input,
          styles.noteInput,
          noteError ? styles.inputError : null,
        ]}
        placeholder="Add a note about your mood (at least 2 words)..."
        value={note}
        onChangeText={(text) => {
          setNote(text);
          setNoteError("");
        }}
        multiline
      />
      {noteError ? <Text style={styles.errorText}>{noteError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Entry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  emojiContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 10,
  },
  moodLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 20,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  noteInput: {
    height: 100,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#f44336",
    borderWidth: 1,
  },
  errorText: {
    color: "#f44336",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MoodEntryScreen;
