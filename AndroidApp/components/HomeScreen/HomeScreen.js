import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMapPin, faStar } from "@fortawesome/free-solid-svg-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomTabNavigator from "../BottomNavigationBar/BottomNavigationBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { io } from 'socket.io-client';

const { width } = Dimensions.get("window");

function RestaurantCard({ item }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Shop", { id: item.id, orderIdSuccess: null })}
    >
      <View style={styles.restaurantCard}>
        <Image style={styles.restaurantImage} source={item.image} />
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <View style={styles.restaurantRatingContainer}>
            <FontAwesomeIcon icon={faStar} style={styles.starIcon} size={15} />
            <Text style={styles.ratingText}>{item.stars}</Text>
            <Text style={styles.reviewsText}>
              ({item.reviews} reviews) -{" "}
              <Text style={styles.categoryText}>{item.category}</Text>
            </Text>
          </View>
          <View style={styles.locationInfo}>
            <FontAwesomeIcon icon={faMapPin} color="green" size={16} />
            <Text style={styles.locationText}>{item.address}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FeaturedRow({ restaurants }) {
  return (
    <View style={styles.featuredRowContainer}>
      <FlatList
        data={restaurants}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.featuredContentContainer}
        renderItem={({ item }) => <RestaurantCard item={item} />}
      />
    </View>
  );
}
export default function HomeScreen() {
  const socket = io('https://bms-socket.onrender.com');
  const [unreadCount, setUnreadCount] = useState(3); // Giả sử có 3 tin nhắn chưa đọc
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // Thay thế biến currentIndex bằng useState
  const navigation = useNavigation();
  const flatListRef = useRef();
  const [userProfile, setUserProfile] = useState({}); // Add state for user profile

  const fetchCountNotifications = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(
      "https://bms-fs-api.azurewebsites.net/api/Notification/CountNotificationForUser",
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.isSuccess) {
      setUnreadCount(data.data);
    } else {
      console.log(data);
      Alert.alert("Failed to count notifications");
    }
  };

  useFocusEffect(
    useCallback( () => {
      fetchCountNotifications();

      handleConnectionSocket();

      return () => {
        socket.disconnect(); // Ngắt kết nối khi component unmount
      };
    }, [])
  );

  const handleConnectionSocket = async () => {
    socket.on('connect', () => {
      console.log('Connected to server with socket ID:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Kết nối tới room "shop" theo shopId
    const userId = await AsyncStorage.getItem("userId");
    console.log('Emitting join-user-topic for userId:', userId);
    socket.emit('join-user-topic', userId);

    // Lắng nghe sự kiện thông báo
    socket.on('order-notification', (message) => {
      fetchCountNotifications(); // Cập nhật lại số lượng thông báo chưa đọc
    });
  }

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await fetch(
          "https://bms-fs-api.azurewebsites.net/api/Account/my-profile",
          {
            headers: {
              accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (data.isSuccess) {
          setUserProfile(data.data); // Set user profile data
        } else {
          console.error("Error fetching user profile:", data.messages);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchUserProfile();
  }, []); // Empty dependency array to run once on mount

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://bms-fs-api.azurewebsites.net/api/Category?pageIndex=1&pageSize=5"
        );
        const data = await response.json();
        if (data.isSuccess) {
          setCategories(data.data.data); // Set the categories from the response
        } else {
          console.error("Error fetching categories:", data.messages);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Tự động cuộn ngang
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (flatListRef.current && featured.length > 0) {
        let newIndex = currentIndex + 1;
        if (newIndex >= featured.length) {
          newIndex = 0; // Quay lại đầu khi đến cuối danh sách
        }
        setCurrentIndex(newIndex);
        flatListRef.current.scrollToIndex({
          index: newIndex,
          animated: true,
        });
      }
    }, 3000); // 3 giây tự động cuộn một lần

    return () => clearInterval(intervalId); // Xóa interval khi component unmount
  }, [currentIndex, featured.length]); // Đảm bảo currentIndex và featured.length là dependency

  // Fetch featured data (existing logic)
  useEffect(() => {
    const fetchFeaturedData = async () => {
      try {
        const response = await fetch(
          "https://bms-fs-api.azurewebsites.net/api/ShopApplication?status=ACCEPTED&pageIndex=1&pageSize=5"
        );
        const data = await response.json();
        if (data.isSuccess) {
          const formattedData = data.data.data.map((item) => ({
            id: item.id,
            description: item.description,
            image: { uri: item.image || "default_image_url" },
            title: item.name,
            restaurants: [
              {
                id: item.id,
                name: item.name,
                image: { uri: item.image || "default_image_url" },
                description: item.description,
                stars: item.rate || 0,
                reviews: "N/A",
                category: "N/A",
                address: item.address,
              },
            ],
          }));

          // Prepend the custom image as the first item
          const firstImage = {
            id: "custom_image",
            image: {
              uri: "https://i.pinimg.com/736x/7d/8e/f1/7d8ef10c148ee4166d647e8a7ca19c06.jpg",
            },

            restaurants: [],
          };

          setFeatured([firstImage, ...formattedData]);
        } else {
          console.error("Error fetching featured data:", data.messages);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchFeaturedData();
  }, []);

  if (loadingCategories) {
    return <ActivityIndicator size="large" color="#00cc69" />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: StatusBar.currentHeight,
      }}
    >
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://i.pinimg.com/474x/dc/f3/93/dcf3934512c6f8f2a107005eca1ab9de.jpg",
          }}
          style={styles.profileImage}
        />

        <View>
          <Text style={styles.greetingText}>Good Morning 👋</Text>
          <Text
            style={styles.userName}
          >{`${userProfile.firstName} ${userProfile.lastName}`}</Text>
          {/* Display full name */}
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
            <View style={styles.iconWithBadge}>
              <Ionicons name="notifications-outline" size={24} color="black" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
            <Ionicons name="heart-outline" size={24} color="black" />
          </TouchableOpacity> */}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#888" />
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            onFocus={() => navigation.navigate("Search")} // Navigate to Search screen on focus
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Featured Images Slider */}
        <FlatList
          ref={flatListRef}
          data={featured}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.featuredImageContainer}>
              <Image style={styles.featuredImage} source={item.image} />
              <View style={styles.imageOverlay}>
                <Text style={styles.featuredTitle}>{item.title}</Text>
                <Text style={styles.featuredDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 30 }}
        />

        {/* Categories */}
        <Text style={styles.categories}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScrollView}
          contentContainerStyle={{ paddingHorizontal: 10, gap: 20 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => {
                navigation.navigate("CategoriesScreen", {
                  categoryId: category.id, // Pass the category ID
                });
              }}
              style={styles.categoryButton}
            >
              <Image
                source={category.image ? { uri: category.image } : null}
                style={styles.categoryImage}
              />
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Rows */}
        <Text style={styles.recommended}>Recommended</Text>
        {featured.map((item) => (
          <View key={item.id} style={{ marginTop: 10 }}>
            <FeaturedRow
              title={item.title}
              description={item.description}
              restaurants={item.restaurants || []}
            />
          </View>
        ))}
      </ScrollView>

      {/* Bottom Tab Navigator */}
      <BottomTabNavigator navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "ios" ? 50 : 10,
    marginTop: Platform.OS === "ios" ? 20 : 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  greetingText: {
    fontSize: Platform.OS === "ios" ? 16 : 14,
    color: "#888",
  },
  userName: {
    fontSize: Platform.OS === "ios" ? 20 : 18,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 2,
    marginHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: "#00cc69",
    padding: 10,
    borderRadius: 10,
  },
  featuredImageContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginVertical: 5,
  },
  featuredImage: {
    width: width - 30,
    height: 200,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  featuredTitle: {
    color: "red",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  featuredDescription: {
    color: "yellow",
    fontSize: 16,
  },
  categoryScrollView: {
    paddingHorizontal: Platform.OS === "ios" ? 20 : 15,
    paddingVertical: 10,
    height: 90,
  },
  categoryButton: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  restaurantCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 15,
    width: width - 60,
    alignSelf: "center",
  },
  restaurantImage: {
    width: "100%",
    height: 190,
  },
  restaurantInfo: {
    padding: 10,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  restaurantRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1,
  },
  starIcon: {
    color: "#ffcc00",
    marginRight: 5,
  },
  ratingText: {
    fontSize: 14,
    color: "#ffcc00",
    marginRight: 5,
  },
  reviewsText: {
    fontSize: 12,
    color: "#888",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1,
  },
  locationText: {
    fontSize: 12,
    color: "#888",
    marginLeft: 5,
  },
  featuredRowContainer: {
    marginVertical: 1,
    paddingHorizontal: 20,
  },
  featuredHeaderContainer: {
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  seeAllText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  featuredContentContainer: {
    paddingHorizontal: 10,
  },
  categories: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
    padding: 10,
    borderRadius: 1,
    marginVertical: 1,
  },
  recommended: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
    padding: 10,
    borderRadius: 1,
    marginVertical: 1,
  },
  iconWithBadge: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "red",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
