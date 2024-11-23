import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { LineChart } from "react-native-chart-kit";
import { useMoodContext } from "../context/MoodContext";
import { Ionicons } from "@expo/vector-icons";

type InsightsScreenRouteProp = RouteProp<RootStackParamList, "Insights">;

interface Props {
  route: InsightsScreenRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "Insights">;
}

const InsightsScreen: React.FC<Props> = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const { moodEntries, removeMoodEntry, moodInsights } = useMoodContext();
  const { newEntry, latestMood } = route.params;

  const handleRemoveMood = async (timestamp: string) => {
    Alert.alert(
      "Remove Mood Entry",
      "Are you sure you want to remove this mood entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: async () => {
            await removeMoodEntry(timestamp);
            if (timestamp === latestMood?.timestamp) {
              navigation.goBack();
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  // Get the last 7 days of mood data
  const recentMoodData = moodEntries.slice(0, 7).reverse();

  const chartData = {
    labels: recentMoodData.map((entry) => {
      const date = new Date(entry.timestamp);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        data: recentMoodData.map((entry) => entry.mood),
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#4CAF50",
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "#e3e3e3",
    },
    propsForLabels: {
      fontSize: 12,
    },
  };

  return (
    <ScrollView style={styles.container}>
      {newEntry && latestMood && (
        <View style={styles.newMoodContainer}>
          <View style={styles.newMoodHeader}>
            <View style={styles.newMoodContent}>
              <Text style={styles.newMoodEmoji}>{latestMood.moodEmoji}</Text>
              <Text style={styles.newMoodLabel}>
                Current Mood: {latestMood.moodLabel}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleRemoveMood(latestMood.timestamp)}
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={24} color="#ff4444" />
            </TouchableOpacity>
          </View>
          {latestMood?.aiInsight && (
            <View style={styles.aiInsightContainer}>
              <Text style={styles.aiInsightTitle}>AI Insight</Text>
              <Text style={styles.aiInsightText}>{latestMood?.aiInsight}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.chartContainer}>
        <Text style={styles.subtitle}>Mood Trend (Last 7 Days)</Text>
        <LineChart
          data={chartData}
          width={Dimensions.get("window").width - 60}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1}
          segments={4}
          fromZero
          withInnerLines
          withOuterLines
          withVerticalLabels={true}
          withHorizontalLabels={true}
          withVerticalLines={false}
          chartConfig={chartConfig}
          style={styles.chart}
          bezier
          verticalLabelRotation={45}
        />
        <Text style={styles.chartLabelX}>Date</Text>
        <Text style={styles.chartLabelY}>Mood Level</Text>
      </View>

      <View style={styles.pastInsightsContainer}>
        <Text style={styles.subtitle}>Past Mood Insights</Text>
        {moodInsights.map((insight) => (
          <View key={insight.id} style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={styles.insightHeaderLeft}>
                <Text style={styles.moodEmoji}>
                  {insight.moodEntry.moodEmoji}
                </Text>
                <View>
                  <Text style={styles.moodLabel}>
                    {insight.moodEntry.moodLabel}
                  </Text>
                  <Text style={styles.timestamp}>
                    {new Date(insight.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.trendBadge,
                  {
                    backgroundColor:
                      insight.moodTrend === "positive"
                        ? "#4CAF50"
                        : insight.moodTrend === "negative"
                        ? "#f44336"
                        : "#ff9800",
                  },
                ]}
              >
                {insight.moodTrend.toUpperCase()}
              </Text>
            </View>
            {insight.aiResponse && (
              <Text style={styles.insightText}>{insight.aiResponse}</Text>
            )}
            {insight.moodEntry.note && (
              <Text style={styles.noteText}>
                Note: {insight.moodEntry.note}
              </Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  newMoodContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newMoodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  newMoodContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  newMoodEmoji: {
    fontSize: 32,
    marginRight: 10,
  },
  newMoodLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  aiInsightContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  aiInsightTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  aiInsightText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  pastInsightsContainer: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartLabelX: {
    textAlign: "center",
    marginTop: 8,
    color: "#666",
  },
  chartLabelY: {
    position: "absolute",
    left: -30,
    top: "50%",
    transform: [{ rotate: "-90deg" }],
    color: "#666",
  },
  insightCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  insightHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 24,
    marginRight: 12,
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
  trendBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  insightText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 10,
  },
  noteText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  removeButton: {
    padding: 8,
  },
});

export default InsightsScreen;
