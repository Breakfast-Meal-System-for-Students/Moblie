import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
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
      id: "3",
      name: "Mobile Banking",
      icon: faMobile,
      description: "Direct payment through your bank app",
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
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  methodContainer: {

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
