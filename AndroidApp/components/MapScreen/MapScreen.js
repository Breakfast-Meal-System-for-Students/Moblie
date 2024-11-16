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
} from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const MapScreen = () => {
  const navigation = useNavigation(); // Ensure navigation is defined
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

  // useEffect(() => {
  //   requestLocationPermission();
  // }, []);

  // const requestLocationPermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: "Location Permission",
  //         message: "This app needs access to your location.",
  //         buttonNeutral: "Ask Me Later",
  //         buttonNegative: "Cancel",
  //         buttonPositive: "OK",
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log("You can use the location");
  //     } else {
  //       console.log("Location permission denied");
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };

  const handleGetRoute = async () => {
    try {
      // Gọi API từ A đến B
      const responseAB = await fetch(
        "https://routes.gomaps.pro/directions/v2:computeRoutes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": "AlzaSyMf01ywbPF0VojwE11h6xn5fWC9loM_u3D", // Thay thế bằng API Key của bạn
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

      // Kiểm tra và lấy polyline từ A đến B
      let pointsAB = [];
      let durationAB = 0; // Thời gian từ A đến B
      if (
        dataAB.routes &&
        Array.isArray(dataAB.routes) &&
        dataAB.routes.length > 0
      ) {
        const polylineAB = dataAB.routes[0].polyline.encodedPolyline;
        pointsAB = decodePolyline(polylineAB);
        durationAB = dataAB.routes[0].duration; // Lấy thời gian từ A đến B
      } else {
        Alert.alert("Error", "No routes found from A to B.");
        return;
      }

      // Cập nhật route và zoom vào
      setRoute(pointsAB);
      setDuration(durationAB.toString()); // Tính tổng thời gian
      if (mapRef.current) {
        mapRef.current.fitToCoordinates(pointsAB, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
      // Gọi API GetShop
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
      const shopAddress = shop.store.address; // Địa chỉ của cửa hàng

      // Gọi API để lấy đường đi từ A đến cửa hàng
      const responseToShop = await fetch(
        "https://routes.gomaps.pro/directions/v2:computeRoutes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": "AlzaSyMf01ywbPF0VojwE11h6xn5fWC9loM_u3D", // Thay thế bằng API Key của bạn
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
        throw new Error("Network response was not ok");
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
        const durationToShop = dataToShop.routes[0].duration; // Thời gian từ A đến cửa hàng
        const distanceToShop = dataToShop.routes[0].distance; // Quãng đường từ A đến cửa hàng

        // Cập nhật state với thời gian và quãng đường
        setDuration(durationToShop);
        setDistance(distanceToShop);
      } else {
        Alert.alert("Error", "No routes found to the shop.");
        return;
      }

      // Gọi API để lấy đường đi từ cửa hàng đến B
      const responseFromShopToEnd = await fetch(
        "https://routes.gomaps.pro/directions/v2:computeRoutes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": "AlzaSyMf01ywbPF0VojwE11h6xn5fWC9loM_u3D", // Thay thế bằng API Key của bạn
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
        const durationFromShopToEnd = dataFromShopToEnd.routes[0].duration; // Thời gian từ cửa hàng đến B
        const distanceFromShopToEnd = dataFromShopToEnd.routes[0].distance; // Quãng đường từ cửa hàng đến B

        // Cập nhật tổng thời gian và quãng đường
        setDuration((prevDuration) => prevDuration + durationFromShopToEnd);
        setDistance((prevDistance) => prevDistance + distanceFromShopToEnd);
      } else {
        Alert.alert("Error", "No routes found from the shop to the end.");
        return;
      }

      // Kết hợp các điểm
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
        colors={["#e3f2fd", "#bbdefb"]}
        style={styles.background}
      />

      {/* Custom Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#ffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Map</Text>
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="map-marker" size={16} color="#00cc69" />
        <TextInput
          style={styles.input}
          placeholder="Nhập địa chỉ bắt đầu"
          onChangeText={setStartAddress}
          value={startAddress}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="map-marker" size={16} color="#ff6347" />
        <TextInput
          style={styles.input}
          placeholder="Nhập địa chỉ kết thúc"
          onChangeText={setEndAddress}
          value={endAddress}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="search" size={16} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Search..."
          onChangeText={setSearch}
          value={search}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGetRoute}>
        <LinearGradient
          colors={["#00cc69", "#00a856"]}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Find Now</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.mapContainer}>
        <MapView ref={mapRef} style={styles.map}>
          {route.length > 0 && (
            <>
              <Polyline
                coordinates={route}
                strokeColor="#000"
                strokeWidth={3}
              />
              {/* Đánh dấu các điểm */}
              {route.length >= 3 && (
                <>
                  <Marker
                    coordinate={{
                      latitude: route[0].latitude,
                      longitude: route[0].longitude,
                    }}
                    title="Điểm bắt đầu"
                  />
                  <Marker
                    coordinate={{
                      latitude: route[route.length - 1].latitude,
                      longitude: route[route.length - 1].longitude,
                    }}
                    title="Điểm kết thúc"
                  />
                </>
              )}
              {/* Đánh dấu các cửa hàng với hình ảnh */}
              {shops.map((shop) => (
                <Marker
                  key={shop.store.id}
                  coordinate={{
                    latitude: shop.store.lat,
                    longitude: shop.store.lng,
                  }}
                  onPress={() => handleShopPress(shop)} // Gọi hàm khi nhấn vào marker
                >
                  <View style={{ alignItems: "center" }}>
                    <Image
                      source={{
                        uri: shop.store.image
                          ? shop.store.image
                          : "https://i.pinimg.com/236x/eb/cb/c6/ebcbc6aaa9deca9d6efc1efc93b66945.jpg",
                      }} // Sử dụng hình ảnh của cửa hàng hoặc hình ảnh mặc định
                      style={{ width: 20, height: 20, borderRadius: 25 }} // Điều chỉnh kích thước hình ảnh
                      resizeMode="cover" // Đảm bảo hình ảnh không bị méo
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

      <View style={styles.shopListContainer}>
        <Text style={styles.shopListTitle}>Danh sách cửa hàng:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {shops.map((shop) => (
            <TouchableOpacity
              key={shop.store.id}
              style={styles.shopItem}
              onPress={() => handleShopPress(shop)}
            >
              <Image
                source={{ uri: shop.store.image }}
                style={styles.shopImage}
                resizeMode="cover"
              />
              <View style={styles.shopInfo}>
                <Text style={styles.shopName}>{shop.store.name}</Text>
                <Text style={styles.shopDescription}>
                  {shop.store.description}
                </Text>
                <View style={styles.shopDetailRow}>
                  <FontAwesome name="map-marker" size={10} color="#FF6347" />
                  <Text style={styles.shopDetailText}>
                    {shop.store.address}
                  </Text>
                </View>
                <View style={styles.shopDetailRow}>
                  <Ionicons name="time" size={10} color="#007AFF" />
                  <Text style={styles.shopDetailText}>{shop.timeText}</Text>
                </View>
                <View style={styles.shopDetailRow}>
                  <Ionicons name="location" size={10} color="#00cc69" />
                  <Text style={styles.shopDetailText}>{shop.distanceText}</Text>
                </View>
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
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: "#00cc69",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffff",
    marginLeft: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginBottom: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    paddingLeft: 8,
  },
  mapContainer: {
    flex: 2,
    borderRadius: 15,
    overflow: "hidden",
    marginHorizontal: 10,
    backgroundColor: "#e0f7fa",
    elevation: 3,
  },
  map: {
    flex: 1,
  },
  button: {
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonGradient: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  shopListContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  shopListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  shopItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  shopImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  shopName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  shopDetailText: {
    fontSize: 12,
    color: "#555",
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderColor: "#fff",
    borderWidth: 2,
  },
  markerText: {
    fontSize: 10,
    color: "#333",
    textAlign: "center",
  },
  shopListContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 15,
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  shopListTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  shopItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 12,
    width: 250,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  shopImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  shopInfo: {
    flex: 1,
    justifyContent: "center",
  },
  shopName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: -1,
  },
  shopDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  shopDetailText: {
    fontSize: 13,
    color: "#555",
    marginLeft: 6,
  },
});

export default MapScreen;
