import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Payment = ({ route }) => {
  const {
    fullName = "Guest",
    orderInfo = "",
    orderType = "",
    description = "",
    amount = 0,
    shopId,
  } = route.params || {};
  const STATUS_PAID = 1;
  const navigation = useNavigation();
  const token = AsyncStorage.getItem("token");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, name: "VNPAY", icon: "card-outline", color: "#00457C" },
    { id: 2, name: "Cash on Delivery", icon: "cash-outline", color: "#2E7D32" },
    { id: 3, name: "BSM Wallet", icon: "wallet-outline", color: "#2E7D32" },
  ]);

  useEffect(() => {
    fetchWalletByUser();
  }, []);

  const apiEndpoint =
    "https://bms-fs-api.azurewebsites.net/api/Payment/create-payment-url";

  const fetchWalletByUser = async () => {
    const result = await fetch(`https://bms-fs-api.azurewebsites.net/api/Wallet/GetWalletByUserId`, {
      "Authorization": `Bearer ${token}`
    });
    const resBody = await result.json();
    if (resBody.isSuccess) {
      const amount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(resBody.data.balance));
      setBalance(resBody.data.balance);
      setPaymentMethods([
        { id: 1, name: "VNPAY", icon: "card-outline", color: "#00457C" },
        { id: 2, name: "Cash on Delivery", icon: "cash-outline", color: "#2E7D32" },
        { id: 3, name: `BSM Wallet - ${amount}`, icon: "wallet-outline", color: "#2E7D32" },
      ]);
    } else {
      Alert.alert("Error", "Can not to get wallet information.");
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert("Notification", "Please choose a payment method");
      return;
    }

    if (selectedMethod === 2) {
      Alert.alert("Notification", "Your order has been successfully created!");
      navigation.navigate("Home");
      return;
    }

    if (selectedMethod === 3) {
      if (balance < amount) {
        Alert.alert("Sorry", "BSM Wallet is not enough to payment.");
        return;
      }
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("status", STATUS_PAID);
      formData.append("orderId", orderInfo);
      const result = await fetch(`https://bms-fs-api.azurewebsites.net/api/Wallet/UpdateBalance`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      const resBody = await result.json();
      if (resBody.isSuccess) {
        Alert.alert("Notification", "Your order has been successfully created!");
        navigation.navigate("Home");
        return;
      } else {
        Alert.alert("Error", `Lỗi thanh toán`);
      }
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const amountTotal = amount < 1000 ? amount * 10000 : amount
      const jsonBody = {
        orderInfo,
        fullName,
        orderType,
        description,
        amount: amountTotal,
        returnUrl: `https://bms1dl-ujj3.vercel.app/PaymentCartReturn?shopId=${shopId}&orderId=${orderInfo}`
      };
      console.log(jsonBody);
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
        Alert.alert("Error", "Unable to initiate payment");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during payment processing");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Choose payment method</Text>
        <View style={styles.methodsContainer}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.selectedMethod,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: method.color + "20" },
                  ]}
                >
                  <Ionicons name={method.icon} size={24} color={method.color} />
                </View>
                <Text style={styles.methodName}>{method.name}</Text>
              </View>
              <View style={styles.radioContainer}>
                <View style={styles.radioOuter}>
                  {selectedMethod === method.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Payement Details</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount: </Text>
            <Text style={styles.summaryAmount}>
              {amount.toLocaleString("vi-VN")}đ
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Order Code: </Text>
            <Text style={styles.summaryText}>{orderInfo}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.paymentButton,
            !selectedMethod && styles.disabledButton,
          ]}
          onPress={handlePayment}
          disabled={!selectedMethod || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.paymentButtonText}>CONFIRM PAYMENT</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#00CC69",
    paddingVertical: 16,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  methodsContainer: {
    marginBottom: 24,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  selectedMethod: {
    borderColor: "#00CC69",
    borderWidth: 2,
  },
  methodContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  methodName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  radioContainer: {
    padding: 4,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#00CC69",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#00CC69",
  },
  summaryCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 3,
      },
    }),
  },
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
    fontSize: 16,
    fontWeight: "600",
    color: "#00CC69",
  },
  summaryText: {
    fontSize: 14,
    color: "#333",
  },
  footer: {
    padding: 16,
    backgroundColor: "#FFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  paymentButton: {
    backgroundColor: "#00CC69",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});

export default Payment;
