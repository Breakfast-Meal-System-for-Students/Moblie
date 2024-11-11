import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as Linking from "expo-linking";

export default function Payment({
  fullName = "Guest",
  orderInfo = "e2177a77-f0ca-4f0e-85cd-0aec4771ad1b",
  orderType = "general",
  description = "No description",
  amount = 10000,
}) {
  const navigation = useNavigation();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    {
      id: 1,
      name: "VNPAY",
      icon: <MaterialIcons name="credit-card" size={24} color="#00cc69" />,
    },
    {
      id: 2,
      name: "PayOS",
      icon: <Ionicons name="logo-paypal" size={24} color="#00cc69" />,
    },
    {
      id: 3,
      name: "Cash on Delivery",
      icon: <Ionicons name="cash-outline" size={24} color="#00cc69" />,
    },
  ];

  const confirmPayment = async () => {
    if (!selectedMethod) {
      Alert.alert("Error", "Please select a payment method.");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending payment data:", {
        orderInfo,
        fullName,
        orderType,
        description,
        amount,
      });

      const response = await axios.post(
        "https://bms-fs-api.azurewebsites.net/api/Payment/create-payment-url",
        {
          orderInfo,
          fullName,
          orderType,
          description,
          amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );

      console.log("API Response:", response.data);

      const { isSuccess, data } = response.data;
      if (isSuccess && data) {
        Linking.openURL(data);
      } else {
        Alert.alert("Error", "Failed to initiate payment.");
      }
    } catch (error) {
      if (error.response) {
        Alert.alert(
          "Error",
          `Request failed with status ${
            error.response.status
          }: ${JSON.stringify(error.response.data)}`
        );
        console.error("Error details:", error.response.data);
      } else {
        Alert.alert("Error", "An error occurred while processing payment.");
        console.error("Error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Choose a Payment Method</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodContainer,
              selectedMethod === method.id && styles.selectedMethod,
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            {method.icon}
            <Text style={styles.methodText}>{method.name}</Text>
            {selectedMethod === method.id && (
              <Ionicons name="checkmark" size={24} color="#00cc69" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          selectedMethod ? styles.buttonActive : styles.buttonDisabled,
        ]}
        onPress={confirmPayment}
        disabled={!selectedMethod || loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : "Confirm Payment"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00cc69",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
    flex: 1,
    textAlign: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  methodContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedMethod: {
    borderColor: "#00cc69",
    borderWidth: 2,
  },
  methodText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 18,
    color: "#333",
  },
  confirmButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonActive: {
    backgroundColor: "#00cc69",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
