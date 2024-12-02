import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const MapScreen = () => {
  const navigation = useNavigation();
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [search, setSearch] = useState("");
  const [route, setRoute] = useState([]);
  const [duration, setDuration] = useState("");
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [distance, setDistance] = useState("");

  const handleGetRoute = async () => {
    try {
      // Call API from A to B
      const responseAB = await fetch(
        "https://routes.gomaps.pro/directions/v2:computeRoutes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": "AlzaSyMLWSaQgJYCT2ittsrZkpWQvDoV_AuPRYE", // Replace with your API Key
          },
          body: JSON.stringify({
            origin: {
              vehicleStopover: false,
              sideOfRoad: false,
              address: startAddress,
            },
            destination: {
              vehicleStopover: false,
              sideOfRoad: false,
              address: endAddress,
            },
            routingPreference: "ROUTING_PREFERENCE_UNSPECIFIED",
            polylineQuality: "high_quality",
            computeAlternativeRoutes: false,
          }),
        }
      );

      if (!responseAB.ok) {
        const errorData = await responseAB.json();
        console.error("Error response AB:", errorData);
        throw new Error("Network response was not ok");
      }

      const dataAB = await responseAB.json();
      console.log(dataAB);

      // Check and get polyline from A to B
      let pointsAB = [];
      let durationAB = 0; // Duration from A to B
      if (
        dataAB.routes &&
        Array.isArray(dataAB.routes) &&
        dataAB.routes.length > 0
      ) {
        const polylineAB = dataAB.routes[0].polyline.encodedPolyline;
        pointsAB = decodePolyline(polylineAB);
        durationAB = dataAB.routes[0].duration; // Get duration from A to B
      } else {
        Alert.alert("Error", "No routes found from A to B.");
        return;
      }

      // Update route and zoom in
      setRoute(pointsAB);
      setDuration(durationAB.toString()); // Calculate total duration
      if (mapRef.current) {
        mapRef.current.fitToCoordinates(pointsAB, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
      // Call API GetShop
      await fetchShops(startAddress, endAddress, search);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const fetchShops = async (add1, add2, sea) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://bms-fs-api.azurewebsites.net/GetShop?add1=${encodeURIComponent(
          add1
        )}&add2=${encodeURIComponent(add2)}&search=${encodeURIComponent(sea)}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.isSuccess) {
        setShops(data.data);
      } else {
        Alert.alert("Error", "No shops found.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const decodePolyline = (t) => {
    let points = [];
    let index = 0,
      len = t.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = (result >> 1) ^ -(result & 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = (result >> 1) ^ -(result & 1);
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  const handleShopPress = async (shop) => {
    try {
      const shopAddress = shop.store.address; // Address of the shop

      // Call API to get route from A to the shop
      const responseToShop = await fetch(
        "https://routes.gomaps.pro/directions/v2:computeRoutes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": "AlzaSyMLWSaQgJYCT2ittsrZkpWQvDoV_AuPRYE", // Replace with your API Key
          },
          body: JSON.stringify({
            origin: {
              vehicleStopover: false,
              sideOfRoad: false,
              address: startAddress,
            },
            destination: {
              vehicleStopover: false,
              sideOfRoad: false,
              address: shopAddress,
            },
            routingPreference: "ROUTING_PREFERENCE_UNSPECIFIED",
            polylineQuality: "high_quality",
            computeAlternativeRoutes: false,
          }),
        }
      );

      if (!responseToShop.ok) {
        const errorData = await responseToShop.json();
        console.error("Error response to shop:", errorData);
        throw new Error("");
      }

      const dataToShop = await responseToShop.json();
      let pointsToShop = [];
      if (
        dataToShop.routes &&
        Array.isArray(dataToShop.routes) &&
        dataToShop.routes.length > 0
      ) {
        const polylineToShop = dataToShop.routes[0].polyline.encodedPolyline;
        pointsToShop = decodePolyline(polylineToShop);
        const durationToShop = dataToShop.routes[0].duration; // Duration from A to the shop
        const distanceToShop = dataToShop.routes[0].distance; // Distance from A to the shop

        // Update state with duration and distance
        setDuration(durationToShop);
        setDistance(distanceToShop);
      } else {
        Alert.alert("Error", "No routes found to the shop.");
        return;
      }

      // Call API to get route from the shop to B
      const responseFromShopToEnd = await fetch(
        "https://routes.gomaps.pro/directions/v2:computeRoutes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": "AlzaSyMLWSaQgJYCT2ittsrZkpWQvDoV_AuPRYE", // Replace with your API Key
          },
          body: JSON.stringify({
            origin: {
              vehicleStopover: false,
              sideOfRoad: false,
              address: shopAddress,
            },
            destination: {
              vehicleStopover: false,
              sideOfRoad: false,
              address: endAddress,
            },
            routingPreference: "ROUTING_PREFERENCE_UNSPECIFIED",
            polylineQuality: "high_quality",
            computeAlternativeRoutes: false,
          }),
        }
      );

      if (!responseFromShopToEnd.ok) {
        const errorData = await responseFromShopToEnd.json();
        console.error("Error response from shop to end:", errorData);
        throw new Error("Network response was not ok");
      }

      const dataFromShopToEnd = await responseFromShopToEnd.json();
      let pointsFromShopToEnd = [];
      if (
        dataFromShopToEnd.routes &&
        Array.isArray(dataFromShopToEnd.routes) &&
        dataFromShopToEnd.routes.length > 0
      ) {
        const polylineFromShopToEnd =
          dataFromShopToEnd.routes[0].polyline.encodedPolyline;
        pointsFromShopToEnd = decodePolyline(polylineFromShopToEnd);
        const durationFromShopToEnd = dataFromShopToEnd.routes[0].duration; // Duration from the shop to B
        const distanceFromShopToEnd = dataFromShopToEnd.routes[0].distance; // Distance from the shop to B

        // Update total duration and distance
        setDuration((prevDuration) => prevDuration + durationFromShopToEnd);
        setDistance((prevDistance) => prevDistance + distanceFromShopToEnd);
      } else {
        Alert.alert("Error", "No routes found from the shop to the end.");
        return;
      }

      // Combine points
      const combinedRoute = [...pointsToShop, ...pointsFromShopToEnd];
      setRoute(combinedRoute);
      if (mapRef.current) {
        mapRef.current.fitToCoordinates(combinedRoute, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4caf50", "#81c784"]}
        style={styles.background}
      />

      {/* Enhanced Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBackButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Route & Shop Finder</Text>
      </View>

      {/* Address Input Section */}
      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <MaterialIcons name="my-location" size={20} color="#4caf50" />
          <TextInput
            style={styles.input}
            placeholder="Starting Point"
            placeholderTextColor="#888"
            onChangeText={setStartAddress}
            value={startAddress}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="location-on" size={20} color="#f44336" />
          <TextInput
            style={styles.input}
            placeholder="Destination"
            placeholderTextColor="#888"
            onChangeText={setEndAddress}
            value={endAddress}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color="#2196f3" />
          <TextInput
            style={styles.input}
            placeholder="Search Shops"
            placeholderTextColor="#888"
            onChangeText={setSearch}
            value={search}
          />
        </View>

        <TouchableOpacity style={styles.findButton} onPress={handleGetRoute}>
          <LinearGradient
            colors={["#4caf50", "#81c784"]}
            style={styles.findButtonGradient}
          >
            <Text style={styles.findButtonText}>Find Route</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 10.7764,
            longitude: 106.7053,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {route.length > 0 && (
            <>
              <Polyline
                coordinates={route}
                strokeColor="#000"
                strokeWidth={3}
              />
              {/* Mark the points */}
              {route.length >= 3 && (
                <>
                  <Marker
                    coordinate={{
                      latitude: route[0].latitude,
                      longitude: route[0].longitude,
                    }}
                    title="Starting Point"
                  />
                  <Marker
                    coordinate={{
                      latitude: route[route.length - 1].latitude,
                      longitude: route[route.length - 1].longitude,
                    }}
                    title="Destination Point"
                  />
                </>
              )}
              {/* Mark shops with images */}
              {shops.map((shop) => (
                <Marker
                  key={shop.store.id}
                  coordinate={{
                    latitude: shop.store.lat,
                    longitude: shop.store.lng,
                  }}
                  onPress={() => handleShopPress(shop)} // Call function when marker is pressed
                >
                  <View style={{ alignItems: "center" }}>
                    <Image
                      source={{
                        uri: shop.store.image
                          ? shop.store.image
                          : "https://i.pinimg.com/236x/eb/cb/c6/ebcbc6aaa9deca9d6efc1efc93b66945.jpg",
                      }} // Use shop's image or default image
                      style={{ width: 20, height: 20, borderRadius: 25 }} // Adjust image size
                      resizeMode="cover" // Ensure image is not distorted
                    />
                    <Text style={{ fontSize: 12 }}>{shop.store.name}</Text>
                  </View>
                </Marker>
              ))}
              {markers.map((marker, index) => (
                <Marker
                  key={index}
                  coordinate={marker.coordinate}
                  title={marker.title}
                />
              ))}
            </>
          )}
        </MapView>
      </View>

      {/* Shops Horizontal Scrollview */}
      <View style={styles.shopListContainer}>
        <Text style={styles.shopListTitle}>Nearby Shops</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.shopScrollContent}
        >
          {shops.map((shop) => (
            <TouchableOpacity
              key={shop.store.id}
              style={styles.shopCard}
              onPress={() => handleShopPress(shop)}
            >
              <Image
                source={{
                  uri:
                    shop.store.image ||
                    "https://via.placeholder.com/150/4caf50/ffffff?text=Shop",
                }}
                style={styles.shopCardImage}
                resizeMode="cover"
              />
              <View style={styles.shopCardDetails}>
                <Text style={styles.shopCardName} numberOfLines={1}>
                  {shop.store.name}
                </Text>
                <Text style={styles.shopCardDescription} numberOfLines={2}>
                  {shop.store.description}
                </Text>
                <View style={styles.shopCardMeta}>
                  <Ionicons name="location" size={12} color="#4caf50" />
                  <Text style={styles.shopCardMetaText}>
                    {shop.distanceText}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.shopDetailsButton}
                  onPress={() =>
                    navigation.navigate("Shop", {
                      id: shop.store.id,
                      orderIdSuccess: null,
                    })
                  }
                >
                  <Text style={styles.shopDetailsButtonText}>View Shop</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: "transparent",
  },
  headerBackButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  inputSection: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 14,
    paddingLeft: 10,
    color: "#333",
  },
  findButton: {
    marginTop: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  findButtonGradient: {
    paddingVertical: 12,
    alignItems: "center",
  },
  findButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  mapContainer: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
    marginHorizontal: 15,
    marginBottom: 10,
  },
  map: {
    flex: 1,
  },
  shopListContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 15,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  shopListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  shopScrollContent: {
    paddingHorizontal: 10,
  },
  shopCard: {
    width: width * 0.7,
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
    marginRight: 10,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  shopCardImage: {
    width: 100,
    height: 100,
  },
  shopCardDetails: {
    flex: 1,
    padding: 10,
  },
  shopCardName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  shopCardDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  shopCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  shopCardMetaText: {
    fontSize: 12,
    marginLeft: 5,
    color: "#4caf50",
  },
  shopDetailsButton: {
    backgroundColor: "#4caf50",
    borderRadius: 5,
    paddingVertical: 5,
    alignItems: "center",
  },
  shopDetailsButtonText: {
    color: "white",
    fontSize: 12,
  },
});

export default MapScreen;
