import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const SearchSchoolScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  // Sample schools with detailed information
  const schools = [
    {
      id: "1",
      name: "Greenwood High School",
      location: "New York",
      type: "High School",
    },
    {
      id: "2",
      name: "Riverdale Elementary",
      location: "Los Angeles",
      type: "Elementary School",
    },
    {
      id: "3",
      name: "Maple Leaf Academy",
      location: "Chicago",
      type: "Middle School",
    },
    {
      id: "4",
      name: "Sunrise Secondary School",
      location: "Houston",
      type: "High School",
    },
    {
      id: "5",
      name: "Blue Valley High",
      location: "Boston",
      type: "High School",
    },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setResults([]);
    } else {
      const filteredData = schools.filter(
        (school) =>
          school.name.toLowerCase().includes(query.toLowerCase()) ||
          school.location.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredData);
    }
  };

  const renderSchoolItem = ({ item }) => (
    <TouchableOpacity style={styles.resultItem}>
      <View style={styles.schoolInfo}>
        <View style={styles.nameContainer}>
          <Ionicons name="school-outline" size={24} color="#2196F3" />
          <Text style={styles.schoolName}>{item.name}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="book-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.type}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Schools</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Search by school name, location..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderSchoolItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          {searchQuery.length > 0 ? (
            <>
              <Ionicons name="search" size={48} color="#ccc" />
              <Text style={styles.noResultsText}>
                No matching schools found
              </Text>
              <Text style={styles.suggestionText}>
                Try searching with different keywords
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="school" size={48} color="#ccc" />
              <Text style={styles.suggestionText}>
                Enter school name or location to search
              </Text>
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 25,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#00cc69",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f3f4",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
    marginRight: 8,
  },
  listContainer: {
    padding: 16,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  schoolInfo: {
    flex: 1,
    marginRight: 12,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  detailsContainer: {
    marginLeft: 32,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  noResultsText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default SearchSchoolScreen;
