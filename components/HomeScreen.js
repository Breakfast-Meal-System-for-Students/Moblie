import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.text}>
        Hello World. This text uses the Roboto font.
      </Text>
      <Button
        title="Go to Second Screen"
        onPress={() => navigation.navigate("SecondScreen")}
      />
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
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
    fontFamily: "Roboto",
    fontSize: 16,
    marginBottom: 20,
  },
});

export default HomeScreen;
