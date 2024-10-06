import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMapPin, faStar } from "@fortawesome/free-solid-svg-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomTabNavigator from "../BottomNavigationBar/BottomNavigationBar";

const { width } = Dimensions.get("window");

function RestaurantCard({ item }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Shop", { id: item.id })}
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

function FeaturedRow({ title, description, restaurants }) {
  return (
    <View>
      <View style={styles.featuredHeaderContainer}>
        <Text style={styles.seeAllText}>{title}</Text>
      </View>
      {/* Sử dụng FlatList với horizontal để cuộn ngang */}
      <FlatList
        data={restaurants}
        horizontal // Cho phép cuộn ngang
        showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 15 }} // Đảm bảo padding bên trong danh sách
        renderItem={({ item }) => (
          <RestaurantCard item={item} /> // Hiển thị từng thẻ nhà hàng
        )}
      />
    </View>
  );
}

export default function HomeScreen() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // Thay thế biến currentIndex bằng useState
  const navigation = useNavigation();
  const flatListRef = useRef();

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
          "https://bms-fs-api.azurewebsites.net/api/ShopApplication?status=PENDING&pageIndex=1&pageSize=5"
        );
        const data = await response.json();
        if (data.isSuccess) {
          const formattedData = data.data.data.map((item) => ({
            id: item.id,
            description: item.description,
            image: { uri: item.image || "default_image_url" },
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
          setFeatured(formattedData);
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
            uri: "https://i.pinimg.com/564x/cf/f7/4e/cff74e044fe8eb2918424b53297bce18.jpg",
          }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.greetingText}>Good Morning 👋</Text>
          <Text style={styles.userName}>Andrew Ainsley</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          <Ionicons name="heart-outline" size={24} color="black" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#888" />
          <TextInput placeholder="Search" style={styles.searchInput} />
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
        {featured.map((item) => (
          <View key={item.id} style={{ marginTop: 20 }}>
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
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "ios" ? 50 : 10, // Thêm khoảng cách cho iOS
    marginTop: Platform.OS === "ios" ? 20 : 10, // Tùy chỉnh khoảng cách trên iOS và Android
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  greetingText: {
    fontSize: Platform.OS === "ios" ? 16 : 14, // Kích thước lớn hơn trên iOS
    color: "#888",
    textAlign: Platform.OS === "ios" ? "center" : "left", // Căn giữa trên iOS
  },
  userName: {
    fontSize: Platform.OS === "ios" ? 20 : 18, // Kích thước lớn hơn trên iOS
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
    width: width - 10,
    height: 190,
    borderRadius: 20,
    marginHorizontal: 10,
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
    paddingHorizontal: 1,
    paddingVertical: 1,
    width: width - 30,
    height: 90,
  },
  categoryButton: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
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
    marginRight: 19,
    width: 365,
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
    marginTop: 5,
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
    marginTop: 5,
  },
  locationText: {
    fontSize: 12,
    color: "#888",
    marginLeft: 5,
  },
});
