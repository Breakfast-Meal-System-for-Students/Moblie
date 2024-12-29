import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

// Debounce function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const { width } = Dimensions.get("window");

const FavouritesMain = () => {
  const [favouritesData, setFavouritesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [shopName, setShopName] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(6);
  const [hasMoreData, setHasMoreData] = useState(true);

  // Fetch the list of favourites from the API
  const fetchFavouritesData = async (reset = false) => {
    setLoading(reset);
    setRefreshing(!reset);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `https://bms-fs-api.azurewebsites.net/api/Favourite/GetFavouriteList?pageIndex=${pageIndex}&pageSize=${pageSize}&shopName=${shopName}`,
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
        setFavouritesData(prev => 
          reset ? data.data.data : [...prev, ...data.data.data]
        );
        setHasMoreData(data.data.data.length === pageSize);
      } else {
        setError(data.messages[0]?.content || "Failed to fetch favourites data");
      }
    } catch (error) {
      setError("An error occurred while fetching favourites data.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Debounced fetch
  const debouncedFetchFavouritesData = debounce(fetchFavouritesData, 500);

  useEffect(() => {
    debouncedFetchFavouritesData(true);
  }, [shopName]);

  const onRefresh = useCallback(() => {
    setPageIndex(1);
    fetchFavouritesData(true);
  }, [shopName]);

  const loadMoreData = () => {
    if (hasMoreData && !loading) {
      setPageIndex(prev => prev + 1);
      fetchFavouritesData();
    }
  };

  const renderFavouriteItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.favouriteItem}
      activeOpacity={0.7}
    >
      <View style={styles.favouriteItemContent}>
        <View style={styles.favouriteDetails}>
          <Text style={styles.shopName}>🏬 {item.shopName || "Unnamed Shop"}</Text>
          <Text style={styles.favouriteId}>⭐ ID: {item.id}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteFavourite(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Handle the deletion of a favourite
  const handleDeleteFavourite = async (favouriteId) => {
    Alert.alert(
      "Remove Favourite",
      "Are you sure you want to remove this favourite shop?",
      [
        { 
          text: "Cancel", 
          style: "cancel" 
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("userToken");
              const response = await fetch(
                `https://bms-fs-api.azurewebsites.net/api/Favourite/DeleteFavourite/${favouriteId}`,
                {
                  method: "GET",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              const data = await response.json();
              if (data.isSuccess) {
                Alert.alert("Success", "Favourite shop removed successfully.");
                fetchFavouritesData(true);
              } else {
                Alert.alert("Error", "Failed to remove favourite shop.");
              }
            } catch (error) {
              Alert.alert("Error", "An error occurred while removing favourite.");
              console.error("Delete error:", error);
            }
          },
        },
      ]
    );
  };

  // Handle adding a new favourite
  const handleAddFavourite = async (shopId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `https://bms-fs-api.azurewebsites.net/api/Favourite/AddFavourite`,
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: new URLSearchParams({ shopId }), // Add shopId as form-data
        }
      );

      const data = await response.json();
      if (data.isSuccess) {
        Alert.alert("Success", "Shop added to favourites!");
        fetchFavouritesData(true);  // Refresh the list after adding
      } else {
        Alert.alert("Error", "Failed to add shop to favourites.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while adding to favourites.");
      console.error("Add error:", error);
    }
  };

  if (loading && favouritesData.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00cc69" />
        <Text style={styles.loadingText}>Loading favourites...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons 
            name="search-outline" 
            size={20} 
            color="#888" 
            style={styles.searchIcon} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by shop name..."
            placeholderTextColor="#888"
            value={shopName}
            onChangeText={setShopName}
            clearButtonMode="while-editing"
          />
        </View>
      </View>
      
      <FlatList
        data={favouritesData}
        renderItem={renderFavouriteItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No favourites found.</Text>
        }
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00cc69']}
            tintColor="#00cc69"
          />
        }
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loading && favouritesData.length > 0 ? (
            <ActivityIndicator size="small" color="#00cc69" />
          ) : null
        }
      />

      {/* Button to add a new favourite shop */}
      <TouchableOpacity 
        style={styles.addFavouriteButton}
        onPress={() => handleAddFavourite("b052c831-894e-4463-1ce9-08dd07d84896")}  // Example shopId
      >
        <Text style={styles.addFavouriteText}>Add to Favourites</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    backgroundColor: "#00cc69",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loadingText: {
    marginTop: 10,
    color: "#555",
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  favouriteItem: {
    marginVertical: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favouriteItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  favouriteDetails: {
    flex: 1,
    marginRight: 10,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  favouriteId: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    backgroundColor: "#FF5252",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 50,
    fontSize: 16,
  },
  addFavouriteButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 12,
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  addFavouriteText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default FavouritesMain;
