import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const CategoriesScreen = ({ navigation }) => {
  // Add navigation prop
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();
  const { categoryId } = route.params; // Get the category ID from the route parameters

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `https://bms-fs-api.azurewebsites.net/api/RegisterCategory/all-product-by-category-id?categoryId=${categoryId}&pageSize=4`,
        {
          headers: {
            Accept: "*/*",
          },
        }
      );
      if (response.data.isSuccess) {
        setProducts(response.data.data.data); // Set the products from the response
      } else {
        setError("Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("An error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]); // Fetch products when categoryId changes

  if (loading) {
    return <ActivityIndicator size="large" color="#00cc69" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const renderProductItem = ({ item }) => (
    <View style={styles.productContainer}>
      {item.product.images.length > 0 && (
        <Image
          source={{ uri: item.product.images[0] }}
          style={styles.productImage}
        />
      )}
      <Text style={styles.productName}>{item.product.name}</Text>
      <Text style={styles.productDescription}>{item.product.description}</Text>
      <Text style={styles.productPrice}>${item.product.price.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#003366",
  },
  productList: {
    paddingBottom: 20,
  },
  productContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 15,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 14,
    color: "#555",
  },
  productPrice: {
    fontSize: 14,
    color: "#00cc69",
    fontWeight: "bold",
  },
});

export default CategoriesScreen;
