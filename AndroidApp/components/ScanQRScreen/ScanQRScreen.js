import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  Button,
  Alert,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function ScanQRScreen({ route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const token = AsyncStorage.getItem("userToken");
  const COMPLETE_STATUS = 8;
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const formData = new FormData();
    formData.append("id", data);
    formData.append("status", COMPLETE_STATUS);
    const result = await fetch(`https://bms-fs-api.azurewebsites.net/api/Order/ChangeOrderStatus`, {
      method: 'POST',
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    const resBody = await result.json();
    if (resBody.isSuccess) {
      Alert.alert("QR Scanned", `Order picked up at the shop.`, [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
      navigation.goBack();
    }
    else {
      Alert.alert("Error", "Can not to get order detail!!!");
    }
  };

  const fetchOrderById = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const result = await fetch(`https://bms-fs-api.azurewebsites.net/api/Order/GetOrderById/${orderId}`, {
      method: 'GET',
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`
      },
    });
    const resBody = await result.json();
    if (resBody.isSuccess) {
      setOrder(resBody.data);
    } else {
      Alert.alert("Error", "Can not to get order detail!!!");
    }
  }

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Requesting for camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No access to camera</Text>
        <Button
          title="Allow Camera Access"
          onPress={() => BarCodeScanner.requestPermissionsAsync()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
