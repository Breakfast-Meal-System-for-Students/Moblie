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
  PermissionsAndroid,
  FlatList,
  ScrollView,
} from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";

const MapScreen = () => {
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [route, setRoute] = useState([]);
  const [duration, setDuration] = useState("");
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [distance, setDistance] = useState("");

  const handleGetRoute = async () => {
    // The logic to get the route and shop information goes here.
  };

  const fetchShops = async (add1, add2) => {
    // The logic to fetch nearby shops goes here.
  };

  const decodePolyline = (t) => {
    // The polyline decoding logic goes here.
  };

  const handleShopPress = async (shop) => {
    // Logic for handling shop press and routing to shop.
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter start address"
        onChangeText={setStartAddress}
        value={startAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter destination address"
        onChangeText={setEndAddress}
        value={endAddress}
      />
      <TouchableOpacity style={styles.routeButton} onPress={handleGetRoute}>
        <Text style={styles.routeButtonText}>Get Route</Text>
      </TouchableOpacity>

      <View style={styles.mapContainer}>
        <MapView ref={mapRef} style={styles.map}>
          {route.length > 0 && (
            <>
              <Polyline
                coordinates={route}
                strokeColor="#FF6347"
                strokeWidth={4}
              />
              {route.length >= 3 && (
                <>
                  <Marker
                    coordinate={route[0]}
                    title="Start"
                    pinColor="#00FF00"
                  />
                  <Marker
                    coordinate={route[route.length - 1]}
                    title="End"
                    pinColor="#FF0000"
                  />
                </>
              )}
              {shops.map((shop) => (
                <Marker
                  key={shop.store.id}
                  coordinate={{
                    latitude: shop.store.lat,
                    longitude: shop.store.lng,
                  }}
                  onPress={() => handleShopPress(shop)}
                >
                  <View style={styles.markerContainer}>
                    <Image
                      source={{
                        uri: shop.store.image
                          ? shop.store.image
                          : "https://i.pinimg.com/236x/eb/cb/c6/ebcbc6aaa9deca9d6efc1efc93b66945.jpg",
                      }}
                      style={styles.markerImage}
                    />
                    <Text style={styles.markerText}>{shop.store.name}</Text>
                  </View>
                </Marker>
              ))}
            </>
          )}
        </MapView>
      </View>

      <View style={styles.shopListContainer}>
        <Text style={styles.shopListTitle}>Nearby Shops:</Text>
        <ScrollView>
          {shops.map((shop) => (
            <View key={shop.store.id} style={styles.shopItem}>
              <TouchableOpacity onPress={() => handleShopPress(shop)}>
                <Image
                  source={{ uri: shop.store.image }}
                  style={styles.shopImage}
                />
              </TouchableOpacity>
              <View style={styles.shopDetails}>
                <Text style={styles.shopName}>{shop.store.name}</Text>
                <Text style={styles.shopDescription}>
                  {shop.store.description}
                </Text>
                <Text>Address: {shop.store.address}</Text>
                <Text>Estimated Time: {shop.timeText}</Text>
                <Text>Distance: {shop.distanceText}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  input: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    elevation: 2,
  },
  routeButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
  },
  routeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  mapContainer: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 10,
  },
  map: {
    flex: 1,
  },
  shopListContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  shopListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  shopItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
    alignItems: "center",
  },
  shopImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
  },
  shopDetails: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  shopDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  markerContainer: {
    alignItems: "center",
  },
  markerImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  markerText: {
    fontSize: 10,
    color: "#333",
  },
});

export default MapScreen;
