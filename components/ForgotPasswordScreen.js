import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  const handleSendEmail = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      Alert.alert("Error", "Email must end with '@gmail.com'");
      return;
    }

    Alert.alert("Success", "Password reset link sent to your email.");
    navigation.navigate("OTPScreen");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/564x/4e/a5/9f/4ea59fb67c528f2c78a30d4d366bf536.jpg",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.description}>
            Enter your email address below and we will send you a link to reset
            your password.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.button} onPress={handleSendEmail}>
            <Text style={styles.buttonText}>Send Password Reset Request</Text>
          </TouchableOpacity>
          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  box: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#009900",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#33CC33",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkContainer: {
    marginTop: 20,
  },
  link: {
    color: "#009900",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ForgotPasswordScreen;
