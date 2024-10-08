import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function FeedbackScreen({ route }) {
  const { shopId } = route.params || 0;
  const [feedbackList, setFeedbackList] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(5); // Customize the number of feedback items per page
  const [loading, setLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);

  // Fetch feedback with pagination
  const fetchFeedback = async (page = 1) => {
    setLoading(true);
    try {
      const shopId2 = await AsyncStorage.getItem("shopId");
      const response = await fetch(
        `https://bms-fs-api.azurewebsites.net/api/Feedback/${shopId2}?pageIndex=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: { Accept: "*/*" },
        }
      );
      const data = await response.json();
      if (data.isSuccess) {
        setFeedbackList((prevFeedback) => [...prevFeedback, ...data.data.data]);
        setIsLastPage(data.data.isLastPage);
      } else {
        console.error("Error fetching feedback:", data.messages);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback(pageIndex);
  }, [pageIndex]);

  // Load more feedback when reaching the end of the list
  const loadMoreFeedback = () => {
    if (!isLastPage && !loading) {
      setPageIndex(pageIndex + 1);
    }
  };

  const renderFeedbackItem = ({ item }) => (
    <View style={styles.feedbackItem}>
      {item.shoppic && (
        <Image source={{ uri: item.shoppic }} style={styles.shopImage} />
      )}
      <View style={styles.feedbackContent}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.feedbackDescription}>{item.description}</Text>
        <Text style={styles.feedbackRate}>Rating: {item.rate}</Text>
        <Text style={styles.feedbackDate}>
          {new Date(item.createDate).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={feedbackList}
      renderItem={renderFeedbackItem}
      keyExtractor={(item, index) => item.id || index.toString()} // Updated keyExtractor
      onEndReached={loadMoreFeedback}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? <ActivityIndicator size="large" color="#00cc69" /> : null
      }
      ListEmptyComponent={
        !loading ? (
          <Text style={styles.noFeedbackText}>No feedback available.</Text>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  feedbackItem: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  shopImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  feedbackContent: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  feedbackDescription: {
    fontSize: 14,
    color: "#555",
  },
  feedbackRate: {
    fontSize: 14,
    color: "#888",
  },
  feedbackDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  noFeedbackText: {
    textAlign: "center",
    color: "#555",
    fontSize: 16,
    marginTop: 20,
  },
});
