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
import { io } from "socket.io-client";

const { width } = Dimensions.get("window");

function RestaurantCard({ item }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Shop", { id: item.id, orderIdSuccess: null })
      }
    >
      <View style={styles.restaurantCard}>
        <Image style={styles.restaurantImage} source={item.image} />
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <View style={styles.restaurantRatingContainer}>
            <FontAwesomeIcon icon={faStar} style={styles.starIcon} size={15} />
            <Text style={styles.ratingText}>{Math.round(item.stars)}</Text>

            <Text style={styles.categoryText}>{item.category}</Text>
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
  const [unreadCount, setUnreadCount] = useState(3); // Giả sử có 3 tin nhắn chưa đọc
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // Thay thế biến currentIndex bằng useState
  const navigation = useNavigation();
  const flatListRef = useRef();
  const [userProfile, setUserProfile] = useState({}); // Add state for user profile
  const [socket, setSocket] = useState(null);

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
    useCallback(() => {
      fetchCountNotifications();

      handleConnectionSocket();

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }, [])
  );

  const handleConnectionSocket = async () => {
    const socket = io("https://bms-socket.onrender.com");
    setSocket(socket);

    socket.on("connect", () => {
      console.log("Connected to server with socket ID:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Kết nối tới room "shop" theo shopId
    const userId = await AsyncStorage.getItem("userId");
    console.log("Emitting join-user-topic for userId:", userId);
    socket.emit("join-user-topic", userId);

    // Lắng nghe sự kiện thông báo
    socket.on("order-notification", (message) => {
      fetchCountNotifications(); // Cập nhật lại số lượng thông báo chưa đọc
    });
  };

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
          "https://bms-fs-api.azurewebsites.net/api/Category?pageIndex=1&pageSize=20"
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
        const token = await AsyncStorage.getItem("userToken");
        const response = await fetch(
          `https://bms-fs-api.azurewebsites.net/api/Shop/GetAllShopForMobile?pageIndex=1&pageSize=10&status=ACCEPTED&search=&isDesc=true`,
          {
            method: "GET",
            headers: {
              accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          }
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
                stars: Math.round(item.rate) || 0,
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
            title: "Welcome to BMS",
            description: "Breakfast meal system for students",
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
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
          >
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
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#666" />
            <TextInput
              placeholder="Search for food, restaurants..."
              placeholderTextColor="#999"
              style={styles.searchInput}
              onFocus={() => navigation.navigate("Search")}
            />
          </View>
        </View>

        {/* Featured Images Slider */}
        <View style={styles.sliderContainer}>
          <FlatList
            ref={flatListRef}
            data={featured}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  item.id != "custom_image"
                    ? navigation.navigate("Shop", {
                        id: item.id,
                        orderIdSuccess: null,
                      })
                    : null
                }
                disabled={!item.id}
                activeOpacity={item.id ? 0.8 : 1}
              >
                <View style={styles.featuredImageContainer}>
                  <Image
                    style={styles.featuredImage}
                    source={item.image}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay}>
                    <View style={styles.overlayContent}>
                      <Text style={styles.featuredTitle}>{item.title}</Text>
                      <Text style={styles.featuredDescription}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

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
              {category.image && (
                <Image
                  source={category.image ? { uri: category.image } : null}
                  style={styles.categoryImage}
                />
              )}
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
    padding: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },

  filterButton: {
    backgroundColor: "#00cc69",
    padding: 10,
    borderRadius: 10,
  },
  featuredImageContainer: {
    position: "relative",
    width: 350,
    height: 200,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 10,
    padding: 15,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  featuredDescription: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    opacity: 0.9,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  sliderContainer: {
    marginBottom: 24,
  },
  featuredImageContainer: {
    width: width - 32,
    height: 200,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "flex-end",
    padding: 16,
  },
  overlayContent: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 12,
    borderRadius: 8,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
});
