import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Dimensions,
  Image,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const ViewListCart = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const navigation = useNavigation();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const fetchCarts = async (page = pageIndex) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert("Notice", "Please login again");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "https://bms-fs-api.azurewebsites.net/api/Cart/GetAllCartForUser",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { pageIndex: page, pageSize },
        }
      );

      if (response.data.isSuccess) {
        const { data, totalItems, totalPages } = response.data.data;
        setCarts(data);
        setTotalItems(totalItems);
        setTotalPages(totalPages);
      } else {
        Alert.alert("Error", "Unable to load cart list");
      }
    } catch (error) {
      console.error("Error:", error.message);
      Alert.alert("Error", "An error occurred while loading data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, [pageIndex]);

  const onRefresh = () => {
    setRefreshing(true);
    setPageIndex(1);
    fetchCarts(1);
  };

  const loadMoreCarts = () => {
    if (pageIndex < totalPages) {
      const nextPage = pageIndex + 1;
      setPageIndex(nextPage);
      fetchCarts(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 1) {
      const previousPage = pageIndex - 1;
      setPageIndex(previousPage);
      fetchCarts(previousPage);
    }
  };

  const renderProductItem = ({ item: detail }) => (
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        <Text style={styles.productName} numberOfLines={1}>
          {detail.name}
        </Text>
        <Text style={styles.productQuantity}>x{detail.quantity}</Text>
      </View>
      <Text style={styles.productPrice}>{formatCurrency(detail.price)}</Text>
    </View>
  );

  const renderCartItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cartContainer}
      onPress={async () => {
        await AsyncStorage.setItem("shopId", item.shopId);
        navigation.navigate("Cart", { id: item.shopId });
      }}
    >
      <View style={styles.cartHeader}>
        <View style={styles.shopInfo}>
          <Ionicons name="storefront" size={20} color="#00cc69" />
          <Text style={styles.shopName} numberOfLines={1}>
            {item.shopName}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>

      {item.shopImage && (
        <Image source={{ uri: item.shopImage }} style={styles.shopImage} />
      )}

      <FlatList
        data={item.cartDetails}
        keyExtractor={(detail) => detail.id}
        renderItem={renderProductItem}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.cartFooter}>
        <Text style={styles.totalItems}>
          {item.cartDetails.length}{" "}
          {item.cartDetails.length === 1 ? "item" : "items"}
        </Text>
        <Text style={styles.totalPrice}>
          Total:{" "}
          {formatCurrency(
            item.cartDetails.reduce(
              (sum, detail) => sum + detail.price * detail.quantity,
              0
            )
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={styles.pageButton}
        onPress={handlePreviousPage}
        disabled={pageIndex <= 1}
      >
        <Text style={styles.pageButtonText}>Previous</Text>
      </TouchableOpacity>
      <Text style={styles.pageText}>Page {pageIndex}</Text>
      <TouchableOpacity
        style={styles.pageButton}
        onPress={loadMoreCarts}
        disabled={pageIndex >= totalPages}
      >
        <Text style={styles.pageButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.shopButtonText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Your Cart</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00cc69" />
        </View>
      ) : (
        <>
          <FlatList
            data={carts}
            keyExtractor={(item) => item.id}
            renderItem={renderCartItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={ListEmptyComponent}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.cartSeparator} />}
            onEndReached={loadMoreCarts}
            onEndReachedThreshold={0.5}
          />
          {totalItems > 0 && renderPagination()}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#00cc69",
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  pageButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
  },
  pageButtonText: {
    color: "white",
  },
  pageText: {
    fontSize: 16,
    alignSelf: "center",
  },
  listContent: {
    padding: 12,
    flexGrow: 1,
  },
  cartContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  shopInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  productCard: {
    paddingVertical: 8,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: {
    fontSize: 15,
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  productQuantity: {
    fontSize: 14,
    color: "#666",
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "600",
    color: "#00cc69",
    marginTop: 4,
  },
  cartFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalItems: {
    fontSize: 14,
    color: "#666",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00cc69",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 4,
  },
  cartSeparator: {
    height: 12,
  },
  loader: {
    marginVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  shopImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginVertical: 8,
  },
});

export default ViewListCart;
