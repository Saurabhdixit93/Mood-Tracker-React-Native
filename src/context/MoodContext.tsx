import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface MoodEntry {
  mood: number;
  moodEmoji: string;
  moodLabel: string;
  note: string;
  timestamp: string;
  aiInsight?: string;
}

export interface MoodInsight {
  id: string;
  timestamp: string;
  moodEntry: MoodEntry;
  analysis: string;
  recommendations: string[];
  moodTrend: string;
  aiResponse?: string;
  periodStart?: string;
  periodEnd?: string;
}

interface MoodContextType {
  moodEntries: MoodEntry[];
  moodInsights: MoodInsight[];
  setMoodEntries: React.Dispatch<React.SetStateAction<MoodEntry[]>>;
  removeMoodEntry: (timestamp: string) => Promise<void>;
  loadMoodEntries: () => Promise<void>;
  addMoodEntry: (entry: MoodEntry) => Promise<MoodEntry>;
  generateInsights: () => Promise<void>;
  loadInsights: () => Promise<void>;
  saveInsight: (insight: MoodInsight) => Promise<void>;
  getAIInsight: (entry: MoodEntry) => Promise<string>;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [moodInsights, setMoodInsights] = useState<MoodInsight[]>([]);

  const loadMoodEntries = useCallback(async () => {
    try {
      const entries = await AsyncStorage.getItem("moodEntries");
      if (entries) {
        setMoodEntries(JSON.parse(entries));
      }
    } catch (error) {
      console.log("Error loading mood entries:", error);
    }
  }, []);

  const loadInsights = useCallback(async () => {
    try {
      const storedInsights = await AsyncStorage.getItem("insights");
      if (storedInsights) {
        setMoodInsights(JSON.parse(storedInsights));
      }
    } catch (error) {
      console.error("Error loading insights:", error);
    }
  }, []);

  const saveInsight = useCallback(
    async (insight: MoodInsight) => {
      try {
        const updatedInsights = [insight, ...moodInsights];
        await AsyncStorage.setItem("insights", JSON.stringify(updatedInsights));
        setMoodInsights(updatedInsights);
      } catch (error) {
        console.error("Error saving insight:", error);
      }
    },
    [moodInsights]
  );

  const generateInsights = useCallback(async () => {
    if (moodEntries.length < 3) return; // Need at least 3 entries for meaningful insights

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentEntries = moodEntries.filter(
      (entry) => new Date(entry.timestamp) >= last7Days
    );

    if (recentEntries.length === 0) return;

    // Calculate mood trends
    const moodValues = recentEntries.map((entry) => entry.mood);
    const avgMood = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
    const moodTrend =
      avgMood > 3 ? "positive" : avgMood < 3 ? "negative" : "stable";

    // Generate recommendations based on mood trend
    const recommendations = [];
    if (moodTrend === "negative") {
      recommendations.push(
        "Consider talking to a friend or family member about your feelings",
        "Try incorporating more physical activity into your daily routine",
        "Practice mindfulness or meditation to help manage stress"
      );
    } else if (moodTrend === "stable") {
      recommendations.push(
        "Keep maintaining your current routine",
        "Consider setting new personal goals",
        "Share your positive experiences with others"
      );
    } else {
      recommendations.push(
        "Keep up the great work!",
        "Share your positive energy with others",
        "Document what's working well for future reference"
      );
    }

    const newInsight: MoodInsight = {
      id: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      moodEntry: recentEntries[0],
      analysis: `Your mood has been ${moodTrend} over the past week. Average mood rating: ${avgMood.toFixed(
        1
      )}`,
      recommendations,
      moodTrend,
      periodStart: last7Days.toISOString(),
      periodEnd: new Date().toISOString(),
    };

    await saveInsight(newInsight);
  }, [moodEntries, saveInsight]);

  const getAIInsight = async (entry: MoodEntry): Promise<string> => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not found in environment variables');
    }
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a supportive mood tracking assistant. Provide brief, encouraging insights and personalized recommendations based on the user's mood. Keep your response concise and focused on emotional well-being.",
              },
              {
                role: "user",
                content: `I'm feeling ${entry.moodLabel.toLowerCase()}${
                  entry.note ? ` and here's why: ${entry.note}` : "."
                } Please provide insights and suggestions for maintaining or improving my emotional well-being.`,
              },
            ],
            temperature: 0.7,
            max_tokens: 100,
          }),
        }
      );

      const data = await response.json();
      return (
        data?.choices[0]?.message?.content ||
        "Unable to generate insights at this time."
      );
    } catch (error) {
      console.error("Error getting AI insight:", error);
      return "Unable to generate insights at this time.";
    }
  };

  const addMoodEntry = useCallback(
    async (entry: MoodEntry) => {
      try {
        // Get AI insight first
        const aiResponse = await getAIInsight(entry);
        const entryWithInsight = { ...entry, aiInsight: aiResponse };

        const newEntries = [entryWithInsight, ...moodEntries];
        await AsyncStorage.setItem("moodEntries", JSON.stringify(newEntries));
        setMoodEntries(newEntries);

        // Create and save insight
        const newInsight: MoodInsight = {
          id: new Date().toISOString(),
          timestamp: new Date().toISOString(),
          moodEntry: entryWithInsight,
          analysis: `Mood: ${entry.moodLabel}`,
          recommendations: [],
          moodTrend:
            entry.mood > 3
              ? "positive"
              : entry.mood < 3
              ? "negative"
              : "stable",
          aiResponse,
        };

        await saveInsight(newInsight);
        return entryWithInsight;
      } catch (error) {
        console.log("Error adding mood entry:", error);
        return entry;
      }
    },
    [moodEntries]
  );

  const removeMoodEntry = useCallback(
    async (timestamp: string) => {
      try {
        // Remove the mood entry
        const updatedEntries = moodEntries.filter(
          (entry) => entry.timestamp !== timestamp
        );
        await AsyncStorage.setItem(
          "moodEntries",
          JSON.stringify(updatedEntries)
        );
        setMoodEntries(updatedEntries);

        // Remove associated insights
        const updatedInsights = moodInsights.filter(
          (insight) => insight.moodEntry.timestamp !== timestamp
        );
        await AsyncStorage.setItem("insights", JSON.stringify(updatedInsights));
        setMoodInsights(updatedInsights);
      } catch (error) {
        console.error("Error removing mood entry:", error);
      }
    },
    [moodEntries, moodInsights]
  );

  // Load entries and insights when component mounts
  useEffect(() => {
    loadMoodEntries();
    loadInsights();
  }, [loadMoodEntries, loadInsights]);

  return (
    <MoodContext.Provider
      value={{
        moodEntries,
        moodInsights,
        setMoodEntries,
        removeMoodEntry,
        loadMoodEntries,
        addMoodEntry,
        generateInsights,
        loadInsights,
        saveInsight,
        getAIInsight,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
};

export const useMoodContext = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error("useMoodContext must be used within a MoodProvider");
  }
  return context;
};
