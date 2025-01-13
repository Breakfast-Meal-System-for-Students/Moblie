import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import * as Linking from "expo-linking";

export default function BuyCoins() {
  const route = useRoute();
  const { amountSuccess } = route.params || {};
  const navigation = useNavigation();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const STATUS_DEPOSIT = 5;

  const handleTopUp = (value) => {
    setAmount(value);
  };

  useFocusEffect(
    useCallback(() => {
      updateBalace();
    }, [amountSuccess])
  );

  const updateBalace = async () => {
    if (amountSuccess == null || amountSuccess < 1000) {
      return;
    }
    try {
      const token = await AsyncStorage.getItem("userToken");
      const formData = new FormData();
      formData.append("amount", amountSuccess);
      formData.append("status", STATUS_DEPOSIT);

      const result = await fetch(
        `https://bms-fs-api.azurewebsites.net/api/Wallet/UpdateBalance`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const resBody = await result.json();
      if (resBody.isSuccess) {
        Alert.alert(
          "Success",
          `You have successfully topped up ${new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(parseInt(amount))}`
        );
        navigation.goBack();
      } else {
        Alert.alert("Error", "Top-up failed");
      }
    } catch (error) {
      console.error("Error updating balance:", error);
      Alert.alert("Error", "Failed to update balance");
    }
  };

  const handleSubmit = async () => {
    if (!amount || parseInt(amount) <= 1000) {
      Alert.alert("Error", "Please enter an amount greater than 1,000 VND");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");
      const amountTotal = amount < 1000 ? amount * 10000 : amount;

      const jsonBody = {
        userId,
        orderType: "Deposit",
        amount: amountTotal,
        returnUrl: `https://bms1dl-ujj3.vercel.app/BuyCoinsReturn?amount=${amountTotal}`,
      };

      const response = await axios.post(
        "https://bms-fs-api.azurewebsites.net/api/Payment/create-payment-url-fordeposit",
        jsonBody,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { isSuccess, data } = response.data;
      if (isSuccess && data) {
        await Linking.openURL(data);
      } else {
        console.error(response);
        Alert.alert("Error", "Unable to initiate payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Error", "An error occurred during payment processing");
    } finally {
      setLoading(false);
    }
  };

  const presetAmounts = [50000, 100000, 200000, 500000, 1000000];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buy Coins</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholderTextColor="#999"
          />
        </View>

        {/* Preset Amounts */}
        <View style={styles.chipsContainer}>
          {presetAmounts.map((value) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.chip,
                amount === value.toString() && styles.activeChip,
              ]}
              onPress={() => handleTopUp(value.toString())}
            >
              <Text
                style={[
                  styles.chipText,
                  amount === value.toString() && styles.activeChipText,
                ]}
              >
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(value)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            loading && styles.submitButtonProcessing,
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" style={styles.loader} />
              <Text style={styles.submitButtonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Buy Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00cc69",
    paddingVertical: 16,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerRight: {
    width: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 32,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  activeChip: {
    backgroundColor: "#00cc69",
    borderColor: "#00cc69",
  },
  chipText: {
    fontSize: 14,
    color: "#666",
  },
  activeChipText: {
    color: "#fff",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#00cc69",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonProcessing: {
    backgroundColor: "#999",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    marginRight: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
