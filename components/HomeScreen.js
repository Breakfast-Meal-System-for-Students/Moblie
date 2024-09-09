import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
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
  faGlassMartini,
  faHamburger,
  faBirthdayCake,
  faCookieBite,
  faTh,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import BottomTabNavigator from "./BottomTabNavigator";

const { width } = Dimensions.get("window");

const categories = [
  { id: 1, name: "Drinks", icon: faGlassMartini },
  { id: 2, name: "Food", icon: faHamburger },
  { id: 3, name: "Cake", icon: faBirthdayCake },
  { id: 4, name: "Snack", icon: faCookieBite },
  { id: 5, name: "See All", icon: faTh },
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
        lng: 38.2145602,
        lat: -85.5324269,
        address: "434 Second Street",
        stars: 4,
        reviews: "4.4k",
        category: "Fast Food",
        dishes: [
          {
            id: 1,
            name: "Pizza",
            description: "Cheezy garlic pizza",
            price: 10,
            image: {
              uri: "https://i.pinimg.com/236x/b6/94/0e/b6940e530fa87fdf8f4e9cdf5ccafc36.jpg",
            },
          },
        ],
      },
      {
        id: 2,
        name: "Drink Johns",
        image: {
          uri: "https://i.pinimg.com/236x/41/b6/99/41b6994f16222eb7c140a6d3f67729ba.jpg",
        },
        description: "Hot and spicy drinks",
        lng: 38.2145602,
        lat: -85.5324269,
        address: "434 Second Street",
        stars: 4,
        reviews: "4.4k",
        category: "Drinks",
        dishes: [
          {
            id: 1,
            name: "Spicy Drink",
            description: "Spicy and refreshing",
            price: 5,
            image: {
              uri: "https://i.pinimg.com/236x/22/84/6e/22846ecb774c5c4c1c1d5c8e767d3d8a.jpg",
            },
          },
        ],
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
        lng: 38.2145602,
        lat: -85.5324269,
        address: "567 Burger Lane",
        stars: 4.2,
        reviews: "3.2k",
        category: "Burgers",
        dishes: [
          {
            id: 2,
            name: "Cheeseburger",
            description: "Juicy cheeseburger with fresh toppings",
            price: 8,
            image: {
              uri: "https://i.pinimg.com/236x/f5/20/10/f52010f1acafbe3969cc567c41d44865.jpg",
            },
          },
        ],
      },
      {
        id: 2,
        name: "Taco Fiesta",
        image: {
          uri: "https://i.pinimg.com/236x/f5/20/10/f52010f1acafbe3969cc567c41d44865.jpg",
        },
        description: "Spicy tacos and more",
        lng: 38.2145602,
        lat: -85.5324269,
        address: "789 Taco Street",
        stars: 4.7,
        reviews: "6k",
        category: "Tacos",
        dishes: [
          {
            id: 1,
            name: "Spicy Tacos",
            description: "Tacos with a spicy kick",
            price: 10,
            image: {
              uri: "https://i.pinimg.com/236x/22/84/6e/22846ecb774c5c4c1c1d5c8e767d3d8a.jpg",
            },
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Taco Fiesta",
    description: "Spicy tacos and more",
    image: {
      uri: "https://i.pinimg.com/236x/22/84/6e/22846ecb774c5c4c1c1d5c8e767d3d8a.jpg",
    },
    restaurants: [
      {
        id: 1,
        name: "Taco Fiesta",
        image: {
          uri: "https://i.pinimg.com/236x/f5/20/10/f52010f1acafbe3969cc567c41d44865.jpg",
        },
        description: "Spicy tacos and more",
        lng: 38.2145602,
        lat: -85.5324269,
        address: "789 Taco Street",
        stars: 4.7,
        reviews: "6k",
        category: "Tacos",
        dishes: [
          {
            id: 1,
            name: "Spicy Tacos",
            description: "Tacos with a spicy kick",
            price: 10,
            image: {
              uri: "https://i.pinimg.com/236x/22/84/6e/22846ecb774c5c4c1c1d5c8e767d3d8a.jpg",
            },
          },
        ],
      },
    ],
  },
];

function RestaurantCard({ item }) {
  return (
    <TouchableWithoutFeedback>
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
    </TouchableWithoutFeedback>
  );
}

// FeaturedRow Component
function FeaturedRow({ title, description, restaurants }) {
  return (
    <View>
      <View style={styles.featuredHeaderContainer}>
        {/* Hiển thị tiêu đề động từ prop "title" */}
        <Text style={styles.featuredTitle}>{title}</Text>

        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
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

// HomeScreen Component
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
    }, 3000); // Auto-scroll every 3 seconds

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

      {/* Featured Images */}
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
              {/* Nếu muốn hiển thị "Hot and Spicy", bao nó trong thẻ Text */}

              <Text style={styles.featuredTitle}>{item.title}</Text>
              <Text style={styles.featuredDescription}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <FontAwesomeIcon icon={faSearch} style={styles.searchIcon} />
          <TextInput placeholder="Restaurants" style={{ flex: 1 }} />
        </View>
        <View style={styles.locationContainer}>
          <FontAwesomeIcon
            icon={faMapPin}
            size={20}
            style={{ color: "green" }}
          />
          <Text style={styles.locationText}>Hồ Chí Minh</Text>
        </View>

        <FontAwesomeIcon
          icon={faSlidersH}
          size={25}
          style={styles.filterIcon}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScrollView}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setActiveCategory(category.id)}
            style={[
              styles.categoryButton,
              activeCategory === category.id
                ? styles.activeCategory
                : styles.inactiveCategory,
            ]}
          >
            <FontAwesomeIcon
              icon={category.icon}
              style={styles.categoryImage}
            />
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

      <BottomTabNavigator navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  locationText: {
    color: "gray",
    marginLeft: 20,
  },
  categoryScrollView: {
    marginVertical: 20,
  },
  categoryButton: {
    alignItems: "center",
    marginHorizontal: 10,
    padding: 13,
    marginBottom: 70,
    borderRadius: 70,
    width: 70,
    height: 70,
  },
  activeCategory: {
    backgroundColor: "#00CC33",
  },
  inactiveCategory: {
    backgroundColor: "#FFFFFF",
  },
  categoryImage: {
    width: 50,
    height: 50,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 12,
  },
  featuredScrollContainer: {
    paddingBottom: 30,
  },
  featuredHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  featuredTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#FFFFFF",
  },
  seeAllText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  leftSection: {
    flexDirection: "column",
  },
  featuredTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  featuredDescription: {
    color: "gray",
    fontSize: 14,
  },
  seeAllText: {
    color: "#000",
    fontWeight: "600",
  },
  restaurantCard: {
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginRight: 10,
    overflow: "hidden",
  },
  restaurantImage: {
    width: 200,
    height: 120,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  restaurantInfo: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  restaurantRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  starIcon: {
    marginRight: 5,
    color: "gold",
  },
  ratingText: {
    fontSize: 14,
    marginRight: 5,
  },
  reviewsText: {
    fontSize: 14,
    color: "gray",
  },
  categoryText: {
    fontSize: 14,
    color: "gray",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  locationText: {
    marginLeft: 5,
    fontSize: 14,
  },
  featuredImageContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  featuredImage: {
    width: width,
    height: 200,
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
  },
  featuredDescription: {
    color: "white",
    fontSize: 16,
  },
});
