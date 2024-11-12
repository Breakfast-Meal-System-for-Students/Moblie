import React, { useState } from "react";
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

const Payment = ({ route, navigation }) => {
  const {
    fullName = "Guest",
    orderInfo = "",
    orderType = "",
    description = "",
    amount = 0,
    cartId = "",
  } = route.params || {};

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  // Define the payment methods array
  const paymentMethods = [
    { id: 1, name: "VNPAY", icon: "card-outline", color: "#00457C" },
    { id: 2, name: "PayOS", icon: "logo-paypal", color: "#003087" },
    { id: 3, name: "Cash on Delivery", icon: "cash-outline", color: "#2E7D32" },
  ];

  const apiEndpoint =
    "https://bms-fs-api.azurewebsites.net/api/Payment/create-payment-url";

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert("Thông báo", "Vui lòng chọn phương thức thanh toán");
      return;
    }

    setLoading(true);
    try {
      // token cua user dau
      const token = await AsyncStorage.getItem("userToken");
      const jsonBody = {
        orderInfo,
        fullName,
        orderType,
        description,
        amount,
      };
      // console.log(jsonBody);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phương thức thanh toán</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Chọn phương thức thanh toán</Text>
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
          <Text style={styles.summaryTitle}>Chi tiết thanh toán</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Số tiền</Text>
            <Text style={styles.summaryAmount}>
              {amount.toLocaleString("vi-VN")} VNĐ
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tên khách hàng</Text>
            <Text style={styles.summaryText}>{fullName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Mã đơn hàng</Text>
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
            <Text style={styles.paymentButtonText}>Xác nhận thanh toán</Text>
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
