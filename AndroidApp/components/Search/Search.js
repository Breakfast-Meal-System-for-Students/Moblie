import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Search({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const pageSize = 2; // Number of items per page

  useEffect(() => {
    if (searchQuery.length > 0) {
      fetchProducts(true);
    }
  }, [searchQuery]);

  const fetchProducts = async (isNewSearch = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://bms-fs-api.azurewebsites.net/api/Product?pageIndex=${pageIndex}&pageSize=${pageSize}&search=${encodeURIComponent(
          searchQuery
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      const json = await response.json();
      if (json.isSuccess) {
        const fetchedProducts = json.data.data;
        setIsLastPage(json.data.isLastPage);
      } else {
        setError("Failed to load data");
        setProducts([]);
      }
    } catch (err) {
      setError("An error occurred while fetching data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    setIsLastPage(false); // Reset pagination
    setPageIndex(1);
  };

  const handleNextPage = () => {
    if (!loading && !isLastPage) {
      setPageIndex((prevPage) => prevPage + 1);
      fetchProducts();
    }
  };

  const handlePreviousPage = () => {
    if (!loading && pageIndex > 1) {
      setPageIndex((prevPage) => prevPage - 1);
      fetchProducts();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header View */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <TouchableOpacity
          onPress={() => {}}
          style={styles.settingsButton}
        ></TouchableOpacity>
      </View>
      <View>
        <TextInput
          style={styles.searchBar}
          onChangeText={handleSearch}
          value={searchQuery}
          placeholder="Search here..."
        />
      </View>
      {loading && pageIndex === 1 ? (
        <ActivityIndicator size="large" color="#00cc69" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.itemContainer}>
                <Image
                  source={{ uri: item.images[0].url }}
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.itemText}>
                    {item.name} - ${item.price.toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyMessage}>No results found</Text>
            }
          />
          {/* Pagination Controls */}
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                pageIndex === 1 && styles.disabledButton,
              ]}
              onPress={handlePreviousPage}
              disabled={pageIndex === 1}
            >
              <Text style={styles.paginationText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.pageIndicator}>{`Page ${pageIndex}`}</Text>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                isLastPage && styles.disabledButton,
              ]}
              onPress={handleNextPage}
              disabled={isLastPage}
            >
              <Text style={styles.paginationText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  searchBar: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingLeft: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  itemText: {
    fontSize: 18,
    paddingHorizontal: 10,
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "grey",
  },
  error: {
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#00cc69",
    paddingVertical: Platform.OS === "ios" ? 15 : 10,
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 14,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  paginationButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  paginationText: {
    color: "#fff",
    fontSize: 16,
  },
  pageIndicator: {
    fontSize: 16,
    marginHorizontal: 10,
  },
});
