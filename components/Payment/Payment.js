import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Payment() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Payment</Text>
      {/* Add your payment methods or details here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
  },
});
