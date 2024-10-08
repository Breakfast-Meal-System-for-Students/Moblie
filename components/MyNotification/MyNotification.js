import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MyNotification() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Notification</Text>
      {/* Add your notification content here */}
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
