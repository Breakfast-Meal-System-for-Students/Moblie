import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import { ScrollView } from "react-native";

export default function FeedbackScreen({ route }) {
  const navigation = useNavigation();
  const { shopId, token } = route.params || {}; // Receive shopId and token from route parameters
  const [feedbackList, setFeedbackList] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(5); // Customize the number of feedback items per page
  const [loading, setLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [activeRating, setActiveRating] = useState("All");

  const ratings = ["All", 5, 4, 3, 2, 1];

  const fetchFeedback = async (page = 1, rating = activeRating) => {
    setLoading(true);
    let url = `https://bms-fs-api.azurewebsites.net/api/Feedback/${shopId}?pageIndex=${page}&pageSize=${pageSize}`;
    if (rating !== "All") {
      url += `&rating=${rating}`;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`, // Dynamically add token here
        },
      });
      const data = await response.json();
      if (data.isSuccess) {
        setFeedbackList(
          page === 1 ? data.data.data : [...feedbackList, ...data.data.data]
        );
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
    fetchFeedback(1); // Always fetch the first page when rating changes
  }, [activeRating]);

  useEffect(() => {
    fetchFeedback(pageIndex);
  }, [pageIndex]);

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
      {item.userPic && (
        <Image source={{ uri: item.userPic }} style={styles.userImage} />
      )}
    </View>
  );

  const RatingButton = ({ rating }) => {
    return (
      <TouchableOpacity
        style={[
          styles.ratingButton,
          activeRating === rating ? styles.activeRating : {},
        ]}
        onPress={() => {
          setActiveRating(rating); // Update activeRating to the selected rating
          setPageIndex(1); // Reset to page 1
          setFeedbackList([]); // Clear feedback list before fetching new data
        }}
      >
        <FontAwesomeIcon
          icon={faStar}
          color={activeRating === rating ? "white" : "black"}
          size={16}
        />
        <Text style={styles.ratingText}>
          {rating === "All" ? "All" : `${rating} Star`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback</Text>
      </View>
      <View style={styles.ratingFilter}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {ratings.map((rating) => (
            <RatingButton key={rating.toString()} rating={rating} />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={feedbackList}
        renderItem={renderFeedbackItem}
        keyExtractor={(item, index) =>
          item.id ? `${item.id}-${index}` : index.toString()
        }
        onEndReached={loadMoreFeedback}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00cc69" />
              <Text style={styles.loadingText}>Loading more feedback...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.noFeedbackText}>No feedback available.</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    backgroundColor: "#00cc69",
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 3,
    elevation: 5,
  },
  headerTitle: {
    marginLeft: 20,
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  ratingFilter: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 4,
    marginBottom: 10,
  },
  ratingButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    backgroundColor: "#ddd",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  activeRating: {
    backgroundColor: "#00cc69",
    borderColor: "#fff",
    borderWidth: 1,
  },
  ratingText: {
    marginLeft: 8,
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  feedbackItem: {
    flexDirection: "row",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  shopImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
  },
  feedbackContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  feedbackDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  feedbackRate: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  feedbackDate: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 5,
  },
  noFeedbackText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#555",
    fontSize: 14,
  },
});
