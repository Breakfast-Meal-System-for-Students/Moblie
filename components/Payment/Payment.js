import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
<<<<<<< Updated upstream
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
=======
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Payment = ({ route, navigation }) => {
  const {
    fullName = "Guest",
    orderInfo = "",
    orderType = "",
    description = "",
    amount = 0,
  } = route.params || {};
>>>>>>> Stashed changes

export default function Payment() {
  const navigation = useNavigation();
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    {
      id: 1,
      name: "Credit Card",
      icon: <MaterialIcons name="credit-card" size={24} color="#00cc69" />,
    },
    {
      id: 2,
      name: "PayPal",
      icon: <Ionicons name="logo-paypal" size={24} color="#00cc69" />,
    },
    {
      id: 3,
      name: "Cash on Delivery",
      icon: <Ionicons name="cash-outline" size={24} color="#00cc69" />,
    },
  ];

<<<<<<< Updated upstream
=======
  const apiEndpoint =
    "https://bms-fs-api.azurewebsites.net/api/Payment/create-payment-url";

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert("Thông báo", "Vui lòng chọn phương thức thanh toán");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const jsonBody = {
        orderInfo,
        fullName,
        orderType,
        description,
        amount,
      };

      const response = await axios.post(apiEndpoint, jsonBody, {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      const { isSuccess, data } = response.data;
      if (isSuccess && data) {
        await Linking.openURL(data);
      } else {
        console.error(response);
        Alert.alert("Lỗi", "Không thể khởi tạo thanh toán");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đã có lỗi xảy ra trong quá trình xử lý thanh toán");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

>>>>>>> Stashed changes
  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
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
        onPress={() => selectedMethod && alert("Payment Confirmed!")}
        disabled={!selectedMethod}
      >
        <Text style={styles.buttonText}>Confirm Payment</Text>
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
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
<<<<<<< Updated upstream
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
=======
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  summaryText: {
    fontSize: 14,
    color: "#333",
  },
  footer: {
    padding: 16,
    backgroundColor: "#FFF",
  },
  paymentButton: {
    backgroundColor: "#00CC69",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#B0BEC5",
  },
  paymentButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
>>>>>>> Stashed changes
  },
});
