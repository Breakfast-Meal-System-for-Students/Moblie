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
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faSearch,
  faMapPin,
  faSlidersH,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomTabNavigator from "./BottomNavigationBar";

const { width } = Dimensions.get("window");

const categories = [
  {
    id: 1,
    name: "Drinks",
    icon: {
      uri: "https://i.pinimg.com/564x/35/f5/2a/35f52a1085330e295817560f37a4c129.jpg",
    },
  },
  {
    id: 2,
    name: "Food",
    icon: {
      uri: "https://i.pinimg.com/564x/94/08/4b/94084ba112450fcd46bacfa59ad33340.jpg",
    },
  },
  {
    id: 3,
    name: "Cake",
    icon: {
      uri: "https://i.pinimg.com/564x/2b/55/4b/2b554b83d60ffce10f163f9f666e509b.jpg",
    },
  },
  {
    id: 4,
    name: "Snack",
    icon: {
      uri: "https://i.pinimg.com/564x/e8/2f/69/e82f69e91daceea8841c43a3a9261c1a.jpg",
    },
  },
  {
    id: 5,
    name: "See All",
    icon: {
      uri: "https://i.pinimg.com/564x/38/7d/d7/387dd73b1b30c6f8b440d31422a7d972.jpg",
    },
  },
];

const featured = [
  {
    id: 1,
    title: "Hot and Spicy",
    description: "Soft and tender fried chicken",
    image: {
      uri: "https://i.pinimg.com/236x/41/b6/99/41b6994f16222eb7c140a6d3f67729ba.jpg",
    },
    restaurants: [
      {
        id: 1,
        name: "Papa Johns",
        image: {
          uri: "https://i.pinimg.com/236x/41/b6/99/41b6994f16222eb7c140a6d3f67729ba.jpg",
        },
        description: "Hot and spicy pizzas",
        stars: 4,
        reviews: "4.4k",
        category: "Fast Food",
        address: "434 Second Street",
      },
      {
        id: 2,
        name: "Drink Johns",
        image: {
          uri: "https://i.pinimg.com/236x/41/b6/99/41b6994f16222eb7c140a6d3f67729ba.jpg",
        },
        description: "Hot and spicy drinks",
        stars: 4,
        reviews: "4.4k",
        category: "Drinks",
        address: "434 Second Street",
      },
    ],
  },
  {
    id: 2,
    title: "Best Deals",
    description: "Exciting offers on your favorite foods",
    image: {
      uri: "https://i.pinimg.com/236x/f5/20/10/f52010f1acafbe3969cc567c41d44865.jpg",
    },
    restaurants: [
      {
        id: 1,
        name: "Burger Haven",
        image: {
          uri: "https://i.pinimg.com/236x/d2/88/ea/d288ead43cacf7229a301b1bbaf09495.jpg",
        },
        description: "Delicious burgers at great prices",
        stars: 4.2,
        reviews: "3.2k",
        category: "Burgers",
        address: "567 Burger Lane",
      },
      {
        id: 2,
        name: "Taco Fiesta",
        image: {
          uri: "https://i.pinimg.com/236x/f5/20/10/f52010f1acafbe3969cc567c41d44865.jpg",
        },
        description: "Spicy tacos and more",
        stars: 4.7,
        reviews: "6k",
        category: "Tacos",
        address: "789 Taco Street",
      },
    ],
  },
];

function RestaurantCard({ item }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Shop")}>
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        style={{ overflow: "visible", paddingVertical: 16 }}
      >
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} item={restaurant} />
        ))}
      </ScrollView>
    </View>
  );
}

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();
  const flatListRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === featured.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: activeIndex,
        animated: true,
      });
    }
  }, [activeIndex]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />

      {/* Phần Header */}
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
              <Text style={styles.featuredDescription}>{item.description}</Text>
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
              switch (category.name) {
                case "Drinks":
                  navigation.navigate("Drink"); // Sửa từ "DrinkScreen" thành "Drink"
                  break;
                case "Food":
                  navigation.navigate("Food"); // Sửa từ "FoodScreen" thành "Food"
                  break;
                case "Cake":
                  navigation.navigate("Cake"); // Sửa từ "CakeScreen" thành "Cake"
                  break;
                case "Snack":
                  navigation.navigate("Snack"); // Sửa từ "SnackScreen" thành "Snack"
                  break;
                case "See All":
                  navigation.navigate("See All"); // Sửa từ "SeeAllScreen" thành "See All"
                  break;
                default:
                  setActiveCategory(category.id);
                  break;
              }
            }}
            style={[
              styles.categoryButton,
              activeCategory === category.id
                ? styles.activeCategory
                : styles.inactiveCategory,
            ]}
          >
            <Image source={category.icon} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Featured Rows */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.featuredScrollContainer}
      >
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
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  greetingText: {
    fontSize: 14,
    color: "#888",
  },
  userName: {
    fontSize: 18,
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
    marginBottom: 20,
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
    marginVertical: 75,
  },
  featuredImage: {
    width: width - 10,
    height: 150,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  featuredTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  featuredDescription: {
    color: "white",
    fontSize: 16,
  },
  categoryScrollView: {
    paddingHorizontal: 10,
    paddingVertical: 19,
    width: width - 30,
    height: 300,
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
  activeCategory: {
    borderColor: "#00cc69",
    borderWidth: 2,
    borderRadius: 50,
    padding: 5,
  },
  inactiveCategory: {
    borderColor: "transparent",
    borderWidth: 2,
    borderRadius: 50,
    padding: 5,
  },
  restaurantCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 15,
    width: 250,
  },
  restaurantImage: {
    width: "100%",
    height: 150,
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
  categoryText: {
    fontSize: 12,
    fontWeight: "bold",
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
  featuredScrollContainer: {
    paddingHorizontal: 15,
  },
});
