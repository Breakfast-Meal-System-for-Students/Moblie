import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation để điều hướng

const HomeScreen = () => {
  const navigation = useNavigation(); // Khai báo useNavigation để điều hướng giữa các màn hình

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.text}>
        Hello World. This text uses the Roboto font.
      </Text>
      <Button
        title="Go to Second Screen"
        onPress={() => navigation.navigate("SecondScreen")} // Điều hướng đến màn hình thứ hai
      />
      <Button
        title="Login"
        onPress={() => navigation.navigate("Login")} // Điều hướng đến màn hình đăng nhập
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontFamily: "Roboto", // Ensure the Roboto font is installed
    fontSize: 16,
    marginBottom: 20,
  },
});

export default HomeScreen;
