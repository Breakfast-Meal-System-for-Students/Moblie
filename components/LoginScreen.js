import React from "react";
import {
  View,
  TextInput,
  Pressable,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Login({ onLogin }) {
  const navigation = useNavigation();
  const handleLogin = () => {
    navigation.navigate("Home");
  };
  return (
    <View style={styles.formContainer}>
      <TextInput placeholder="Email" style={styles.textInput} />
      <TextInput
        placeholder="Password"
        style={styles.textInput}
        secureTextEntry
      />
      <Pressable style={styles.formButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOG IN</Text>
      </Pressable>
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    paddingVertical: 100,
    paddingHorizontal: 20,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginVertical: 10,
    fontSize: 16,
  },
  formButton: {
    backgroundColor: "#00CC33",
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  linkContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  link: {
    color: "#009900",
    fontSize: 16,
    marginVertical: 5,
  },
});
