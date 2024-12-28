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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BuyCoins() {
  const navigation = useNavigation();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const STATUS_DEPOSIT = 5;
  const handleTopUp = (value) => {
    setAmount(value);
  };
  const handleSubmit = async () => {
    if (!amount || parseInt(amount) <= 1000) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    const token = await AsyncStorage.getItem("userToken");
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("status", STATUS_DEPOSIT);
    const result = await fetch(`https://bms-fs-api.azurewebsites.net/api/Wallet/UpdateBalance`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });
    const resBody = await result.json();
    if (resBody.isSuccess) {
      Alert.alert("Thành công", `Bạn đã nạp ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(amount))}`);
      navigation.goBack();
    } else {
      Alert.alert("Error", `Lỗi nạp tiền`);
    }
    // setLoading(true);
    // try {
    //   const token = await AsyncStorage.getItem("userToken");
    //   const amountTotal = amount < 1000 ? amount * 10000 : amount
    //   const jsonBody = {
    //     orderInfo,
    //     fullName,
    //     orderType,
    //     description,
    //     amount: amountTotal,
    //     returnUrl: `http://192.168.1.8:3000/BuyCoinsReturn?amount=${amountTotal}`
    //   };
    //   console.log(jsonBody);
    //   const response = await axios.post("https://bms-fs-api.azurewebsites.net/api/Payment/create-payment-url", jsonBody, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Accept: "*/*",
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });

    //   const { isSuccess, data } = response.data;
    //   if (isSuccess && data) {
    //     await Linking.openURL(data);
    //   } else {
    //     console.error(response);
    //     Alert.alert("Error", "Unable to initiate payment");
    //   }
    // } catch (error) {
    //   Alert.alert("Error", "An error occurred during payment processing");
    //   console.error(error);
    // } finally {
    //   setLoading(false);
    // }
    // Alert.alert("Thành công", `Bạn đã nạp ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(amount))}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Buy Coins</Text>
      </View>

      {/* Amount Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Amount:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      {/* Chips for Common Denominations */}
      <View style={styles.chipsContainer}>
        {[50000, 100000, 200000, 500000, 1000000].map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.chip,
              amount === value.toString() && styles.activeChip,
            ]}
            onPress={() => handleTopUp(value.toString())}
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

      {/* Top-Up Button */}
      <TouchableOpacity style={[
        styles.submitButton,
        loading && styles.submitButtonProcessing,
      ]} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitButtonText}>{loading && "Processing..." || "Buy Now"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

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
  backButton: {
    fontSize: 16,
    color: "blue",
    marginRight: 8,
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
  submitButtonProcessing: {
    backgroundColor: "gray",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
