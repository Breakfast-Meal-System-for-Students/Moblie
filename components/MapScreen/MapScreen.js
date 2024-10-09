import React, { useState, useEffect, useRef } from "react";
import {Text, View, StyleSheet, TextInput, Button,Image, Alert,TouchableOpacity, PermissionsAndroid, FlatList ,ScrollView} from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";

const MapScreen = () => {
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
      const responseAB = await fetch('https://routes.gomaps.pro/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': 'AlzaSyMf01ywbPF0VojwE11h6xn5fWC9loM_u3D', // Thay thế bằng API Key của bạn
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
      });

      if (!responseAB.ok) {
        const errorData = await responseAB.json();
        console.error('Error response AB:', errorData);
        throw new Error('Network response was not ok');
      }

      const dataAB = await responseAB.json();
      console.log(dataAB);

      // Kiểm tra và lấy polyline từ A đến B
      let pointsAB = [];
      let durationAB = 0; // Thời gian từ A đến B
      if (dataAB.routes && Array.isArray(dataAB.routes) && dataAB.routes.length > 0) {
        const polylineAB = dataAB.routes[0].polyline.encodedPolyline;
        pointsAB = decodePolyline(polylineAB);
        durationAB = dataAB.routes[0].duration; // Lấy thời gian từ A đến B
      } else {
        Alert.alert("Error", "No routes found from A to B.");
        return;
      }

    
   
      

      // Cập nhật route và zoom vào
      setRoute(pointsAB);
      setDuration((durationAB).toString()); // Tính tổng thời gian
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
      const response = await fetch(`https://bms-fs-api.azurewebsites.net/GetShop?add1=${encodeURIComponent(add1)}&add2=${encodeURIComponent(add2)}&search=${encodeURIComponent(sea)}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
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
    let index = 0, len = t.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result >> 1) ^ -(result & 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result >> 1) ^ -(result & 1));
      lng += dlng;

      points.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
    }
    return points;
  };

  const handleShopPress = async (shop) => {
    try {
      const shopAddress = shop.store.address; // Địa chỉ của cửa hàng

      // Gọi API để lấy đường đi từ A đến cửa hàng
      const responseToShop = await fetch('https://routes.gomaps.pro/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': 'AlzaSyMf01ywbPF0VojwE11h6xn5fWC9loM_u3D', // Thay thế bằng API Key của bạn
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
      });

      if (!responseToShop.ok) {
        const errorData = await responseToShop.json();
        console.error('Error response to shop:', errorData);
        throw new Error('Network response was not ok');
      }

      const dataToShop = await responseToShop.json();
      let pointsToShop = [];
      if (dataToShop.routes && Array.isArray(dataToShop.routes) && dataToShop.routes.length > 0) {
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
      const responseFromShopToEnd = await fetch('https://routes.gomaps.pro/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': 'AlzaSyMf01ywbPF0VojwE11h6xn5fWC9loM_u3D', // Thay thế bằng API Key của bạn
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
      });

      if (!responseFromShopToEnd.ok) {
        const errorData = await responseFromShopToEnd.json();
        console.error('Error response from shop to end:', errorData);
        throw new Error('Network response was not ok');
      }

      const dataFromShopToEnd = await responseFromShopToEnd.json();
      let pointsFromShopToEnd = [];
      if (dataFromShopToEnd.routes && Array.isArray(dataFromShopToEnd.routes) && dataFromShopToEnd.routes.length > 0) {
        const polylineFromShopToEnd = dataFromShopToEnd.routes[0].polyline.encodedPolyline;
        pointsFromShopToEnd = decodePolyline(polylineFromShopToEnd);
        const durationFromShopToEnd = dataFromShopToEnd.routes[0].duration; // Thời gian từ cửa hàng đến B
        const distanceFromShopToEnd = dataFromShopToEnd.routes[0].distance; // Quãng đường từ cửa hàng đến B

        // Cập nhật tổng thời gian và quãng đường
        setDuration(prevDuration => prevDuration + durationFromShopToEnd);
        setDistance(prevDistance => prevDistance + distanceFromShopToEnd);
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
      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ bắt đầu"
        onChangeText={setStartAddress}
        value={startAddress}
      />
 
      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ kết thúc"
        onChangeText={setEndAddress}
        value={endAddress}
      />
         <TextInput
        style={styles.input}
        placeholder="Search...."
        onChangeText={setSearch}
        value={search}
      />
      <Button title="Find Now" onPress={handleGetRoute} />
      {/* {duration && <Text>Thời gian dự kiến: {duration} giây</Text>} */}
      
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
                  <Marker coordinate={{ latitude: route[0].latitude, longitude: route[0].longitude }} title="Điểm bắt đầu" />
                  <Marker coordinate={{ latitude: route[route.length - 1].latitude, longitude: route[route.length - 1].longitude }} title="Điểm kết thúc" />
                </>
              )}
              {/* Đánh dấu các cửa hàng với hình ảnh */}
              {shops.map((shop) => (
                 <Marker
                 key={shop.store.id}
                 coordinate={{ latitude: shop.store.lat, longitude: shop.store.lng }}
                 onPress={() => handleShopPress(shop)} // Gọi hàm khi nhấn vào marker
               >
                 <View style={{ alignItems: 'center' }}>
                   <Image
                     source={{ uri: shop.store.image ? shop.store.image : "https://i.pinimg.com/236x/eb/cb/c6/ebcbc6aaa9deca9d6efc1efc93b66945.jpg" }} // Sử dụng hình ảnh của cửa hàng hoặc hình ảnh mặc định
                     style={{  width: 20, height: 20, borderRadius: 25  }} // Điều chỉnh kích thước hình ảnh
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

      {/* Hiển thị danh sách cửa hàng */}
     <View style={styles.shopListContainer}>
  <Text style={styles.shopListTitle}>Danh sách cửa hàng:</Text>
  <ScrollView>
    {shops.map((shop) => (
      <View key={shop.store.id} style={styles.shopItem}>
        <TouchableOpacity onPress={() => handleShopPress(shop)}> 
          <Image
            source={{ uri: shop.store.image }} // Hình ảnh của cửa hàng
            style={{ width: 50, height: 50, borderRadius: 25 }} // Kích thước và bo tròn hình ảnh
            resizeMode="cover" // Đảm bảo hình ảnh không bị méo
          />
        </TouchableOpacity>
        <Text style={styles.shopName}>{shop.store.name}</Text>
        <Text>{shop.store.description}</Text>
        <Text>Địa chỉ: {shop.store.address}</Text>
        <Text>Thời gian: {shop.timeText}</Text>
        <Text>Khoảng cách: {shop.distanceText}</Text>
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
    padding: 10,
  },
  mapContainer: {
    flex: 1, // Đảm bảo MapView chiếm không gian còn lại
    marginBottom: 10, // Khoảng cách giữa MapView và danh sách cửa hàng
  },
  map: {
    flex: 1, // Đảm bảo MapView chiếm toàn bộ không gian của mapContainer
  },
  shopListContainer: {
    flex: 1, // Đảm bảo danh sách cửa hàng có không gian
    marginTop: 10,
  },
  shopListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  shopItem: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MapScreen;