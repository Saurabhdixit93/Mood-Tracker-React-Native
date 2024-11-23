import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { useFocusEffect } from "@react-navigation/native";
import { useMoodContext } from "../context/MoodContext";
import { Ionicons } from "@expo/vector-icons";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { moodEntries, loadMoodEntries, removeMoodEntry } = useMoodContext();

  useFocusEffect(
    React.useCallback(() => {
      loadMoodEntries();
    }, [loadMoodEntries])
  );

  const handleRemoveMood = (timestamp: string) => {
    Alert.alert(
      "Remove Mood Entry",
      "Are you sure you want to remove this mood entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: () => removeMoodEntry(timestamp),
          style: "destructive",
        },
      ]
    );
  };

  const renderMoodEntry = (entry: any, index: number) => (
    <View key={entry.timestamp} style={styles.moodCard}>
      <View style={styles.moodCardContent}>
        <Text style={styles.moodEmoji}>{entry.moodEmoji}</Text>
        <View style={styles.moodInfo}>
          <Text style={styles.moodLabel}>{entry.moodLabel}</Text>
          <Text style={styles.timestamp}>
            {new Date(entry.timestamp).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          {entry.note && <Text style={styles.note}>{entry.note}</Text>}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveMood(entry.timestamp)}
        style={styles.removeButton}
      >
        <Ionicons name="trash-outline" size={24} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  if (moodEntries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeEmoji}>👋</Text>
          <Text style={styles.welcomeTitle}>Welcome to Mood Tracker!</Text>
          <Text style={styles.welcomeText}>
            Start your journey to better emotional well-being by tracking your
            daily moods. Regular mood tracking can help you:
          </Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>
              🎯 Understand your emotional patterns
            </Text>
            <Text style={styles.benefitItem}>
              💡 Gain insights from AI analysis
            </Text>
            <Text style={styles.benefitItem}>
              📈 Track your mood trends over time
            </Text>
            <Text style={styles.benefitItem}>
              🌟 Improve your mental well-being
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.getStartedButton]}
          onPress={() => navigation.navigate("MoodEntry")}
        >
          <Text style={styles.getStartedText}>Log Your First Mood</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Tracker</Text>
      <ScrollView style={styles.entriesContainer}>
        {moodEntries.map((entry, index) => renderMoodEntry(entry, index))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MoodEntry")}
        >
          <Text style={styles.buttonText}>Log New Mood</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.insightsButton]}
          onPress={() =>
            navigation.navigate("Insights", { moodData: moodEntries })
          }
        >
          <Text style={styles.buttonText}>View Insights</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  emptyContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  welcomeCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeEmoji: {
    fontSize: 48,
    textAlign: "center",
    marginBottom: 15,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  benefitsList: {
    marginTop: 10,
  },
  benefitItem: {
    fontSize: 16,
    color: "#444",
    marginBottom: 12,
    paddingLeft: 10,
  },
  getStartedButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
  },
  getStartedText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  entriesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  moodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  moodCardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  moodInfo: {
    flex: 1,
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  timestamp: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  note: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    fontStyle: "italic",
  },
  removeButton: {
    padding: 8,
  },
  buttonContainer: {
    gap: 10,
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
  insightsButton: {
    backgroundColor: "#3F51B5",
  },
});

export default HomeScreen;
