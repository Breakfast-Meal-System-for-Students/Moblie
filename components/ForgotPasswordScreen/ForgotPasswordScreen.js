import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
  Image,
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
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Image
        source={{
          uri: "https://i.pinimg.com/736x/f5/2d/6f/f52d6faabc235a88e5ba2df70ff7228c.jpg",
        }}
        style={styles.icon}
      />

      <Text style={styles.headerText}>Forgot Password?</Text>

      <TextInput
        placeholder="Enter your email"
        style={styles.textInput}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Pressable style={styles.button} onPress={handleSendEmail}>
        <Text style={styles.buttonText}>Send Password Reset Request</Text>
      </Pressable>

      <View style={styles.policyContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Main")}>
          <Text style={styles.policyText}>
            <Text style={styles.policyLink}>Back to Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff", // Nền trắng
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: "black",
  },
  icon: {
    width: 300,
    height: 200,
    alignSelf: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#00cc69",
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 12,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    width: "100%",
    backgroundColor: "#00cc69",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  policyContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  policyText: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
  policyLink: {
    color: "#00cc69",
  },
});

export default ForgotPasswordScreen;
