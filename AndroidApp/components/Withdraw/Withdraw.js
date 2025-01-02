import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const WithdrawScreen = ({ navigation }) => {
  const [amount, setAmount] = useState("");

  const handleWithdraw = () => {
    alert(`You have requested a withdrawal ${amount} VND`);
    setAmount("");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Withdraw</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="*Enter the amount you want to withdraw"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <TouchableOpacity style={styles.button} onPress={handleWithdraw}>
          <Text style={styles.buttonText}>Withdraw</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#00cc69",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#00cc69",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default WithdrawScreen;
