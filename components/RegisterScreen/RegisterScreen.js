import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Pressable,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Register() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(
      fullName.trim() !== "" &&
        lastName.trim() !== "" &&
        email.trim() !== "" &&
        password.trim() !== "" &&
        password === confirmPassword
    );
  }, [fullName, lastName, email, password, confirmPassword]);

  const handleRegister = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please complete all fields correctly.");
      return;
    }

    try {
      const response = await axios.post(
        "https://bms-fs-api.azurewebsites.net/api/Auth/register",
        {
          firstName: fullName,
          lastName,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      if (response.data.isSuccess) {
        await AsyncStorage.setItem("userToken", response.data.data.token);
        console.log(response.data.data.token);
        Alert.alert("Success", "Registration successful!", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        Alert.alert("Error", "Registration failed. Please check your details.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert(
        "Error",
        "An error occurred during registration. Please try again."
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <Text style={styles.headerText}>Register</Text>

      <TextInput
        placeholder="First Name"
        style={styles.textInput}
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        placeholder="Last Name"
        style={styles.textInput}
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        placeholder="Email"
        style={styles.textInput}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={styles.textInput}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirm Password"
        style={styles.textInput}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
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
    marginBottom: 1,
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
  signInText: {
    textAlign: "center",
    color: "#00cc69",
    fontSize: 16,
    marginTop: 10,
  },
});
