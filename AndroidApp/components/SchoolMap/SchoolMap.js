import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const SchoolMap = ({ route, navigation }) => {
  const { shops, school } = route.params; // Get shops and school data from route params

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: school.lat, // Use school's latitude
          longitude: school.lng, // Use school's longitude
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {/* Marker for the school with logo */}
        <Marker
          coordinate={{ latitude: school.lat, longitude: school.lng }}
          title={school.name}
          description={school.address} // Assuming school has an address property
        >
          <Image
            source={{
              uri: "https://png.pngtree.com/png-vector/20211011/ourmid/pngtree-school-logo-png-image_3977360.png",
            }} // Replace with the actual URL of the school logo
            style={styles.schoolLogo}
          />
        </Marker>

        {/* Markers for nearby shops with images */}
        {shops.map((shop) => (
          <Marker
            key={shop.id}
            coordinate={{ latitude: shop.lat, longitude: shop.lng }}
            title={shop.name}
            description={shop.description}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Shop", {
                  id: shop.id, // Assuming shop has an id property
                  orderIdSuccess: null,
                })
              }
            >
              <Image
                source={{ uri: shop.image }} // Assuming shop has an image property
                style={styles.shopImage}
              />
            </TouchableOpacity>
          </Marker>
        ))}
      </MapView>

      {/* Shop List */}
      <View style={styles.shopListContainer}>
        {shops.length > 0 ? (
          <FlatList
            data={shops}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.shopItem}
                onPress={() =>
                  navigation.navigate("Shop", {
                    id: item.id, // Navigate to Shop with the shop ID
                    orderIdSuccess: null,
                  })
                }
              >
                <Image
                  source={{ uri: item.image }} // Assuming shop has an image property
                  style={styles.shopImageList}
                />
                <View style={styles.shopInfo}>
                  <Text style={styles.shopName}>{item.name}</Text>
                  <Text style={styles.shopDescription}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.noShopsContainer}>
            <Text style={styles.noShopsText}>No shop found</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: "70%", // Map takes 70% of the height
  },
  schoolLogo: {
    width: 40,
    height: 40,
    borderRadius: 20, // Optional: make it circular
  },
  shopImage: {
    width: 30,
    height: 30,
    borderRadius: 15, // Optional: make it circular
  },
  shopListContainer: {
    height: "30%", // Shop list takes 30% of the height
    backgroundColor: "#fff",
    padding: 10,
  },
  shopItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  shopImageList: {
    width: 50,
    height: 50,
    borderRadius: 25, // Optional: make it circular
    marginRight: 10,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  shopDescription: {
    fontSize: 14,
    color: "#666",
  },
  noShopsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noShopsText: {
    fontSize: 16,
    color: "red", // Red color for the message
  },
});

export default SchoolMap;
