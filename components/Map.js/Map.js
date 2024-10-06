import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-svg";

export default function Map() {
  const [origin, setOrigin] = React.useState({
    latitue: 33.640411,
    longitude: -84.419853,
  });
  const [destination, setDestination] = React.useState({
    latitue: 33.640411,
    longitude: -84.419853,
  });
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
      initialRegion=
      {{
        latitue: origin.latitue,
        longitude: origin.longitude,
        latitueDelta: 0.09,
        longitude: 0.04,
      }}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%", // Sử dụng đơn vị phần trăm để bản đồ chiếm hết chiều rộng
    height: "100%", // Tương tự với chiều cao
  },
});
