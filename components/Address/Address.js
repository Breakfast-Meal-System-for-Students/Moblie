import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Address() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Address</Text>
      {/* Add your address content here */}
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
