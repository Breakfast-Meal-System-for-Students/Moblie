import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import * as Linking from "expo-linking";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faCreditCard,
  faWallet,
  faMobile,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const PaymentScreen = ({ route, navigation }) => {
  const { cartId, totalAmount, selectedCoupon } = route.params;
  const [selectedMethod, setSelectedMethod] = useState(null);
  const Url_A = "myapp://app/Main";

  const paymentMethods = [
    {
      id: "1",
      name: "Credit/Debit Card",
      icon: faCreditCard,
      description: "Pay securely with your card",
    },
    {
      id: "2",
      name: "VNPay",
      icon: faWallet,
      description: "Fast and secure payment with VNPay",
    },
    {
      id: "3",
      name: "Mobile Banking",
      icon: faMobile,
      description: "Direct payment through your bank app",
    },
  ];

  const createOrder = async () => {
    if (!selectedMethod) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      const orderDate = new Date().toISOString();

      const orderData = {
        cartId: cartId,
        orderDate: orderDate,
        paymentMethod: selectedMethod.id,
      };

      if (selectedCoupon) {
        orderData.voucherId = selectedCoupon.id;
      }

      const response = await axios.post(
        "https://bms-fs-api.azurewebsites.net/api/Order/CreateOrder",
        orderData,
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.isSuccess) {
        Alert.alert("Success", "Order placed successfully!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home"),
          },
        ]);
      } else {
        Alert.alert("Error", "Failed to create order.");
      }
    } catch (error) {
      console.error("Create order error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.detail ||
          "An error occurred while creating the order."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
      </View>

      {/* Payment Methods */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selectedMethod?.id === method.id && styles.selectedMethod,
            ]}
            onPress={() => setSelectedMethod(method)}
          >
            <FontAwesomeIcon
              icon={method.icon}
              size={24}
              color={selectedMethod?.id === method.id ? "#00cc69" : "#666"}
            />
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>{method.name}</Text>
              <Text style={styles.methodDescription}>{method.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text>Total Amount:</Text>
            <Text style={styles.amount}>${totalAmount.toFixed(2)}</Text>
          </View>
          {selectedCoupon && (
            <View style={styles.summaryRow}>
              <Text>Discount:</Text>
              <Text style={styles.discount}>
                -
                {((totalAmount * selectedCoupon.percentDiscount) / 100).toFixed(
                  2
                )}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => Linking.openURL(Url_A)}
        >
          <Text style={styles.confirmButtonText}>Confirm Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedMethod: {
    borderColor: "#00cc69",
    backgroundColor: "#F0FFF4",
  },
  methodInfo: {
    marginLeft: 16,
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  methodDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  summaryContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00cc69",
  },
  discount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B6B",
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  confirmButton: {
    backgroundColor: "#00cc69",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PaymentScreen;
