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
import { io } from 'socket.io-client';

export default function ScanQRScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [socket, setSocket] = useState(null);
  const token = AsyncStorage.getItem("userToken");
  const COMPLETE_STATUS = 8;
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    const socketConnection = io('https://bms-socket.onrender.com');
    setSocket(socketConnection);

    return () => {
      setTimeout(() => {
        socketConnection.disconnect(); // Delay disconnect by 2 seconds
      }, 2000); // 2 seconds delay
    };
  }, []);

  const sendNotiToShop = async (orderId, userId, shopId) => {
    if (socket) {
      socket.emit('join-shop-topic', shopId);
      const orderData = {
        userId,
        shopId,
        orderId,
      };
      socket.emit('new-order', orderData); // Send notification to shop
    }
  };

  const handleBarCodeScanned = async ({ data }) => {
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
      fetchOrderById(data);
    }
    else {
      Alert.alert("Error", "Can not to get order detail!!!");
    }
  };

  const fetchOrderById = async (orderId) => {
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
      const order = resBody.data;
      sendNotiToShop(order.id, order.customerId, order.shopId)
      Alert.alert("QR Scanned", `Order picked up at the shop.`, [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
      navigation.goBack();
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
