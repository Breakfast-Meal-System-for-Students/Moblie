import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const OrderNowButton = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.orderButton} onPress={onPress}>
        <Text style={styles.orderButtonText}>Order Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  orderButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30, // Làm tròn góc nút
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OrderNowButton;
