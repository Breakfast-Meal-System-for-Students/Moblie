import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const WithdrawScreen = ({ navigation }) => {
  const [amount, setAmount] = useState("");

  const handleWithdraw = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      const formData = new FormData();
      formData.append("status", 6);
      formData.append("amount", parsedAmount);

      const response = await axios.put(
        "https://bms-fs-api.azurewebsites.net/api/Wallet/UpdateBalance",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.isSuccess) {
        Alert.alert(
          "Success",
          "Withdrawal successful! New balance: " + response.data.data
        );
        setAmount("");
      } else {
        Alert.alert(
          "Error",
          "Withdrawal failed: " + response.data.messages[0].content
        );
      }
    } catch (error) {
      console.error("Error during withdrawal: ", error);
      Alert.alert("Error", "An error occurred during withdrawal.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Withdraw</Text>
      </View>

      {/* Amount Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Amount:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="*Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      {/* Preset Buttons */}
      <View style={styles.chipsContainer}>
        {[50000, 100000, 200000, 500000, 1000000, 2000000].map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.chip,
              amount === value.toString() && styles.activeChip,
            ]}
            onPress={() => setAmount(value.toString())}
          >
            <Text style={styles.chipText}>
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
        style={[styles.submitButton, !amount && styles.submitButtonDisabled]}
        onPress={handleWithdraw}
        disabled={!amount}
      >
        <Text style={styles.submitButtonText}>Withdraw</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  title: {
    marginStart: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  activeChip: {
    backgroundColor: "#00cc69",
  },
  chipText: {
    fontSize: 14,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#00cc69",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "gray",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WithdrawScreen;
